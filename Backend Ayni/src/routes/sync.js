import { Router } from 'express';
import { z, ZodError } from 'zod';
import { createPost } from '../services/posts.js';
import { HttpError, fail } from '../http.js';
export function syncRoutes(db, auth) {
  const router = Router();
  router.use(auth);
  router.post('/posts', async (req, res) => {
    const { ownerId, entries } = z
      .object({
        ownerId: z.uuid(),
        entries: z
          .array(
            z
              .object({
                clientId: z.uuid(),
                payload: z.record(z.string(), z.unknown()),
              })
              .strict(),
          )
          .min(1)
          .max(10),
      })
      .strict()
      .parse(req.body);
    if (ownerId !== req.user.id)
      fail(409, 'Inicia sesión con la cuenta que creó estos pendientes.');
    const results = [];
    for (const entry of entries) {
      try {
        const result = await createPost(db, req.user, entry.payload, {
          clientId: entry.clientId,
        });
        results.push({ clientId: entry.clientId, status: 'synced', ...result });
      } catch (error) {
        if (error instanceof ZodError)
          results.push({
            clientId: entry.clientId,
            status: 'rejected',
            code: 400,
            error: error.issues.map((i) => i.message).join(' '),
          });
        else if (error instanceof HttpError)
          results.push({
            clientId: entry.clientId,
            status: 'rejected',
            code: error.status,
            error: error.message,
          });
        else throw error;
      }
    }
    res.json({ results });
  });
  return router;
}
