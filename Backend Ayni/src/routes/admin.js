import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { rateLimit } from 'express-rate-limit';
import { id, text, paging, district, uuid } from '../validation.js';
import { requireAdmin } from '../policies.js';
import { fail, transact } from '../http.js';
import { smsReady, mailReady, sendSms } from '../services/delivery.js';
export function adminRoutes(db, auth, services = {}) {
  const router = Router(),
    ready = services.smsReady || smsReady,
    send = services.sendSms || sendSms;
  router.use(auth, requireAdmin);
  const audit = (conn, user, action, entity, reason) =>
    conn.execute(
      'INSERT INTO acciones_admin(admin_id,action,entity_id,reason) VALUES(?,?,?,?)',
      [user, action, entity, reason],
    );
  router.get('/summary', async (req, res) => {
    const [[posts]] = await db.query(
      'SELECT COUNT(*) AS n FROM publicaciones WHERE moderated_at IS NULL',
    );
    const [[pending]] = await db.query(
      "SELECT COUNT(*) AS n FROM comunidades WHERE status='pending'",
    );
    res.json({
      posts: Number(posts.n),
      pending: Number(pending.n),
      smsConfigured: ready(),
      mailConfigured: (services.mailReady || mailReady)(),
    });
  });
  router.get('/posts', async (req, res) => {
    const { limit, offset } = paging(req.query),
      values = [],
      clauses = [
        req.query.hidden === '1'
          ? 'p.moderated_at IS NOT NULL'
          : 'p.moderated_at IS NULL',
      ];
    if (req.query.module) {
      clauses.push('p.module=?');
      values.push(
        z
          .enum(['trueque', 'apoyo', 'emprendimiento', 'aviso'])
          .parse(req.query.module),
      );
    }
    const where = clauses.join(' AND ');
    const [[count]] = await db.execute(
      'SELECT COUNT(*) AS n FROM publicaciones p WHERE ' + where,
      values,
    );
    const [rows] = await db.execute(
      `SELECT p.*,u.name AS author_name FROM publicaciones p JOIN usuarios u ON u.id=p.author_id WHERE ${where} ORDER BY p.id DESC LIMIT ${limit} OFFSET ${offset}`,
      values,
    );
    res.json({
      posts: rows.map((p) => ({
        ...p,
        pinned: !!Number(p.pinned),
        resolved: !!Number(p.resolved),
      })),
      total: Number(count.n),
    });
  });
  router.patch('/posts/:id/pin', async (req, res) => {
    const postId = id.parse(req.params.id),
      { pinned } = z.object({ pinned: z.boolean() }).strict().parse(req.body);
    await transact(db, async (conn) => {
      const [r] = await conn.execute(
        "UPDATE publicaciones SET pinned=? WHERE id=? AND moderated_at IS NULL AND status='active' AND resolved=0",
        [pinned, postId],
      );
      if (!r.affectedRows)
        fail(404, 'Solo se pueden fijar publicaciones activas y visibles.');
      await audit(
        conn,
        req.user.id,
        pinned ? 'fijar' : 'desfijar',
        postId,
        'Cambio de prioridad en el mural',
      );
    });
    res.json({ pinned });
  });
  router.patch('/posts/:id/resolve', async (req, res) => {
    const postId = id.parse(req.params.id),
      { resolved } = z
        .object({ resolved: z.boolean() })
        .strict()
        .parse(req.body);
    await transact(db, async (conn) => {
      const [r] = await conn.execute(
        "UPDATE publicaciones SET resolved=?,status=?,pinned=0 WHERE id=? AND module='apoyo' AND moderated_at IS NULL",
        [resolved, resolved ? 'completed' : 'active', postId],
      );
      if (!r.affectedRows) fail(404, 'Apoyo no encontrado.');
      await audit(
        conn,
        req.user.id,
        resolved ? 'resolver_apoyo' : 'reabrir_apoyo',
        postId,
        resolved ? 'Caso marcado como resuelto' : 'Caso reabierto',
      );
    });
    res.json({ resolved });
  });
  router.delete('/posts/:id', async (req, res) => {
    const postId = id.parse(req.params.id),
      { reason } = z
        .object({ reason: text(5, 500) })
        .strict()
        .parse(req.body);
    await transact(db, async (conn) => {
      const [r] = await conn.execute(
        "UPDATE publicaciones SET moderated_at=UTC_TIMESTAMP(),moderation_reason=?,status='archived',pinned=0 WHERE id=? AND moderated_at IS NULL",
        [reason, postId],
      );
      if (!r.affectedRows) fail(404, 'Publicación visible no encontrada.');
      await audit(conn, req.user.id, 'retirar_publicacion', postId, reason);
    });
    res.status(204).end();
  });
  router.post('/posts/:id/restore', async (req, res) => {
    const postId = id.parse(req.params.id);
    await transact(db, async (conn) => {
      const [r] = await conn.execute(
        "UPDATE publicaciones SET moderated_at=NULL,moderation_reason=NULL,status=IF(resolved=1,'completed','active') WHERE id=? AND moderated_at IS NOT NULL",
        [postId],
      );
      if (!r.affectedRows) fail(404, 'Publicación retirada no encontrada.');
      await audit(
        conn,
        req.user.id,
        'restaurar_publicacion',
        postId,
        'Restaurada desde el panel',
      );
    });
    res.status(204).end();
  });
  router.get('/alerts', async (req, res) => {
    const [rows] = await db.execute(
      `SELECT a.*,COUNT(d.id) AS total,SUM(d.status IN ('queued','accepted','sending','sent','delivered')) AS accepted,SUM(d.status='failed') AS failed,SUM(d.status='unknown') AS uncertain,SUM(d.status='skipped') AS skipped FROM alertas_sms a LEFT JOIN destinatarios_alerta d ON d.alert_id=a.id GROUP BY a.id ORDER BY a.created_at DESC LIMIT 25`,
    );
    res.json({
      alerts: rows.map((r) => ({
        ...r,
        total: Number(r.total),
        accepted: Number(r.accepted),
        failed: Number(r.failed),
        uncertain: Number(r.uncertain),
        skipped: Number(r.skipped),
      })),
    });
  });
  router.post('/alerts/preview', async (req, res) => {
    const v = z
      .object({ district, message: text(10, 280) })
      .strict()
      .parse(req.body);
    const [users] = await db.execute(
      'SELECT MIN(id) AS id FROM usuarios WHERE district=? AND sms_opt_in=1 AND phone REGEXP ? GROUP BY phone ORDER BY id',
      [v.district, '^[+]519[0-9]{8}$'],
    );
    const max = Math.min(
      100,
      Math.max(1, Number(process.env.SMS_MAX_RECIPIENTS) || 25),
    );
    if (users.length > max)
      fail(
        400,
        `Hay ${users.length} destinatarios; el límite configurado es ${max}. Divide el alcance antes de enviar.`,
      );
    if (!users.length)
      fail(
        400,
        'No hay vecinos de ese distrito con celular y consentimiento para recibir SMS.',
      );
    const alertId = randomUUID(),
      message = 'AYNI ALERTA GRAVE: ' + v.message;
    await transact(db, async (conn) => {
      await conn.execute(
        'INSERT INTO alertas_sms(id,admin_id,district,message) VALUES(?,?,?,?)',
        [alertId, req.user.id, v.district, message],
      );
      for (const user of users)
        await conn.execute(
          'INSERT INTO destinatarios_alerta(alert_id,user_id) VALUES(?,?)',
          [alertId, user.id],
        );
    });
    res
      .status(201)
      .json({ id: alertId, message, count: users.length, configured: ready() });
  });
  async function deliver(alert) {
    const sentPhones = new Set();
    const [recipients] = await db.execute(
      'SELECT id,user_id FROM destinatarios_alerta WHERE alert_id=? AND status=?',
      [alert.id, 'pending'],
    );
    for (const recipient of recipients) {
      const [users] = await db.execute(
        'SELECT phone FROM usuarios WHERE id=? AND district=? AND sms_opt_in=1 AND phone IS NOT NULL',
        [recipient.user_id, alert.district],
      );
      if (!users.length || sentPhones.has(users[0].phone)) {
        await db.execute(
          "UPDATE destinatarios_alerta SET status='skipped' WHERE id=?",
          [recipient.id],
        );
        continue;
      }
      await db.execute(
        "UPDATE destinatarios_alerta SET status='processing' WHERE id=?",
        [recipient.id],
      );
      try {
        sentPhones.add(users[0].phone);
        const result = await send(users[0].phone, alert.message);
        await db.execute(
          'UPDATE destinatarios_alerta SET status=?,provider_id=? WHERE id=?',
          [result.status, result.id, recipient.id],
        );
      } catch (error) {
        await db.execute(
          'UPDATE destinatarios_alerta SET status=? WHERE id=?',
          [error.name === 'TimeoutError' ? 'unknown' : 'failed', recipient.id],
        );
      }
    }
    await db.execute("UPDATE alertas_sms SET state='completed' WHERE id=?", [
      alert.id,
    ]);
  }
  router.post(
    '/alerts/:id/send',
    rateLimit({
      windowMs: 300000,
      limit: 2,
      skipFailedRequests: true,
      message: { error: 'Espera unos minutos antes de procesar otra alerta.' },
      legacyHeaders: false,
      standardHeaders: 'draft-8',
    }),
    async (req, res) => {
      if (!ready()) fail(503, 'Configura Twilio en .env antes de enviar SMS.');
      const alertId = uuid.parse(req.params.id);
      z.object({ confirm: z.literal(true) })
        .strict()
        .parse(req.body);
      const alert = await transact(db, async (conn) => {
        const [rows] = await conn.execute(
          'SELECT * FROM alertas_sms WHERE id=? FOR UPDATE',
          [alertId],
        );
        if (!rows.length) fail(404, 'Vista previa no encontrada.');
        if (rows[0].state !== 'draft')
          fail(
            409,
            'Esta alerta ya fue procesada o está en curso; no se reenviará.',
          );
        if (
          Date.now() - Date.parse(rows[0].created_at.replace(' ', 'T') + 'Z') >
          600000
        )
          fail(
            400,
            'La vista previa venció. Genera una nueva antes de enviar.',
          );
        await conn.execute(
          "UPDATE alertas_sms SET state='sending' WHERE id=?",
          [alertId],
        );
        await audit(
          conn,
          req.user.id,
          'enviar_alerta_sms',
          alertId,
          'Envío grave confirmado expresamente',
        );
        return rows[0];
      });
      res.status(202).json({ id: alertId, state: 'sending' });
      setImmediate(() =>
        deliver(alert).catch(() =>
          console.error(
            'Una alerta SMS requiere revisión en el panel/proveedor.',
          ),
        ),
      );
    },
  );
  return router;
}
