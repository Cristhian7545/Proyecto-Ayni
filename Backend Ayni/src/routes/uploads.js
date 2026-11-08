import { Router } from 'express';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config.js';
import { imageType } from '../security.js';
import { fail } from '../http.js';
export function uploadRoutes(db, auth) {
  const router = Router();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0 },
  });
  router.post('/', auth, upload.single('photo'), async (req, res) => {
    if (!req.file) fail(400, 'Selecciona una imagen.');
    const type = imageType(req.file.buffer);
    if (!type) fail(400, 'Solo se admiten archivos JPG, PNG o WebP válidos.');
    const mediaId = randomUUID(),
      filename = `${mediaId}.${type.ext}`,
      url = `/uploads/${filename}`;
    await fs.mkdir(config.uploads, { recursive: true });
    const target = path.join(config.uploads, filename);
    await fs.writeFile(target, req.file.buffer, { flag: 'wx' });
    try {
      await db.execute(
        'INSERT INTO archivos_multimedia(id,owner_id,url,mime_type,size_bytes) VALUES(?,?,?,?,?)',
        [mediaId, req.user.id, url, type.mime, req.file.size],
      );
    } catch (e) {
      await fs.unlink(target).catch(() => {});
      throw e;
    }
    res.status(201).json({ id: mediaId, url });
  });
  return router;
}
