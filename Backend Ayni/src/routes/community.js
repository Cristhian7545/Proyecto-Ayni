import { communityAccess } from '../community-access.js';
import { Router } from 'express';
import { z } from 'zod';
import { id, text, paging, communitySchema } from '../validation.js';
import { fail } from '../http.js';
export function communityRoutes(db, auth, optionalAuth) {
  const router = Router();
  router.use(optionalAuth);
  router.get('/', async (req, res) => {
    const { limit, offset } = paging(req.query);
    const args = [req.user?.id || null];
    const [groups] = await db.execute(
      "SELECT category,COUNT(*) AS n FROM comunidades WHERE status='approved' GROUP BY category",
    );
    const counts = Object.fromEntries(
      groups.map((g) => [g.category, Number(g.n)]),
    );
    let filter = "c.status='approved'";
    if (req.query.category) {
      filter += ' AND c.category=?';
      args.push(text(1, 80).parse(req.query.category));
    }
    const [[total]] = await db.execute(
      'SELECT COUNT(*) AS n FROM comunidades c WHERE ' + filter,
      args.slice(1),
    );
    const [rows] = await db.execute(
      `SELECT c.*,(SELECT COUNT(*) FROM miembros_comunidad WHERE community_id=c.id) AS members,EXISTS(SELECT 1 FROM miembros_comunidad WHERE community_id=c.id AND user_id=?) AS joined FROM comunidades c WHERE ${filter} ORDER BY c.id DESC LIMIT ${limit} OFFSET ${offset}`,
      args,
    );
    res.json({
      communities: rows.map((c) => ({
        ...c,
        members: Number(c.members),
        joined: !!Number(c.joined),
      })),
      total: Number(total.n),
      counts,
    });
  });
  router.get('/pending', auth, async (req, res) => {
    if (!['moderator', 'admin'].includes(req.user.role))
      fail(403, 'Esta acción requiere un moderador.');
    const [rows] = await db.execute(
      "SELECT * FROM comunidades WHERE status='pending' ORDER BY id LIMIT 50",
    );
    res.json({ communities: rows });
  });
  router.get('/:id', async (req, res) => {
    const communityId = id.parse(req.params.id);
    const [rows] = await db.execute(
      "SELECT c.*,EXISTS(SELECT 1 FROM miembros_comunidad WHERE community_id=c.id AND user_id=?) AS joined,(SELECT COUNT(*) FROM miembros_comunidad WHERE community_id=c.id) AS members FROM comunidades c WHERE c.id=? AND c.status='approved'",
      [req.user?.id || null, communityId],
    );
    if (!rows.length) fail(404, 'Comunidad no disponible.');
    res.json({
      community: {
        ...rows[0],
        joined: !!Number(rows[0].joined),
        members: Number(rows[0].members),
      },
    });
  });
  router.post('/', auth, async (req, res) => {
    const v = communitySchema.parse(req.body);
    const [r] = await db.execute(
      'INSERT INTO comunidades(creator_id,name,category,district,description) VALUES(?,?,?,?,?)',
      [req.user.id, v.name, v.category, v.district, v.description],
    );
    res.status(201).json({ id: String(r.insertId), status: 'pending' });
  });
  router.patch('/:id/status', auth, async (req, res) => {
    if (!['moderator', 'admin'].includes(req.user.role))
      fail(403, 'Esta acción requiere un moderador.');
    const { status } = z
      .object({ status: z.enum(['approved', 'rejected']) })
      .strict()
      .parse(req.body);
    const [r] = await db.execute(
      "UPDATE comunidades SET status=? WHERE id=? AND status='pending'",
      [status, id.parse(req.params.id)],
    );
    if (!r.affectedRows) fail(404, 'Solicitud pendiente no encontrada.');
    res.json({ status });
  });
  router.put('/:id/membership', auth, async (req, res) => {
    const group = id.parse(req.params.id);
    const [rows] = await db.execute(
      "SELECT id FROM comunidades WHERE id=? AND status='approved'",
      [group],
    );
    if (!rows.length) fail(404, 'Comunidad no disponible.');
    await db.execute(
      'INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(?,?)',
      [group, req.user.id],
    );
    res.status(204).end();
  });
  router.delete('/:id/membership', auth, async (req, res) => {
    await db.execute(
      'DELETE FROM miembros_comunidad WHERE community_id=? AND user_id=?',
      [id.parse(req.params.id), req.user.id],
    );
    res.status(204).end();
  });
  return router;
}
