# Backend Ayni

**Actualización:** tablas en español; migración con `npm run db:migrate`. Guardados: PUT/DELETE `/api/posts/:id/saved`. Listados de posts aceptan `status=all` y `saved=1`; devuelven `counts`, `total` y estados `liked`/`saved`. Eventos devuelven `selected` y `interested`. Catálogo: GET `/api/location/catalog`; GPS: POST `/api/location/reverse` con `{lat,lon}`. Ver el README principal para el estado actual.

API REST con Node.js + Express 5 y MySQL. Está en una carpeta independiente del frontend; las credenciales de MySQL nunca se envían al navegador.

## Preparación

Requiere Node.js 22.12+ y MySQL 8.0.16+ (también compatible con el servidor MySQL instalado localmente).

```sh
npm install
```

Completa `.env` a partir de `.env.example`. El archivo local ya se preparó, y no se sobrescribe al generar archivos. Configura `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME`. Si una contraseña contiene `#` o espacios, escríbela entre comillas en `.env`.

```sh
npm run db:init
npm run dev
```

- Desarrollo: `http://127.0.0.1:3001/api/health`.
- Comprobar MySQL: `http://127.0.0.1:3001/api/health/db`.
- Inicio sin vigilancia de archivos: `npm start`.

`db:init` lee `../Mysql/01_crear_tablas.sql`. Crea la base y las tablas si no existen; **no elimina datos existentes**. Si cambias `DB_NAME`, el instalador usa ese nombre. El SQL abierto directamente en Workbench crea `ayni`.

## Organización

```text
src/
  app.js           # Aplicación, CORS, límites, errores y rutas
  server.js        # Servidor y cierre ordenado
  config.js        # Variables de entorno
  db.js            # Pool MySQL
  security.js      # scrypt, tokens y firma de imágenes
  validation.js    # Validación de solicitudes con Zod
  http.js          # Errores, transacciones y respuesta de usuario
  routes/
    auth.js        # Registro, login, sesión y logout
    users.js       # Perfiles y recomendaciones
    posts.js       # Publicaciones, estados, likes y comentarios
    community.js   # Eventos y comunidades
    messages.js    # Conversaciones y mensajes privados
    uploads.js     # Archivos de imagen
scripts/init-db.js
test/
uploads/           # Archivos; conservar fuera de Git y respaldar junto con MySQL
```

## API

Las solicitudes y respuestas de datos usan JSON. Los IDs de publicaciones se envían como cadenas decimales; los de usuario y conversación son UUID. Los listados admiten `limit` (1–50) y `offset`. Las fechas de eventos usan ISO 8601 con zona horaria; la base conserva UTC.

| Método y ruta | Operación / permisos |
|---|---|
| POST `/api/auth/register` | `{name,email,password,neighborhood,district,phone,smsOptIn?}`; crea cuenta de vecino y sesión |
| POST `/api/auth/login` | `{email,password}` |
| GET `/api/auth/me` | Usuario de la sesión, sin hash de contraseña |
| POST `/api/auth/logout` | Revoca la sesión y elimina la cookie |
| PATCH `/api/users/me` | `{name?,neighborhood?,district?,bio?,avatarMediaId?,phone?,smsOptIn?}`; solo perfil propio |
| GET `/api/users/:uuid` | Ficha pública sin correo privado |
| GET / POST `/api/users/:uuid/reviews` | Leer / crear reseña; POST `{postId,body}` requiere coordinación previa sobre una publicación completada de ese vecino |
| GET `/api/posts` | Filtros `module`, `category`, `author`, `status` y paginación |
| GET `/api/posts/:id` | Detalle |
| POST `/api/posts` | Crear publicación como autor autenticado |
| PATCH `/api/posts/:id/status` | `{status: "active" | "completed" | "archived"}`; solo autor |
| DELETE `/api/posts/:id` | Solo autor |
| PUT / DELETE `/api/posts/:id/like` | Apoyar / retirar apoyo propio, sin duplicados |
| GET / POST `/api/posts/:id/comments` | Leer / añadir `{body}` con sesión |
| GET / POST `/api/events` | Leer / crear evento autenticado |
| DELETE `/api/events/:id` | Solo organizador |
| PUT / DELETE `/api/events/:id/interest` | Interés propio, sin duplicados |
| GET / POST `/api/communities` | Comunidades aprobadas / proponer con `{name,category,district,description}` |
| GET `/api/communities/pending` | Solo moderadores o administrador |
| PATCH `/api/communities/:id/status` | `{status: "approved" | "rejected"}`; solo moderadores o administrador |
| PUT / DELETE `/api/communities/:id/membership` | Unirse a comunidad aprobada / salir |
| GET / POST `/api/conversations` | Conversaciones propias / iniciar con `{neighborId,postId?}` |
| GET / POST `/api/conversations/:uuid/messages` | Solo participantes; POST `{body}` |
| POST `/api/uploads` | Sesión + `multipart/form-data`, campo `photo`; devuelve `{id,url}` |

Publicación mínima de trueque:

```json
{
  "module": "trueque",
  "category": "producto",
  "title": "Libros por plantas",
  "description": "Intercambio dos libros en buen estado por plantas de interior.",
  "district": "San Miguel, Lima",
  "neighborhood": "Maranga",
  "offer": "Dos libros",
  "request": "Plantas de interior",
  "condition": "Usado en buen estado",
  "quantity": 2
}
```

Módulos: `trueque`, `apoyo`, `emprendimiento`, `aviso`. Trueque requiere `offer` y `request`. Emprendimiento requiere `price` numérico y admite `acceptsBarter`. Apoyo admite `priority` (`Regular`, `Prioritario`, `Urgente`). Servicios, habilidades y voluntariado de los formularios de Trueque/Apoyo requieren `days`, `start`, `end`; `mode` puede ser `Presencial`, `Virtual` o `Mixta`. La hora final debe ser posterior a la inicial. Una imagen previamente subida se vincula con `mediaId` y debe pertenecer al autor.

Eventos: `{title,description,category,location,startsAt,endsAt,contribution?}`; `contribution` debe ser no negativa.

## Seguridad y configuración

- Contraseñas con scrypt y sal aleatoria; no se guardan en texto plano.
- Sesiones aleatorias almacenadas como hash en MySQL; cookie HttpOnly, SameSite Strict y Secure en producción. No se usa localStorage para tokens.
- Consultas parametrizadas y transacciones para la creación de publicaciones y sus detalles.
- Comprobación del autor y de participantes antes de modificar o leer información privada.
- Validación de campos; el cliente no puede asignarse el rol de moderador.
- CORS limitado a `FRONTEND_ORIGINS`, límites de solicitudes y cuerpo, respuestas sin secretos ni trazas SQL.
- Imágenes JPG, PNG y WebP de hasta 5 MB, comprobadas por firma; nombres generados por el servidor. No se admiten SVG/HTML en las subidas.
- Las imágenes subidas para perfiles/publicaciones son públicas mediante `/uploads`; no se deben subir documentos privados. Respaldar esa carpeta y la base juntos.

Los nuevos usuarios son `neighbor`. La asignación de `moderator` debe hacerla un administrador directamente en MySQL para un usuario conocido; no existe un endpoint público que conceda ese rol. Para producción usa un usuario MySQL con permisos mínimos, HTTPS y un proxy que sirva `/api` y `/uploads` junto al frontend. No subas `.env` a Git.

## Pruebas

```sh
npm test
```

Incluye pruebas de contraseña, validación, protección de endpoints, CORS y errores. La prueba de MySQL real solo se activa explícitamente:

```powershell
$env:RUN_DB_TESTS='1'
npm run test:db
```

Crea cuentas `example.invalid` y registros temporales, verifica sesión/propiedad/privacidad y los elimina al finalizar. No ejecutar en producción. Si la prueba se interrumpe, los registros temporales se identifican por el prefijo `ayni-` en sus correos de prueba.

Referencias: [Express 5](https://expressjs.com/en/5x/guide/error-handling/), [mysql2](https://sidorares.github.io/node-mysql2/docs/documentation/promise-wrapper), [MySQL CREATE TABLE](https://dev.mysql.com/doc/refman/8.4/en/create-table.html).


Consulta [ADMINISTRACION-Y-CORREO.md](../ADMINISTRACION-Y-CORREO.md) para configurar SMTP, Twilio, la administración y la recuperación de contraseña.

## Administración y recuperación

El rol `admin` se asigna mediante el comando local `npm run admin:create`, que toma `ADMIN_EMAIL` de `.env` y genera credenciales privadas. `npm run db:migrate:admin` actualiza el esquema y `db:init` lo incluye automáticamente.

| Método y ruta | Operación |
|---|---|
| POST /api/auth/forgot-password | Correo de recuperación; requiere SMTP configurado |
| POST /api/auth/reset-password | Cambiar con token válido y contraseña fuerte |
| POST /api/auth/change-password | Cambiar con contraseña actual; revoca sesiones |
| GET /api/posts/featured | Hasta seis publicaciones activas fijadas o destacadas |
| PATCH /api/conversations/:uuid/read | Marcar mensajes recibidos como leídos; solo participante |
| GET /api/admin/summary | Resumen y estado de configuración; admin |
| GET /api/admin/posts | Publicaciones visibles o retiradas; admin |
| PATCH /api/admin/posts/:id/pin | Fijar/desfijar; admin |
| PATCH /api/admin/posts/:id/resolve | Resolver/reabrir apoyo; admin |
| DELETE /api/admin/posts/:id | Retirada lógica con motivo; admin |
| POST /api/admin/posts/:id/restore | Restaurar contenido retirado; admin |
| GET /api/admin/alerts | Historial de alertas; admin |
| POST /api/admin/alerts/preview | Distrito y mensaje, crea vista previa; admin |
| POST /api/admin/alerts/:uuid/send | Confirmación expresa del envío; admin |

El registro exige celular peruano y contraseña de diez caracteres con mayúscula, minúscula, número y carácter especial. `smsOptIn` es falso por defecto. El chat valida insultos en el servidor y limita frecuencia; la lista inicial no cubre todas las formas de abuso. Los tests nuevos de envío usan proveedores simulados y no requieren claves externas.


## Muros, códigos y administración de cuentas

Ver [guía actual](../ACTUALIZACION-COMUNIDADES.md). Migración: `npm run db:migrate:community`. API nueva: GET `/api/communities/:id`, listados de posts con `community`, creación con `communityId` y hasta seis `mediaIds`; fotos protegidas en `/api/posts/:id/media/:mediaId`; comunidades del perfil en `/api/users/me/communities` y `/api/users/:id/communities`. CRUD admin en `/api/admin/users` y `/api/admin/users/:id`. Recuperación: POST `/api/auth/forgot-password` → `/api/auth/verify-code` → `/api/auth/reset-password`. No registrar códigos, tokens o credenciales SMTP en logs.
