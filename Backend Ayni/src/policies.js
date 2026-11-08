import { z } from 'zod';
import { HttpError } from './http.js';
export const passwordPolicy = z
  .string()
  .min(10, 'Usa al menos 10 caracteres.')
  .max(128)
  .regex(/\p{Lu}/u, 'Incluye una mayúscula.')
  .regex(/\p{Ll}/u, 'Incluye una minúscula.')
  .regex(/[0-9]/, 'Incluye un número.')
  .regex(/[^\p{L}\p{N}\s]/u, 'Incluye un carácter especial.');
export const phonePolicy = z
  .string()
  .min(9)
  .max(20)
  .regex(/^[+0-9\s()-]+$/, 'Ingresa un celular válido.')
  .transform((value) => {
    const digits = value.replace(/\D/g, '');
    return digits.length === 9 ? '+51' + digits : '+' + digits;
  })
  .pipe(
    z
      .string()
      .regex(
        /^\+519\d{8}$/,
        'Ingresa un celular peruano válido de 9 dígitos que empiece por 9.',
      ),
  );
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin')
    throw new HttpError(403, 'Esta acción requiere un administrador.');
  next();
}
export function containsAbuse(message) {
  const normalized = message
    .normalize('NFKD')
    .replace(/[\u0300-\u036f\u200B-\u200D\uFEFF]/g, '')
    .toLowerCase()
    .replace(
      /[013457@]/g,
      (c) => ({ 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', '@': 'a' })[c],
    );
  return /(^|[^a-z])(idiot[ao]s?|imbecil(?:es)?|estupid[ao]s?|conchatumadre|ctm|pendej[oa]s?|huevon(?:a|es|as)?|webon(?:a|es|as)?|cojud[oa]s?|cabron(?:a|es|as)?|put[oa]s?|maricon(?:es)?|hij[oa]\s+de\s+puta)(?=$|[^a-z])/.test(
    normalized,
  );
}
