import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import {
  registerSchema,
  profileSchema,
  paging,
  uuid,
  text,
} from '../validation.js';
import { fail, transact } from '../http.js';
import { requireAdmin } from '../policies.js';
import { hashPassword } from '../security.js';
const fields = 'id,name,email,district,neighborhood,bio,phone,role,created_at';
const role = z.enum(['neighbor', 'moderator', 'admin']);
const create = registerSchema
  .omit({ smsOptIn: true })
  .extend({ role: role.default('neighbor') });
const update = profileSchema
  .omit({ smsOptIn: true, avatarMediaId: true })
  .extend({
    email: z
      .email()
      .max(254)
      .transform((s) => s.toLowerCase())
      .optional(),
    role: role.optional(),
  })
  .strict();
export function adminUserRoutes(db, auth) {
  const router = Router();
  router.use(auth, requireAdmin);
  const audit = (conn, actor, action, user) =>
    conn.execute(
      'INSERT INTO acciones_admin(admin_id,action,entity_id,reason) VALUES(?,?,?,?)',
      [actor, action, user, 'Gestión de cuentas desde administración'],
    );
  async function lock(conn, actor) {
    const [admins] = await conn.execute(
      "SELECT id FROM usuarios WHERE role='admin' AND deleted_at IS NULL ORDER BY id FOR UPDATE",
    );
    if (!admins.some((a) => a.id === actor))
      fail(403, 'Tu cuenta ya no tiene permisos de administrador.');
    return admins;
  }
  router.get('/', async (req, res) => {
    const { limit, offset } = paging(req.query);
    const search = req.query.search ? text(1, 120).parse(req.query.search) : '';
    const where =
        'deleted_at IS NULL' +
        (search ? ' AND (name LIKE ? OR email LIKE ?)' : ''),
      args = search ? ['%' + search + '%', '%' + search + '%'] : [];
    const [[count]] = await db.execute(
      'SELECT COUNT(*) AS n FROM usuarios WHERE ' + where,
      args,
    );
    const [users] = await db.execute(
      `SELECT ${fields} FROM usuarios WHERE ${where} ORDER BY created_at DESC,id LIMIT ${limit} OFFSET ${offset}`,
      args,
    );
    res.json({ users, total: Number(count.n) });
  });
  router.post('/', async (req, res) => {
    const v = create.parse(req.body),
      userId = randomUUID(),
      hash = await hashPassword(v.password);
    await transact(db, async (conn) => {
      await lock(conn, req.user.id);
      await conn.execute(
        'INSERT INTO usuarios(id,name,email,password_hash,district,neighborhood,phone,role) VALUES(?,?,?,?,?,?,?,?)',
        [
          userId,
          v.name,
          v.email,
          hash,
          v.district,
          v.neighborhood,
          v.phone,
          v.role,
        ],
      );
      await audit(conn, req.user.id, 'crear_cuenta', userId);
    });
    res.status(201).json({ id: userId });
  });
  router.patch('/:id', async (req, res) => {
    const userId = uuid.parse(req.params.id),
      v = update.parse(req.body);
    if (!Object.keys(v).length) fail(400, 'Indica los datos a actualizar.');
    await transact(db, async (conn) => {
      const admins = await lock(conn, req.user.id);
      const [users] = await conn.execute(
        'SELECT * FROM usuarios WHERE id=? AND deleted_at IS NULL FOR UPDATE',
        [userId],
      );
      if (!users.length) fail(404, 'Cuenta no encontrada.');
      const user = users[0],
        nextRole = v.role ?? user.role;
      if (userId === req.user.id && nextRole !== 'admin')
        fail(400, 'No puedes quitarte tu propio acceso de administrador.');
      if (user.role === 'admin' && nextRole !== 'admin' && admins.length <= 1)
        fail(400, 'Debe quedar al menos un administrador activo.');
      await conn.execute(
        'UPDATE usuarios SET name=?,email=?,district=?,neighborhood=?,bio=?,phone=?,role=? WHERE id=?',
        [
          v.name ?? user.name,
          v.email ?? user.email,
          v.district ?? user.district,
          v.neighborhood ?? user.neighborhood,
          v.bio ?? user.bio,
          v.phone ?? user.phone,
          nextRole,
          userId,
        ],
      );
      if (nextRole !== user.role || (v.email && v.email !== user.email)) {
        await conn.execute('DELETE FROM sesiones WHERE user_id=?', [userId]);
        await conn.execute(
          'UPDATE tokens_recuperacion SET used_at=UTC_TIMESTAMP() WHERE user_id=?',
          [userId],
        );
        await conn.execute('DELETE FROM codigos_recuperacion WHERE user_id=?', [
          userId,
        ]);
      }
      await audit(
        conn,
        req.user.id,
        nextRole !== user.role ? 'cambiar_rol_cuenta' : 'editar_cuenta',
        userId,
      );
    });
    res.json({ id: userId });
  });
  router.delete('/:id', async (req, res) => {
    const userId = uuid.parse(req.params.id);
    if (userId === req.user.id)
      fail(400, 'No puedes eliminar tu propia cuenta desde administración.');
    await transact(db, async (conn) => {
      const admins = await lock(conn, req.user.id);
      const [users] = await conn.execute(
        'SELECT role FROM usuarios WHERE id=? AND deleted_at IS NULL FOR UPDATE',
        [userId],
      );
      if (!users.length) fail(404, 'Cuenta no encontrada.');
      if (users[0].role === 'admin' && admins.length <= 1)
        fail(400, 'Debe quedar al menos un administrador activo.');
      await conn.execute(
        "UPDATE usuarios SET deleted_at=UTC_TIMESTAMP(),name='Cuenta eliminada',email=?,phone=NULL,sms_opt_in=0,avatar_url=NULL,bio='',district='',neighborhood='',password_hash='disabled',role='neighbor' WHERE id=?",
        ['deleted-' + userId + '@removed.invalid', userId],
      );
      await conn.execute('DELETE FROM sesiones WHERE user_id=?', [userId]);
      await conn.execute('DELETE FROM tokens_recuperacion WHERE user_id=?', [
        userId,
      ]);
      await conn.execute('DELETE FROM codigos_recuperacion WHERE user_id=?', [
        userId,
      ]);
      await conn.execute('DELETE FROM miembros_comunidad WHERE user_id=?', [
        userId,
      ]);
      await audit(conn, req.user.id, 'eliminar_cuenta', userId);
    });
    res.status(204).end();
  });
  return router;
}
