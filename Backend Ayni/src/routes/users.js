import { Router } from 'express';
import { z } from 'zod';
import { uuid, profileSchema, text, id } from '../validation.js';
import { fail, publicUser } from '../http.js';
export function userRoutes(db, auth) {
  const router = Router();
  router.patch('/me', auth, async (req, res) => {
    const input = profileSchema.parse(req.body);
    if (
      (input.smsOptIn ?? !!Number(req.user.sms_opt_in)) &&
      !(input.phone ?? req.user.phone)
    )
      fail(400, 'Agrega un celular válido antes de activar las alertas SMS.');
    let avatar = req.user.avatar_url;
    if (input.avatarMediaId === null) avatar = null;
    else if (input.avatarMediaId) {
      const [rows] = await db.execute(
        'SELECT url FROM archivos_multimedia WHERE id=? AND owner_id=?',
        [input.avatarMediaId, req.user.id],
      );
      if (!rows.length) fail(400, 'La imagen no pertenece a tu cuenta.');
      avatar = rows[0].url;
    }
    await db.execute(
      'UPDATE usuarios SET name=?,neighborhood=?,bio=?,avatar_url=?,district=?,phone=?,sms_opt_in=? WHERE id=?',
      [
        input.name ?? req.user.name,
        input.neighborhood ?? req.user.neighborhood,
        input.bio ?? req.user.bio,
        avatar,
        input.district ?? req.user.district,
        input.phone ?? req.user.phone,
        input.smsOptIn ?? !!req.user.sms_opt_in,
        req.user.id,
      ],
    );
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE id=?', [
      req.user.id,
    ]);
    res.json({ user: publicUser(rows[0]) });
  });
  router.get('/me/communities', auth, async (req, res) => {
    const [communities] = await db.execute(
      "SELECT c.*,(SELECT COUNT(*) FROM miembros_comunidad WHERE community_id=c.id) AS members FROM comunidades c JOIN miembros_comunidad m ON m.community_id=c.id WHERE m.user_id=? AND c.status='approved' ORDER BY m.joined_at DESC,c.id DESC",
      [req.user.id],
    );
    res.json({
      communities: communities.map((c) => ({
        ...c,
        members: Number(c.members),
      })),
    });
  });
  router.get('/:id/communities', async (req, res) => {
    const userId = uuid.parse(req.params.id);
    const [users] = await db.execute(
      'SELECT id FROM usuarios WHERE id=? AND deleted_at IS NULL',
      [userId],
    );
    if (!users.length) fail(404, 'Vecino no encontrado.');
    const [communities] = await db.execute(
      "SELECT c.id,c.name,c.description,c.district,c.category,(SELECT COUNT(*) FROM miembros_comunidad WHERE community_id=c.id) AS members FROM comunidades c JOIN miembros_comunidad m ON m.community_id=c.id WHERE m.user_id=? AND c.status='approved' ORDER BY m.joined_at DESC,c.id DESC",
      [userId],
    );
    res.json({
      communities: communities.map((c) => ({
        ...c,
        members: Number(c.members),
      })),
    });
  });
  router.get('/:id', async (req, res) => {
    const userId = uuid.parse(req.params.id);
    const [rows] = await db.execute(
      'SELECT id,name,district,neighborhood,bio,avatar_url AS photo,created_at FROM usuarios WHERE id=? AND deleted_at IS NULL',
      [userId],
    );
    if (!rows.length) fail(404, 'Vecino no encontrado.');
    res.json({ user: rows[0] });
  });
  router.get('/:id/reviews', async (req, res) => {
    const userId = uuid.parse(req.params.id);
    const [rows] = await db.execute(
      'SELECT r.id,r.body,r.created_at,u.name AS author,p.title AS publication FROM resenas r JOIN usuarios u ON u.id=r.author_id JOIN publicaciones p ON p.id=r.post_id WHERE p.community_id IS NULL AND r.reviewed_user_id=? ORDER BY r.id DESC LIMIT 50',
      [userId],
    );
    res.json({ reviews: rows });
  });
  router.post('/:id/reviews', auth, async (req, res) => {
    const userId = uuid.parse(req.params.id);
    if (userId === req.user.id) fail(400, 'No puedes recomendarte a ti mismo.');
    const input = z
      .object({ postId: id, body: text(5, 1000) })
      .strict()
      .parse(req.body);
    const [posts] = await db.execute(
      "SELECT id FROM publicaciones WHERE id=? AND author_id=? AND community_id IS NULL AND status='completed'",
      [input.postId, userId],
    );
    if (!posts.length)
      fail(
        400,
        'La reseña debe corresponder a una publicación completada de este vecino.',
      );
    const [contact] = await db.execute(
      'SELECT c.id FROM conversaciones c JOIN publicaciones_conversacion cp ON cp.conversation_id=c.id WHERE cp.post_id=? AND ((c.participant_a=? AND c.participant_b=?) OR (c.participant_a=? AND c.participant_b=?))',
      [input.postId, req.user.id, userId, userId, req.user.id],
    );
    if (!contact.length)
      fail(
        403,
        'Solo puedes recomendar una publicación en la que coordinaste con su autor.',
      );
    const [result] = await db.execute(
      'INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) VALUES(?,?,?,?)',
      [input.postId, req.user.id, userId, input.body],
    );
    res.status(201).json({ id: String(result.insertId) });
  });
  return router;
}
