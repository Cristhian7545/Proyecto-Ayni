import { passwordPolicy, phonePolicy } from './policies.js';
import fs from 'node:fs';
const catalog = JSON.parse(
  fs.readFileSync(new URL('./data/catalogo_lima.json', import.meta.url)),
);
import { z } from 'zod';
export const text = (min, max) => z.string().trim().min(min).max(max);
export const id = z.string().regex(/^[1-9]\d{0,14}$/);
export const uuid = z.uuid();
export const district = z.preprocess(
  (value) =>
    typeof value === 'string' ? value.replace(', Lima', '').trim() : value,
  z.enum(catalog.districts),
);
export const registerSchema = z
  .object({
    name: text(2, 120),
    email: z
      .email()
      .max(254)
      .transform((s) => s.toLowerCase()),
    password: passwordPolicy,
    phone: phonePolicy,
    smsOptIn: z.boolean().default(false),
    neighborhood: text(2, 160),
    district,
  })
  .strict();
export const loginSchema = z
  .object({
    email: z
      .email()
      .max(254)
      .transform((s) => s.toLowerCase()),
    password: z.string().min(1).max(128),
  })
  .strict();
export const profileSchema = z
  .object({
    name: text(2, 120).optional(),
    neighborhood: text(2, 160).optional(),
    bio: text(0, 1000).optional(),
    phone: phonePolicy.optional(),
    smsOptIn: z.boolean().optional(),
    district: district.optional(),
    avatarMediaId: uuid.nullable().optional(),
  })
  .strict();
const time = z.string().regex(/^([01]\d|2[0-3]):(00|15|30|45)$/);
export const postSchema = z
  .object({
    module: z.enum(['trueque', 'apoyo', 'emprendimiento', 'aviso']),
    category: text(2, 80),
    title: text(3, 120),
    description: text(5, 5000),
    district,
    neighborhood: text(2, 160),
    offer: text(2, 500).optional(),
    request: text(2, 500).optional(),
    condition: text(1, 100).optional(),
    quantity: z.number().int().min(1).max(100000).default(1),
    priority: z.enum(['Regular', 'Prioritario', 'Urgente']).default('Regular'),
    price: z.number().min(0).max(99999999.99).optional(),
    acceptsBarter: z.boolean().default(false),
    days: text(2, 160).optional(),
    start: time.optional(),
    end: time.optional(),
    mode: z.enum(['Presencial', 'Virtual', 'Mixta']).default('Presencial'),
    mediaId: uuid.optional(),
    address: text(0, 255).optional(),
    latitude: z.number().finite().min(-90).max(90).optional(),
    longitude: z.number().finite().min(-180).max(180).optional(),
    mediaIds: z.array(uuid).max(6).optional(),
    communityId: id.optional(),
  })
  .strict()
  .superRefine((p, ctx) => {
    const add = (path, message) =>
      ctx.addIssue({ code: 'custom', path: [path], message });
    if ((p.latitude === undefined) !== (p.longitude === undefined))
      add('latitude', 'Completa ambas coordenadas del punto.');
    if (
      new Set([...(p.mediaIds || []), ...(p.mediaId ? [p.mediaId] : [])]).size >
      6
    )
      add('mediaIds', 'Puedes adjuntar hasta seis fotos.');
    if (p.communityId && p.module !== 'aviso')
      add(
        'communityId',
        'El muro de comunidad solo admite publicaciones comunitarias.',
      );
    if (p.module === 'trueque' && (!p.offer || !p.request))
      add('offer', 'Indica qué ofreces y qué buscas.');
    if (p.module === 'emprendimiento' && p.price === undefined)
      add('price', 'Indica un precio referencial.');
    if (
      (p.module === 'trueque' &&
        !['producto', 'servicio', 'habilidad'].includes(p.category)) ||
      (p.module === 'apoyo' &&
        !['donacion', 'necesito', 'voluntariado', 'servicio'].includes(
          p.category,
        )) ||
      (p.module === 'emprendimiento' &&
        !['producto', 'servicio'].includes(p.category))
    )
      add('category', 'Categoría incompatible con el módulo.');
    const schedule = ['servicio', 'habilidad', 'voluntariado'].includes(
      p.category,
    );
    if (
      p.days &&
      !p.days
        .split(',')
        .map((s) => s.trim())
        .every((s) =>
          [
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado',
            'Domingo',
          ].includes(s),
        )
    )
      add('days', 'Selecciona días válidos.');
    if (schedule && (!p.days || !p.start || !p.end))
      add('days', 'Completa tu disponibilidad.');
    if ((p.days || p.start || p.end) && (!p.days || !p.start || !p.end))
      add('days', 'Completa días y ambas horas.');
    if (p.start && p.end && p.end <= p.start)
      add('end', 'La hora final debe ser posterior a la inicial.');
  });
export const eventSchema = z
  .object({
    district: district.optional(),
    title: text(3, 160),
    description: text(5, 5000),
    category: text(2, 80),
    location: text(3, 255),
    startsAt: z.iso.datetime(),
    endsAt: z.iso.datetime(),
    mediaId: uuid.optional(),
    contribution: z.number().min(0).max(99999999.99).default(0),
  })
  .strict()
  .refine((v) => v.endsAt > v.startsAt, {
    message: 'El evento debe terminar después de comenzar.',
  })
  .refine(
    (v) =>
      Date.parse(v.startsAt) % 900000 === 0 &&
      Date.parse(v.endsAt) % 900000 === 0,
    { message: 'Selecciona horarios en intervalos de 15 minutos.' },
  );
export const communitySchema = z
  .object({
    name: text(3, 160),
    category: text(2, 80),
    district: text(2, 120),
    description: text(5, 5000),
  })
  .strict();
export const paging = (query) =>
  z
    .object({
      limit: z.coerce.number().int().min(1).max(50).default(20),
      offset: z.coerce.number().int().min(0).max(100000).default(0),
    })
    .parse(query);
