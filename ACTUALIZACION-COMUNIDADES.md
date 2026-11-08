# Comunidades, perfil y administración de Ayni

## Usar las comunidades

En Comunidades, el botón **Entrar al muro** abre `/comunidades/:communityId`. La cabecera incluye el regreso al listado y la información de la comunidad. Su ficha es pública, pero el contenido del muro requiere una cuenta y pertenencia a esa comunidad. Los administradores pueden acceder para moderar; para publicar deben unirse también.

Los miembros pueden crear publicaciones con título, descripción y hasta seis fotos JPG/PNG/WebP de 5 MB por foto, dar me gusta, comentar y guardar. Se reutilizan las publicaciones, comentarios, me gusta y guardados existentes. No hay un segundo catálogo independiente. Las fotos se consultan mediante una ruta de API protegida; sus rutas públicas de subida quedan bloqueadas al vincularlas al muro. Los posts del muro no se mezclan con Inicio ni con sus destacados.

En Mi perfil, **Mis comunidades** reemplaza Recomendaciones de la comunidad y permite volver al muro. Desde el nombre de un autor de publicación se abre su perfil real con las comunidades aprobadas a las que pertenece. Salir de una comunidad retira el acceso a sus publicaciones y fotos; sus guardados dejan de aparecer mientras no sea miembro.

## Perfil y contactos de emergencia

Editar perfil y Cambiar contraseña están en una columna de cuenta a la derecha. Los formularios abren en modal. En móvil, los controles se acomodan debajo del resumen del perfil. Se mantienen los estilos beige y verde salvia de Ayni.

Apoyo Solidario muestra tarjetas con iconos y colores para Policía, Bomberos, SAMU y Línea 100, con enlaces para llamar. Se retiraron los textos Directorio nacional y Fuente de San Miguel y el número local fijo. La consulta ampliada abre [Teléfonos de emergencia de gob.pe](https://www.gob.pe/547-telefonos-de-emergencia), que incluye el listado de serenazgo por distrito.

## Recuperación de contraseña con código

1. En Acceso → Olvidé mi contraseña, introduce el correo registrado.
2. Recibe un código de seis dígitos y confírmalo en la pantalla. Vence a los diez minutos y permite hasta cinco intentos incorrectos. Un reenvío reemplaza el código anterior.
3. Después de confirmarlo, elige y confirma una contraseña nueva. Esta autorización vence a los cinco minutos. Al guardar se invalidan los códigos, las autorizaciones de recuperación y las sesiones previas.

Los códigos nunca se guardan en texto plano: se almacena un HMAC con una clave privada del backend. `RECOVERY_CODE_SECRET` se genera durante la migración en `.env` y no debe copiarse al frontend ni a GitHub. Las respuestas de solicitud no revelan si una cuenta existe. Un mensaje de autenticación SMTP como EAUTH requiere revisar la clave de aplicación de Google; no se imprime esa clave ni el código en los logs.

La plantilla SMTP ya envía el código, no un enlace. Se conserva el endpoint de reset con token únicamente para la autorización emitida después de confirmar el código. Reinicia el backend después de esta actualización. Las pruebas automáticas usan emisores simulados y no envían correos ni SMS reales.

## Cuentas del administrador

Administración → **Cuentas registradas** permite buscar, crear, editar y eliminar cuentas. El selector Permisos permite asignar Vecino, Moderador o Administrador. Al cambiar el correo o los permisos se invalidan sus sesiones y recuperaciones pendientes; el usuario debe volver a ingresar.

La eliminación es lógica: desactiva el acceso, retira los datos personales de la cuenta y conserva sus publicaciones/conversaciones como Cuenta eliminada, evitando borrar contenido de otros vecinos. El registro queda fuera del listado activo. El administrador no puede eliminarse ni quitarse su propio acceso; los cambios se serializan y validan nuevamente en la transacción para conservar un administrador activo. Las acciones se registran en acciones_admin y las respuestas nunca incluyen hashes de contraseña. Administrar cuentas no permite activar el consentimiento SMS de otro usuario.

## Base de datos e instalación

La base conserva los datos y ahora tiene 26 tablas en español. La migración agrega `publicaciones.community_id`, `usuarios.deleted_at` y `codigos_recuperacion`, con respaldo previo en `Mysql/respaldos`.

En este equipo la migración ya se aplicó. Para otra instalación existente:

```powershell
cd "Backend Ayni"
npm install
npm run db:migrate:community
npm run dev
```

Para una instalación nueva, configura `.env` desde `.env.example` y usa `npm run db:init`, que incluye todas las migraciones. `Mysql/01_crear_tablas.sql` contiene el esquema completo y `06_comunidades_y_codigos.sql` la nueva tabla de códigos. La clave privada se genera con el instalador del backend.

En otra terminal:

```powershell
cd "Frontend Ayni"
npm install
npm run dev
```

## Archivos principales

| Área | Ubicación |
|---|---|
| Muro y publicación | Frontend Ayni/src/views/Comunidad.jsx y components/CommunityPostForm.jsx |
| Comunidades del perfil | Frontend Ayni/src/components/UserCommunities.jsx |
| Perfil y controles | Frontend Ayni/src/views/Perfil.jsx, components/ProfileExtras.jsx y PasswordChange.jsx |
| Fotos de publicaciones | Frontend Ayni/src/components/PostGallery.jsx y Backend Ayni/src/routes/posts.js |
| Contactos oficiales | Frontend Ayni/src/components/EmergencyContacts.jsx |
| Recuperación por código | Frontend Ayni/src/views/Recuperar.jsx y Backend Ayni/src/routes/recovery.js |
| CRUD de cuentas | Frontend Ayni/src/components/AdminUsers.jsx y Backend Ayni/src/routes/admin-users.js |
| Migración | Backend Ayni/scripts/migrate-community.js y Mysql/06_comunidades_y_codigos.sql |

## Validación

Backend: `RUN_DB_TESTS=1 npm test` (en PowerShell: `$env:RUN_DB_TESTS='1'`, luego `npm test`). Frontend: `npm run verify` y `npm run build`. Los tests crean y eliminan sus propios usuarios, comunidades y fotos temporales. No ejecutarlos en una base de producción.
