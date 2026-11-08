import { fail } from './http.js';
export async function communityAccess(
  db,
  communityId,
  user,
  { admin = true } = {},
) {
  if (!user) fail(401, 'Inicia sesión para entrar al muro.');
  const [rows] = await db.execute(
    "SELECT c.*,EXISTS(SELECT 1 FROM miembros_comunidad m WHERE m.community_id=c.id AND m.user_id=?) AS joined FROM comunidades c WHERE c.id=? AND c.status='approved'",
    [user.id, communityId],
  );
  if (!rows.length) fail(404, 'Comunidad no disponible.');
  if (!Number(rows[0].joined) && !(admin && user.role === 'admin'))
    fail(403, 'Únete a la comunidad para acceder a sus publicaciones.');
  return { ...rows[0], joined: !!Number(rows[0].joined) };
}
