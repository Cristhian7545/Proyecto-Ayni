export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export const fail = (status, message) => {
  throw new HttpError(status, message);
};
export async function transact(db, action) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const result = await action(conn);
    await conn.commit();
    return result;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}
export const publicUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  district: row.district,
  neighborhood: row.neighborhood,
  bio: row.bio,
  photo: row.avatar_url,
  role: row.role,
  phone: row.phone,
  smsOptIn: !!Number(row.sms_opt_in),
});
