import { containsAbuse } from '../policies.js';
import { rateLimit } from 'express-rate-limit';
import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { uuid, id, text, paging } from '../validation.js';
import { fail, transact } from '../http.js';
export function messageRoutes(db, auth) {
  const router = Router();
  router.use(auth);
  const participant = async (conversation, userId) => {
    const [rows] = await db.execute(
      'SELECT id FROM conversaciones WHERE id=? AND (participant_a=? OR participant_b=?)',
      [conversation, userId, userId],
    );
    if (!rows.length) fail(404, 'Conversación no encontrada.');
  };
  router.get('/', async (req, res) => {
    const [rows] = await db.execute(
      'SELECT c.id,c.post_id,c.created_at,u.id AS neighbor_id,u.name AS neighbor_name,u.avatar_url AS neighbor_photo,(SELECT body FROM mensajes WHERE conversation_id=c.id ORDER BY id DESC LIMIT 1) AS last_message,(SELECT created_at FROM mensajes WHERE conversation_id=c.id ORDER BY id DESC LIMIT 1) AS last_at,(SELECT COUNT(*) FROM mensajes WHERE conversation_id=c.id AND sender_id<>? AND read_at IS NULL) AS unread FROM conversaciones c JOIN usuarios u ON u.id=IF(c.participant_a=?,c.participant_b,c.participant_a) WHERE c.participant_a=? OR c.participant_b=? ORDER BY COALESCE(last_at,c.created_at) DESC LIMIT 50',
      [req.user.id, req.user.id, req.user.id, req.user.id],
    );
    res.json({
      conversations: rows.map((r) => ({ ...r, unread: Number(r.unread) })),
    });
  });
  router.post('/', async (req, res) => {
    const input = z
      .object({ neighborId: uuid, postId: id.optional() })
      .strict()
      .parse(req.body);
    if (input.neighborId === req.user.id) fail(400, 'Selecciona otro vecino.');
    const conversationId = await transact(db, async (conn) => {
      const [users] = await conn.execute('SELECT id FROM usuarios WHERE id=?', [
        input.neighborId,
      ]);
      if (!users.length) fail(404, 'Vecino no encontrado.');
      if (input.postId) {
        const [rows] = await conn.execute(
          'SELECT id FROM publicaciones WHERE id=? AND moderated_at IS NULL AND (author_id=? OR author_id=?)',
          [input.postId, req.user.id, input.neighborId],
        );
        if (!rows.length)
          fail(400, 'La publicación no pertenece a los participantes.');
      }
      const [a, b] = [req.user.id, input.neighborId].sort();
      const newId = randomUUID();
      await conn.execute(
        'INSERT INTO conversaciones(id,participant_a,participant_b,post_id) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE id=id',
        [newId, a, b, input.postId ?? null],
      );
      const [rows] = await conn.execute(
        'SELECT id FROM conversaciones WHERE participant_a=? AND participant_b=?',
        [a, b],
      );
      if (input.postId)
        await conn.execute(
          'INSERT IGNORE INTO publicaciones_conversacion(conversation_id,post_id) VALUES(?,?)',
          [rows[0].id, input.postId],
        );
      return rows[0].id;
    });
    res.status(201).json({ id: conversationId });
  });
  router.get('/:id/messages', async (req, res) => {
    const conversation = uuid.parse(req.params.id);
    await participant(conversation, req.user.id);
    const { limit, offset } = paging(req.query);
    const [rows] = await db.execute(
      `SELECT id,sender_id,body,created_at,read_at FROM mensajes WHERE conversation_id=? ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`,
      [conversation],
    );
    res.json({ messages: rows.reverse() });
  });
  router.post(
    '/:id/messages',
    rateLimit({
      windowMs: 60000,
      limit: 30,
      legacyHeaders: false,
      standardHeaders: 'draft-8',
      message: { error: 'Espera un momento antes de enviar más mensajes.' },
    }),
    async (req, res) => {
      const conversation = uuid.parse(req.params.id);
      await participant(conversation, req.user.id);
      const { body } = z
        .object({ body: text(1, 4000) })
        .strict()
        .parse(req.body);
      if (containsAbuse(body))
        fail(
          400,
          'Reformula tu mensaje sin insultos. Mantengamos una conversación respetuosa.',
        );
      const [r] = await db.execute(
        'INSERT INTO mensajes(conversation_id,sender_id,body) VALUES(?,?,?)',
        [conversation, req.user.id, body],
      );
      res.status(201).json({ id: String(r.insertId) });
    },
  );
  router.patch('/:id/read', async (req, res) => {
    const conversation = uuid.parse(req.params.id);
    await participant(conversation, req.user.id);
    await db.execute(
      'UPDATE mensajes SET read_at=UTC_TIMESTAMP() WHERE conversation_id=? AND sender_id<>? AND read_at IS NULL',
      [conversation, req.user.id],
    );
    res.status(204).end();
  });
  return router;
}
