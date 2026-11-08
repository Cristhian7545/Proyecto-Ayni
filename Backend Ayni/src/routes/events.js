import { Router } from 'express';
import { id, eventSchema, paging } from '../validation.js';
import { fail } from '../http.js';
export function eventRoutes(db, auth, optionalAuth) {
  const router = Router();
  router.use(optionalAuth);
  router.get('/', async (req, res) => {
    const { limit, offset } = paging(req.query),
      clauses = [],
      args = [],
      viewer = req.user?.id || null;
    if (req.user?.district) {
      clauses.push('e.district=?');
      args.push(req.user.district);
    }
    const [groups] = await db.execute(
      'SELECT category,COUNT(*) AS n FROM eventos e' +
        (clauses.length ? ' WHERE ' + clauses.join(' AND ') : '') +
        ' GROUP BY category',
      args,
    );
    const counts = Object.fromEntries(
      groups.map((g) => [g.category, Number(g.n)]),
    );
    if (req.query.category) {
      clauses.push('e.category=?');
      args.push(String(req.query.category).slice(0, 80));
    }
    const where = clauses.length ? ' WHERE ' + clauses.join(' AND ') : '';
    const [[total]] = await db.execute(
      'SELECT COUNT(*) AS n FROM eventos e' + where,
      args,
    );
    const [rows] = await db.execute(
      `SELECT e.*,u.name AS organizer,(SELECT COUNT(*) FROM intereses_eventos WHERE event_id=e.id) AS interested,EXISTS(SELECT 1 FROM intereses_eventos WHERE event_id=e.id AND user_id=?) AS selected FROM eventos e JOIN usuarios u ON u.id=e.organizer_id${where} ORDER BY e.id DESC LIMIT ${limit} OFFSET ${offset}`,
      [viewer, ...args],
    );
    res.json({
      events: rows.map((e) => ({
        ...e,
        interested: Number(e.interested),
        selected: !!Number(e.selected),
      })),
      total: Number(total.n),
      counts,
    });
  });
  router.get('/:id', async (req, res) => {
    const [rows] = await db.execute(
      'SELECT e.*,u.name AS organizer,(SELECT COUNT(*) FROM intereses_eventos WHERE event_id=e.id) AS interested,EXISTS(SELECT 1 FROM intereses_eventos WHERE event_id=e.id AND user_id=?) AS selected FROM eventos e JOIN usuarios u ON u.id=e.organizer_id WHERE e.id=?',
      [req.user?.id || null, id.parse(req.params.id)],
    );
    if (!rows.length) fail(404, 'Evento no encontrado.');
    res.json({
      event: {
        ...rows[0],
        interested: Number(rows[0].interested),
        selected: !!Number(rows[0].selected),
      },
    });
  });
  router.post('/', auth, async (req, res) => {
    const v = eventSchema.parse(req.body);
    let image = null;
    if (v.mediaId) {
      const [rows] = await db.execute(
        'SELECT url FROM archivos_multimedia WHERE id=? AND owner_id=?',
        [v.mediaId, req.user.id],
      );
      if (!rows.length) fail(400, 'La imagen no pertenece a tu cuenta.');
      image = rows[0].url;
    }
    const [r] = await db.execute(
      'INSERT INTO eventos(organizer_id,title,description,category,location,starts_at,ends_at,contribution,image_url,district) VALUES(?,?,?,?,?,?,?,?,?,?)',
      [
        req.user.id,
        v.title,
        v.description,
        v.category,
        v.location,
        new Date(v.startsAt),
        new Date(v.endsAt),
        v.contribution,
        image,
        v.district ?? req.user.district,
      ],
    );
    res.status(201).json({ id: String(r.insertId) });
  });
  router.delete('/:id', auth, async (req, res) => {
    const [r] = await db.execute(
      'DELETE FROM eventos WHERE id=? AND organizer_id=?',
      [id.parse(req.params.id), req.user.id],
    );
    if (!r.affectedRows) fail(404, 'No se encontró un evento propio.');
    res.status(204).end();
  });
  router.put('/:id/interest', auth, async (req, res) => {
    const eventId = id.parse(req.params.id);
    await db.execute(
      'INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(?,?)',
      [eventId, req.user.id],
    );
    const [[r]] = await db.execute(
      'SELECT COUNT(*) AS n FROM intereses_eventos WHERE event_id=?',
      [eventId],
    );
    res.json({ selected: true, interested: Number(r.n) });
  });
  router.delete('/:id/interest', auth, async (req, res) => {
    const eventId = id.parse(req.params.id);
    await db.execute(
      'DELETE FROM intereses_eventos WHERE event_id=? AND user_id=?',
      [eventId, req.user.id],
    );
    const [[r]] = await db.execute(
      'SELECT COUNT(*) AS n FROM intereses_eventos WHERE event_id=?',
      [eventId],
    );
    res.json({ selected: false, interested: Number(r.n) });
  });
  return router;
}
