import { Router } from 'express';
import { z } from 'zod';
import { paging, text } from '../validation.js';
export function searchRoutes(db, optionalAuth) {
  const router = Router();
  router.use(optionalAuth);
  router.get('/', async (req, res) => {
    const q = text(2, 120).parse(req.query.q),
      type = z
        .enum(['posts', 'events', 'communities', 'users'])
        .parse(req.query.type || 'posts'),
      { limit, offset } = paging(req.query),
      district = req.user?.district || null;
    const sources = {
      posts: {
        from: 'publicaciones p JOIN usuarios u ON u.id=p.author_id',
        where:
          "p.community_id IS NULL AND p.moderated_at IS NULL AND p.status='active'",
        district: 'p.district',
        search:
          "CONCAT_WS(' ',p.title,p.description,p.category,u.name,p.neighborhood)",
        fields:
          'p.id,p.title,p.description,p.district,p.module,u.name AS author',
        sort: 'p.id',
      },
      events: {
        from: 'eventos p',
        where: '1=1',
        district: 'p.district',
        search: "CONCAT_WS(' ',p.title,p.description,p.category,p.location)",
        fields: 'p.id,p.title,p.description,p.district,p.location,p.starts_at',
        sort: 'p.id',
      },
      communities: {
        from: 'comunidades p',
        where: "p.status='approved'",
        district: 'p.district',
        search: "CONCAT_WS(' ',p.name,p.description,p.category)",
        fields: 'p.id,p.name AS title,p.description,p.district,p.category',
        sort: 'p.id',
      },
      users: {
        from: 'usuarios p',
        where: 'p.deleted_at IS NULL',
        district: 'p.district',
        search: "CONCAT_WS(' ',p.name,p.bio,p.neighborhood)",
        fields:
          'p.id,p.name AS title,p.bio AS description,p.district,p.neighborhood',
        sort: 'p.created_at',
      },
    };
    const counts = {};
    let rows = [];
    for (const [kind, s] of Object.entries(sources)) {
      const where =
          s.where +
          ' AND LOCATE(?, ' +
          s.search +
          ')>0' +
          (district ? ' AND ' + s.district + '=?' : ''),
        values = district ? [q, district] : [q];
      const [[count]] = await db.execute(
        'SELECT COUNT(*) AS n FROM ' + s.from + ' WHERE ' + where,
        values,
      );
      counts[kind] = Number(count.n);
      if (kind === type)
        [rows] = await db.execute(
          `SELECT ${s.fields} FROM ${s.from} WHERE ${where} ORDER BY ${s.sort} DESC LIMIT ${limit} OFFSET ${offset}`,
          values,
        );
    }
    res.json({
      results: rows,
      type,
      q,
      district,
      counts,
      total: counts[type],
      limit,
      offset,
    });
  });
  return router;
}
