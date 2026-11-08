import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID, randomBytes } from 'node:crypto';
import { pool } from '../src/db.js';
import { hashPassword } from '../src/security.js';
import { transact } from '../src/http.js';
import { root } from '../src/config.js';
const email = (process.env.ADMIN_EMAIL || 'admin@example.com')
  .trim()
  .toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  throw Error('ADMIN_EMAIL no es válido.');
try {
  const password = 'Ay!9-' + randomBytes(12).toString('base64url'),
    hash = await hashPassword(password);
  await transact(pool, async (conn) => {
    const [existing] = await conn.execute(
      'SELECT id FROM usuarios WHERE email=? FOR UPDATE',
      [email],
    );
    const id = existing[0]?.id || randomUUID();
    if (existing.length) {
      await conn.execute(
        "UPDATE usuarios SET role='admin',password_hash=? WHERE id=?",
        [hash, id],
      );
      await conn.execute('DELETE FROM sesiones WHERE user_id=?', [id]);
      await conn.execute('DELETE FROM codigos_recuperacion WHERE user_id=?', [
        id,
      ]);
      await conn.execute(
        'UPDATE tokens_recuperacion SET used_at=UTC_TIMESTAMP() WHERE user_id=?',
        [id],
      );
    } else
      await conn.execute(
        "INSERT INTO usuarios(id,name,email,password_hash,district,neighborhood,role) VALUES(?,?,?,?,?,?,'admin')",
        [id, 'Administrador Ayni', email, hash, 'Lima', 'Administración'],
      );
  });
  const file = path.join(root, '.admin-inicial.txt');
  await fs.writeFile(
    file,
    `Cuenta administradora local de Ayni\nCorreo: ${email}\nContraseña: ${password}\n\nPuedes cambiarla desde Mi perfil. No publiques este archivo.\n`,
    { mode: 0o600 },
  );
  console.log(
    'Cuenta administradora preparada. Credenciales guardadas en Backend Ayni/.admin-inicial.txt.',
  );
} finally {
  await pool.end();
}
