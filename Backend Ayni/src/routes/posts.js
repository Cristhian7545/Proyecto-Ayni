import path from 'node:path';
import { config } from '../config.js';
import { communityAccess } from '../community-access.js';
import { Router } from 'express';
import { z } from 'zod';
import { id, uuid, postSchema, text, paging } from '../validation.js';
import { fail, transact } from '../http.js';
const select = `SELECT p.*,u.name AS author_name,u.avatar_url AS author_photo,
 (SELECT url FROM archivos_multimedia WHERE post_id=p.id ORDER BY created_at LIMIT 1) AS image,
 (SELECT JSON_ARRAYAGG(JSON_OBJECT('id',id,'url',url)) FROM archivos_multimedia WHERE post_id=p.id) AS images,
 (SELECT COUNT(*) FROM me_gusta_publicaciones WHERE post_id=p.id) AS likes,
 (SELECT COUNT(*) FROM comentarios WHERE post_id=p.id) AS comments_count,
 EXISTS(SELECT 1 FROM me_gusta_publicaciones WHERE post_id=p.id AND user_id=?) AS liked,
 EXISTS(SELECT 1 FROM guardados_publicaciones WHERE post_id=p.id AND user_id=?) AS saved,
 x.offer,x.request,COALESCE(x.item_condition,s.item_condition) AS item_condition,
 COALESCE(x.quantity,s.quantity) AS quantity,s.priority,b.price,b.accepts_barter,
 a.days,a.start_time,a.end_time,a.modality
 FROM publicaciones p JOIN usuarios u ON u.id=p.author_id LEFT JOIN detalles_trueque x ON x.post_id=p.id
 LEFT JOIN detalles_apoyo s ON s.post_id=p.id LEFT JOIN detalles_emprendimiento b ON b.post_id=p.id LEFT JOIN disponibilidad a ON a.post_id=p.id`;
const dto = (row) => {
  const media =
    typeof row.images === 'string' ? JSON.parse(row.images) : row.images || [];
  const images = media.map((m) =>
    row.community_id ? '/api/posts/' + row.id + '/media/' + m.id : m.url,
  );
  return {
    ...row,
    image: row.community_id ? images[0] || null : row.image,
    images,
    pinned: !!Number(row.pinned),
    resolved: !!Number(row.resolved),
    liked: !!Number(row.liked),
    saved: !!Number(row.saved),
    likes: Number(row.likes),
    comments_count: Number(row.comments_count),
    accepts_barter: !!Number(row.accepts_barter),
  };
};
export function postRoutes(db, auth, optionalAuth) {
  const router = Router();
  async function visiblePost(req, res, next) {
    const [rows] = await db.execute(
      'SELECT id,community_id FROM publicaciones WHERE id=? AND moderated_at IS NULL',
      [id.parse(req.params.id)],
    );
    if (!rows.length) fail(404, 'Publicación no encontrada.');
    if (rows[0].community_id)
      await communityAccess(db, rows[0].community_id, req.user);
    next();
  }
  router.use(optionalAuth);
  router.get('/', async (req, res) => {
    const { limit, offset } = paging(req.query),
      clauses = ['p.moderated_at IS NULL'],
      values = [];
    const viewer = req.user?.id || null;
    if (req.query.community) {
      const group = id.parse(req.query.community);
      await communityAccess(db, group, req.user);
      clauses.push('p.community_id=?');
      values.push(group);
    } else if (req.query.author || req.query.saved === '1') {
      clauses.push(
        "(p.community_id IS NULL OR EXISTS(SELECT 1 FROM comunidades c JOIN miembros_comunidad m ON m.community_id=c.id WHERE c.id=p.community_id AND c.status='approved' AND m.user_id=?))",
      );
      values.push(viewer);
    } else clauses.push('p.community_id IS NULL');
    if (req.query.module) {
      clauses.push('p.module=?');
      values.push(
        z
          .enum(['trueque', 'apoyo', 'emprendimiento', 'aviso'])
          .parse(req.query.module),
      );
    }
    if (req.query.author) {
      clauses.push('p.author_id=?');
      values.push(z.uuid().parse(req.query.author));
    }
    if (req.query.saved === '1') {
      if (!viewer) fail(401, 'Inicia sesión para ver tus guardados.');
      clauses.push(
        'EXISTS(SELECT 1 FROM guardados_publicaciones g WHERE g.post_id=p.id AND g.user_id=?)',
      );
      values.push(viewer);
    }
    const base = clauses.join(' AND ');
    const [states] = await db.execute(
      'SELECT p.status,COUNT(*) AS n FROM publicaciones p WHERE ' +
        base +
        ' GROUP BY p.status',
      values,
    );
    const counts = { active: 0, completed: 0, total: 0, categories: {} };
    for (const row of states)
      if (row.status !== 'archived') {
        counts[row.status] = Number(row.n);
        counts.total += Number(row.n);
      }
    const status = z
      .enum(['active', 'completed', 'all'])
      .parse(req.query.status || 'active');
    if (status === 'all') clauses.push("p.status IN ('active','completed')");
    else {
      clauses.push('p.status=?');
      values.push(status);
    }
    const [categories] = await db.execute(
      'SELECT p.category,COUNT(*) AS n FROM publicaciones p WHERE ' +
        clauses.join(' AND ') +
        ' GROUP BY p.category',
      values,
    );
    for (const row of categories)
      counts.categories[row.category] = Number(row.n);
    if (req.query.category) {
      clauses.push('p.category=?');
      values.push(text(1, 80).parse(req.query.category));
    }
    const where = clauses.join(' AND ');
    const [[total]] = await db.execute(
      'SELECT COUNT(*) AS n FROM publicaciones p WHERE ' + where,
      values,
    );
    const [rows] = await db.execute(
      select +
        ' WHERE ' +
        where +
        ` ORDER BY p.pinned DESC,p.id DESC LIMIT ${limit} OFFSET ${offset}`,
      [viewer, viewer, ...values],
    );
    res.json({
      posts: rows.map(dto),
      counts,
      total: Number(total.n),
      limit,
      offset,
    });
  });
  router.post('/', auth, async (req, res) => {
    const input = postSchema.parse({
      ...req.body,
      district: req.body?.district ?? req.user.district,
      neighborhood: req.body?.neighborhood ?? req.user.neighborhood,
    });
    const postId = await transact(db, async (conn) => {
      if (input.communityId)
        await communityAccess(conn, input.communityId, req.user, {
          admin: false,
        });
      const [result] = await conn.execute(
        'INSERT INTO publicaciones(author_id,module,category,title,description,district,neighborhood,community_id) VALUES(?,?,?,?,?,?,?,?)',
        [
          req.user.id,
          input.module,
          input.category,
          input.title,
          input.description,
          input.district,
          input.neighborhood,
          input.communityId ?? null,
        ],
      );
      const postId = String(result.insertId);
      if (input.module === 'trueque')
        await conn.execute(
          'INSERT INTO detalles_trueque(post_id,offer,request,item_condition,quantity) VALUES(?,?,?,?,?)',
          [
            postId,
            input.offer,
            input.request,
            input.condition ?? null,
            input.quantity,
          ],
        );
      if (input.module === 'apoyo')
        await conn.execute(
          'INSERT INTO detalles_apoyo(post_id,priority,item_condition,quantity) VALUES(?,?,?,?)',
          [postId, input.priority, input.condition ?? null, input.quantity],
        );
      if (input.module === 'emprendimiento')
        await conn.execute(
          'INSERT INTO detalles_emprendimiento(post_id,price,accepts_barter) VALUES(?,?,?)',
          [postId, input.price, input.acceptsBarter],
        );
      if (input.days)
        await conn.execute(
          'INSERT INTO disponibilidad(post_id,days,start_time,end_time,modality) VALUES(?,?,?,?,?)',
          [postId, input.days, input.start, input.end, input.mode],
        );
      for (const mediaId of new Set([
        ...(input.mediaIds || []),
        ...(input.mediaId ? [input.mediaId] : []),
      ])) {
        const [media] = await conn.execute(
          'UPDATE archivos_multimedia SET post_id=? WHERE id=? AND owner_id=? AND post_id IS NULL',
          [postId, mediaId, req.user.id],
        );
        if (!media.affectedRows)
          fail(400, 'La imagen no está disponible para esta publicación.');
      }
      return postId;
    });
    res.status(201).json({ id: postId });
  });
  router.get('/featured', async (req, res) => {
    const viewer = req.user?.id || null;
    const [rows] = await db.execute(
      'SELECT * FROM (' +
        select +
        " WHERE p.community_id IS NULL AND p.status='active' AND p.moderated_at IS NULL AND p.resolved=0 AND (p.pinned=1 OR EXISTS(SELECT 1 FROM me_gusta_publicaciones l WHERE l.post_id=p.id) OR EXISTS(SELECT 1 FROM comentarios c WHERE c.post_id=p.id))) featured ORDER BY pinned DESC,(likes+comments_count) DESC,id DESC LIMIT 6",
      [viewer, viewer],
    );
    res.json({ posts: rows.map(dto) });
  });
  router.get('/:id', async (req, res) => {
    const viewer = req.user?.id || null;
    const [rows] = await db.execute(
      select +
        ' WHERE p.id=? AND (p.moderated_at IS NULL OR p.author_id=? OR ?=1)',
      [
        viewer,
        viewer,
        id.parse(req.params.id),
        viewer,
        req.user?.role === 'admin' ? 1 : 0,
      ],
    );
    if (!rows.length) fail(404, 'Publicación no encontrada.');
    if (rows[0].community_id)
      await communityAccess(db, rows[0].community_id, req.user);
    res.json({ post: dto(rows[0]) });
  });
  router.patch('/:id/status', auth, visiblePost, async (req, res) => {
    const postId = id.parse(req.params.id),
      input = z
        .object({ status: z.enum(['active', 'completed', 'archived']) })
        .strict()
        .parse(req.body);
    const [r] = await db.execute(
      'UPDATE publicaciones SET status=? WHERE id=? AND author_id=? AND moderated_at IS NULL AND resolved=0',
      [input.status, postId, req.user.id],
    );
    if (!r.affectedRows) fail(404, 'No se encontró una publicación propia.');
    res.json({ id: postId, status: input.status });
  });
  router.delete('/:id', auth, async (req, res) => {
    const [r] = await db.execute(
      'DELETE FROM publicaciones WHERE id=? AND author_id=?',
      [id.parse(req.params.id), req.user.id],
    );
    if (!r.affectedRows) fail(404, 'No se encontró una publicación propia.');
    res.status(204).end();
  });
  router.put('/:id/like', auth, visiblePost, async (req, res) => {
    const postId = id.parse(req.params.id);
    await db.execute(
      'INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(?,?)',
      [postId, req.user.id],
    );
    const [[r]] = await db.execute(
      'SELECT COUNT(*) AS n FROM me_gusta_publicaciones WHERE post_id=?',
      [postId],
    );
    res.json({ liked: true, likes: Number(r.n) });
  });
  router.delete('/:id/like', auth, visiblePost, async (req, res) => {
    const postId = id.parse(req.params.id);
    await db.execute(
      'DELETE FROM me_gusta_publicaciones WHERE post_id=? AND user_id=?',
      [postId, req.user.id],
    );
    const [[r]] = await db.execute(
      'SELECT COUNT(*) AS n FROM me_gusta_publicaciones WHERE post_id=?',
      [postId],
    );
    res.json({ liked: false, likes: Number(r.n) });
  });
  router.put('/:id/saved', auth, visiblePost, async (req, res) => {
    await db.execute(
      'INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(?,?)',
      [id.parse(req.params.id), req.user.id],
    );
    res.json({ saved: true });
  });
  router.delete('/:id/saved', auth, async (req, res) => {
    await db.execute(
      'DELETE FROM guardados_publicaciones WHERE post_id=? AND user_id=?',
      [id.parse(req.params.id), req.user.id],
    );
    res.json({ saved: false });
  });
  router.get('/:id/media/:mediaId', auth, visiblePost, async (req, res) => {
    const [rows] = await db.execute(
      'SELECT url FROM archivos_multimedia WHERE id=? AND post_id=?',
      [uuid.parse(req.params.mediaId), id.parse(req.params.id)],
    );
    if (!rows.length) fail(404, 'Foto no encontrada.');
    res.set('Cache-Control', 'private, no-store');
    res.sendFile(path.join(config.uploads, path.basename(rows[0].url)));
  });
  router.get('/:id/comments', visiblePost, async (req, res) => {
    const [rows] = await db.execute(
      'SELECT c.id,c.body,c.created_at,u.name AS author FROM comentarios c JOIN usuarios u ON u.id=c.author_id WHERE c.post_id=? ORDER BY c.id DESC LIMIT 50',
      [id.parse(req.params.id)],
    );
    res.json({ comments: rows });
  });
  router.post('/:id/comments', auth, visiblePost, async (req, res) => {
    const { body } = z
      .object({ body: text(1, 2000) })
      .strict()
      .parse(req.body);
    const [r] = await db.execute(
      'INSERT INTO comentarios(post_id,author_id,body) VALUES(?,?,?)',
      [id.parse(req.params.id), req.user.id, body],
    );
    res.status(201).json({ id: String(r.insertId) });
  });
  return router;
}
