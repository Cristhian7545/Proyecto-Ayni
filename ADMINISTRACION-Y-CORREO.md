# Administración, correo y alertas de Ayni

La actualización conserva la base `ayni` y sus datos. La migración de este equipo ya se aplicó; las credenciales de MySQL se conservaron. Reinicia los servidores de frontend y backend para cargar todo el código nuevo.

## Cuenta administradora

El correo solicitado es `leonoreeuu00@gmail.com`. La contraseña inicial aleatoria se entrega en `Backend Ayni/.admin-inicial.txt`, excluido de Git. Accede desde el avatar → Iniciar sesión / Crear cuenta. Después, abre avatar → Administración, o `/administracion`. Puedes cambiar la contraseña desde Mi perfil → Cambiar mi contraseña.

El panel permite aprobar o rechazar solicitudes pendientes de comunidades, fijar/desfijar publicaciones activas en el mural, retirar contenido indicando un motivo, restaurarlo y marcar casos de Apoyo Solidario como resueltos o reabrirlos. Las retiradas conservan el contenido para revisión. Un vecino no puede ejecutar estas acciones mediante la API ni reactivar una publicación retirada o un apoyo resuelto por administración. Las acciones sobre publicaciones y los envíos confirmados quedan registrados en `acciones_admin`.

`npm run admin:create` genera una nueva contraseña para `ADMIN_EMAIL`; si la cuenta existe, conserva su perfil y cambia su rol/contraseña, revocando sesiones y enlaces de recuperación anteriores. No lo ejecutes como parte del arranque habitual. Nunca se expone un endpoint para asignarse permisos de administrador.

## Recuperación de contraseña por correo

Completa estas variables **solo en `Backend Ayni/.env`**:

```dotenv
FRONTEND_URL=http://127.0.0.1:5173
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
MAIL_FROM=
```

Usa los valores y credenciales de envío que te entregue tu proveedor SMTP. `MAIL_FROM` debe ser un remitente permitido por ese proveedor. Si la contraseña contiene `#` o espacios, colócala entre comillas en `.env`. `SMTP_SECURE=false` solicita STARTTLS obligatorio; si tu proveedor exige TLS desde la conexión, configura su puerto y `SMTP_SECURE=true`. No se desactiva la validación de certificados. Referencia: [transporte SMTP de Nodemailer](https://nodemailer.com/smtp).

Reinicia el backend. En Acceso → Olvidé mi contraseña, solicita un enlace y ábrelo desde el correo recibido. El enlace vence a los 15 minutos y funciona una vez. Los tokens se almacenan como hashes y viajan en el fragmento del enlace; la API no los devuelve ni los imprime. La respuesta no revela si un correo está registrado. Cambiar o recuperar la contraseña cierra las sesiones de esa cuenta.

Mientras falten las variables de correo, el formulario informa que el servicio todavía no está configurado. Las pruebas automáticas usan un emisor simulado; la entrega real queda pendiente de configurar y comprobar con tu proveedor.

## Alertas SMS graves con Twilio

Completa en el mismo `.env`:

```dotenv
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM=
SMS_MAX_RECIPIENTS=25
```

`TWILIO_FROM` es el remitente SMS habilitado en tu cuenta de Twilio. Revisa que la cuenta permita el destino y el remitente que usarás; la disponibilidad y los cargos dependen del proveedor. Referencia: [Messages API de Twilio](https://www.twilio.com/docs/messaging/api/message-resource).

Cada vecino decide si autoriza estos mensajes al registrarse o al editar su perfil. De forma predeterminada no autoriza SMS. Las cuentas anteriores conservan ese estado hasta que lo activen y agreguen un celular válido. El celular no aparece en la ficha pública del usuario.

En Administración, selecciona el distrito, escribe la alerta y pulsa **Revisar destinatarios y mensaje**. La vista previa muestra el texto final y el número de destinatarios con consentimiento, agrupados por teléfono. Revisa el contenido y marca la confirmación de emergencia grave antes de **Enviar**. La vista previa vence a los 10 minutos. El envío vuelve a comprobar el distrito y el consentimiento; no reenvía un lote ya procesado. Por defecto admite hasta 25 destinatarios por lote, con un máximo configurable de 100 y dos lotes cada cinco minutos por IP.

El historial distingue mensajes aceptados por el proveedor, fallidos, inciertos y omitidos. “Aceptado” no confirma la recepción en el celular. No se implementaron callbacks de entrega. El proceso de envío se ejecuta dentro del servidor: si lo reinicias durante un lote, revisa el historial y el proveedor antes de crear otra alerta. No hay reintentos automáticos de mensajes inciertos.

Las claves permanecen vacías hasta que las configures. Durante el desarrollo no se enviaron SMS ni correos reales.

## Chat y contraseñas

El registro y los cambios de contraseña exigen al menos diez caracteres, una mayúscula, una minúscula, un número y un carácter especial. Los campos incorporan un botón para mostrar u ocultar la contraseña. Las contraseñas antiguas siguen permitiendo iniciar sesión; la nueva política se aplica al crear o cambiar una contraseña.

El chat incluye burbujas, fecha/hora, mensajes sin leer, confirmación de lectura, búsqueda de conversaciones y vista móvil con botón de regreso. Enter envía y Shift + Enter agrega otra línea. El servidor bloquea una lista inicial de insultos y algunas sustituciones comunes; no es un detector completo de abuso y puede necesitar ajustes de vocabulario. Los mensajes rechazados no se almacenan y permanecen en el editor para corregirlos. Existe un límite de treinta mensajes por minuto por IP.

## SQL y pruebas

`Mysql/05_administracion.sql` agrega `tokens_recuperacion`, `acciones_admin`, `alertas_sms` y `destinatarios_alerta`. `npm run db:migrate:admin` respalda y agrega las columnas de rol, celular, consentimiento, fijado, moderación, resolución y lectura sin borrar las filas. `01_crear_tablas.sql` contiene el esquema completo de 25 tablas para instalaciones nuevas. `npm run db:init` incluye ambas migraciones y carga los catálogos iniciales.

En el backend:

```powershell
npm test
# Para incluir las pruebas de integración con MySQL local:
$env:RUN_DB_TESTS='1'
npm test
```

En el frontend:

```powershell
npm run verify
npm run build
```

Las pruebas de integración crean y eliminan sus propias cuentas `example.invalid`; las pruebas nuevas de correo y SMS inyectan emisores simulados. No ejecutarlas en una base de producción.
