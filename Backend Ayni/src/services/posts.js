import { createHash } from 'node:crypto';
import { postSchema } from '../validation.js';
import { communityAccess } from '../community-access.js';
import { fail, transact } from '../http.js';
export async function createPost(db, user, body, { clientId } = {}) {
  const input = postSchema.parse({
    ...body,
    district: body?.district ?? user.district,
    neighborhood: body?.neighborhood ?? user.neighborhood,
  });
  const fingerprint = createHash('sha256')
    .update(JSON.stringify(input))
    .digest('hex');
  const result = await transact(db, async (conn) => {
    const [actors] = await conn.execute(
      'SELECT id FROM usuarios WHERE id=? AND deleted_at IS NULL FOR UPDATE',
      [user.id],
    );
    if (!actors.length) fail(401, 'La cuenta ya no está activa.');
    if (clientId) {
      const [old] = await conn.execute(
        'SELECT id,sync_hash FROM publicaciones WHERE author_id=? AND client_request_id=?',
        [user.id, clientId],
      );
      if (old.length) {
        if (old[0].sync_hash !== fingerprint)
          fail(409, 'Esta solicitud ya se publicó con datos diferentes.');
        return { id: String(old[0].id), replayed: true };
      }
    }
    if (input.communityId)
      await communityAccess(conn, input.communityId, user, {
        admin: false,
      });
    const [result] = await conn.execute(
      'INSERT INTO publicaciones(author_id,module,category,title,description,district,neighborhood,community_id,address,latitude,longitude,client_request_id,sync_hash) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        user.id,
        input.module,
        input.category,
        input.title,
        input.description,
        input.district,
        input.neighborhood,
        input.communityId ?? null,
        input.address || null,
        input.latitude ?? null,
        input.longitude ?? null,
        clientId || null,
        clientId ? fingerprint : null,
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
        [postId, mediaId, user.id],
      );
      if (!media.affectedRows)
        fail(400, 'La imagen no está disponible para esta publicación.');
    }
    return { id: postId, replayed: false };
  });

  return result;
}
