# Instalar y ejecutar Ayni paso a paso

Esta guía es para otra computadora o una instalación nueva. Los ejemplos usan **PowerShell**, la terminal que puedes abrir en Visual Studio Code. Sustituye `C:\ruta\Proyecto Ayni` por la carpeta donde guardaste el proyecto. Esta versión incluye archivos .env con los puertos y opciones de conexión preparados y las credenciales de MySQL y proveedores vacías. Cada instalación debe completar sus datos locales. Los .env.example también se conservan. Los archivos locales del propietario mantienen sus claves y no se sobrescriben para preparar la subida.

## 1. Qué instalar

| Programa | Para qué sirve |
|---|---|
| [Node.js LTS](https://nodejs.org/en/download) | Ejecuta Node y npm. Usa una versión LTS compatible con el proyecto: Node 22.12 o posterior. |
| [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) | Guarda los datos. El esquema requiere MySQL 8.0.16 o posterior; puedes usar MySQL 8.4. |
| [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) | Abre y ejecuta el SQL completo. Workbench se conecta al servidor; no lo reemplaza. |
| [Visual Studio Code](https://code.visualstudio.com/) | Permite abrir las carpetas y las terminales. |

Necesitas internet para descargar los paquetes por primera vez. No necesitas instalar React, Vite, Tailwind, Express ni sus módulos uno por uno: `npm install` los instala desde el `package.json` de cada carpeta. No hace falta instalar MySQL en ambas carpetas, usar Supabase ni instalar XAMPP/MariaDB para este esquema.

Después de instalar Node, cierra y abre la terminal y comprueba:

```powershell
node --version
npm --version
```

## 2. Crear toda la base de datos con una ejecución

1. Inicia el servicio de **MySQL Server** y abre su conexión en Workbench.
2. Abre `Mysql/00_instalacion_completa.sql` desde **File → Open SQL Script**, o pega todo su contenido en una pestaña Query.
3. Ejecuta **todo el script** con la opción **Execute (All or Selection)**. Si hay texto seleccionado, solo se ejecutará esa selección; selecciona todo o quita la selección antes de ejecutarlo. [Referencia de Workbench](https://dev.mysql.com/doc/workbench/en/wb-sql-editor-toolbar.html).
4. Revisa que no haya errores en Action Output. Actualiza el panel Schemas: debe aparecer la base `ayni`.

El archivo crea la base, las 26 tablas, claves foráneas, índices y catálogos: 43 distritos y 7 barrios iniciales. Los usuarios pueden indicar otro barrio al registrarse. Incluye comunidades, chat, guardados, administración, recuperación y campos de ubicación/sincronización offline. No necesita ejecutar los demás SQL ni usar `SOURCE`. Al final muestra los conteos de instalación.

No incluye cuentas, contraseñas, publicaciones o datos privados de otra persona. No crea una cuenta MySQL: usa el usuario que configuraste al instalar el servidor, con permisos para crear la base y tablas.

Este SQL es para **instalar desde cero**. No elimina tablas ni registros; puede repetirse sobre el esquema nuevo sin duplicar el catálogo. No convierte ni actualiza tablas de versiones antiguas: en ese caso usa los migradores indicados en el paso 10. Conserva `DB_NAME=ayni` para usar el archivo tal como está.

## 3. Preparar el backend (primera vez)

Abre una terminal y ejecuta:

```powershell
Set-Location "C:\ruta\Proyecto Ayni\Backend Ayni"
npm install
if (-not (Test-Path -LiteralPath ".env")) { Copy-Item -LiteralPath ".env.example" -Destination ".env" }
```

Abre `Backend Ayni/.env` en VS Code y completa estos datos con los de **tu MySQL**:

```dotenv
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=ayni
DB_USER=root
DB_PASSWORD=TU_CONTRASENA_DE_MYSQL
HOST=127.0.0.1
PORT=3001
NODE_ENV=development
FRONTEND_ORIGINS=http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:4173,http://localhost:4173
FRONTEND_URL=http://127.0.0.1:5173
RUN_DB_TESTS=0
```

`root` es solo un ejemplo: usa tu propio usuario si tiene otro nombre. Si la contraseña contiene `#` o espacios, escríbela entre comillas dobles en el `.env`. El archivo debe llamarse exactamente `.env`, sin `.txt` al final. Conserva las otras variables de la plantilla.

Como la instalación se hizo directamente por SQL, genera también la clave privada para los códigos de recuperación con este comando en la misma terminal:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado en la línea siguiente de **tu `.env` del backend** y guarda el archivo:

```dotenv
RECOVERY_CODE_SECRET=PEGA_AQUI_EL_VALOR_GENERADO
```

Se genera una vez por instalación. No cambies una clave ya configurada para el arranque diario ni compartas el `.env`. No se almacena esa clave en el SQL.

Si ya ejecutaste `00_instalacion_completa.sql`, la base está preparada: **no necesitas ejecutar además `npm run db:init`**. Como alternativa al paso 2, `npm run db:init` instala el esquema y aplica los migradores desde Node usando el `.env`, y genera la clave de recuperación; elige una sola ruta de instalación.

## 4. Preparar el frontend (primera vez)

En una segunda terminal:

```powershell
Set-Location "C:\ruta\Proyecto Ayni\Frontend Ayni"
npm install
if (-not (Test-Path -LiteralPath ".env")) { Copy-Item -LiteralPath ".env.example" -Destination ".env" }
```

Comprueba que `Frontend Ayni/.env` tenga:

```dotenv
VITE_API_BASE=/api
VITE_BACKEND_TARGET=http://127.0.0.1:3001
VITE_GOOGLE_MAPS_API_KEY=
VITE_GOOGLE_MAPS_MAP_ID=
```

Las variables de Maps son opcionales para ejecutar el sitio. Nunca pongas la contraseña de MySQL, SMTP ni Twilio en el frontend. Las claves de esos servicios pertenecen al backend.

## 5. Encender la página cada día

Mantén encendido MySQL y deja **dos terminales abiertas**.

Terminal 1 — backend:

```powershell
Set-Location "C:\ruta\Proyecto Ayni\Backend Ayni"
npm run dev
```

Terminal 2 — frontend:

```powershell
Set-Location "C:\ruta\Proyecto Ayni\Frontend Ayni"
npm run dev
```

Abre **http://127.0.0.1:5173**. Para comprobar la conexión a MySQL abre **http://127.0.0.1:3001/api/health/db**: debe responder `status: ok` y `database: connected`. `/api/health` solo comprueba que la API está encendida.

Usa el mismo nombre de servidor en tus pestañas: `127.0.0.1` y `localhost` tienen cookies y datos offline separados. Para apagar cada proceso, pulsa **Ctrl+C** en su terminal. La próxima vez repite únicamente este paso; no reinstales la base ni los paquetes.

## 6. Administrador opcional

En `Backend Ayni/.env`, elige un correo para esta instalación:

```dotenv
ADMIN_EMAIL=tu-correo@ejemplo.com
```

Desde la carpeta del backend, ejecuta una sola vez:

```powershell
npm run admin:create
```

Las credenciales se guardan localmente en `Backend Ayni/.admin-inicial.txt`. No son las de la computadora del autor del proyecto. Entra con ellas y cambia la contraseña desde Mi perfil. Si vuelves a ejecutar este comando para una cuenta existente, restablece su contraseña, le asigna rol admin y cierra sus sesiones.

## 7. Servicios externos opcionales

| Función | Configuración necesaria |
|---|---|
| Mapa y sugerencias | En el `.env` del frontend completa `VITE_GOOGLE_MAPS_API_KEY`. En Google Cloud habilita Maps JavaScript API y Places API (New), facturación y restricciones para los sitios locales de los puertos 5173/4173. Consulta [UBICACION-Y-GUIA.md](./UBICACION-Y-GUIA.md). |
| Recuperación por correo | En el `.env` del backend completa `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD` y `MAIL_FROM`. Para Google SMTP: host `smtp.gmail.com`, puerto `587`, secure `false` y contraseña de aplicación de Google, no la contraseña normal. También necesitas `RECOVERY_CODE_SECRET` y `FRONTEND_URL` del paso 3. Consulta [administración y correo](./ADMINISTRACION-Y-CORREO.md). |
| Alertas SMS | En el `.env` del backend completa `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` y `TWILIO_FROM`. Debes tener un remitente y destinos permitidos por tu cuenta Twilio; los destinatarios también necesitan consentimiento SMS en Ayni. |

Los paquetes de integración ya están declarados en el proyecto. No necesitas instalar módulos adicionales para estas funciones. Sin credenciales externas puedes registrar usuarios, publicar y usar las demás funciones locales; el envío real de correos/SMS y las sugerencias de Google requieren sus respectivos proveedores. Reinicia el servidor correspondiente después de cambiar un `.env`.

## 8. Compilar y probar la PWA

El modo sin conexión requiere abrir primero el sitio con conexión y haber iniciado sesión. El Service Worker se genera al compilar y está desactivado durante `npm run dev`.

Deja encendido el backend. En el frontend, detén Vite con Ctrl+C si está abierto y ejecuta:

```powershell
npm run build
npm run preview
```

Abre **http://127.0.0.1:4173**, espera el aviso de disponibilidad sin conexión y visita los módulos. Si ya tenías una PWA anterior, acepta la actualización. Los datos de la cola no se comparten entre el puerto 5173 y el 4173. Google Maps, chat y otras acciones necesitan conexión; las publicaciones pendientes se sincronizan al volver a abrir Ayni con conexión y sesión válida. Detalles en [OFFLINE-FIRST.md](./OFFLINE-FIRST.md).

`npm run preview` sirve para comprobar la compilación local; no reemplaza la configuración de despliegue con HTTPS de un servidor público.

## 9. Comprobaciones opcionales

Desde el frontend:

```powershell
npm test
npm run verify
npm run build
```

Desde el backend, las pruebas básicas:

```powershell
npm test
```

Las pruebas de integración MySQL se omiten por defecto. Para activarlas, utiliza una **base dedicada a pruebas** en el `.env` y prepárala con `npm run db:init` antes de ejecutar:

```powershell
$env:RUN_DB_TESTS = "1"
npm test
Remove-Item Env:RUN_DB_TESTS
```

No es necesario ejecutar pruebas para encender la página.

## 10. Si ya tienes una instalación anterior

No importes un SQL de instalación encima de tablas antiguas esperando que las actualice. Haz respaldo de tus datos y ejecuta desde Backend Ayni, con tu `.env` configurado:

```powershell
npm install
npm run db:init
```

Ese comando prepara la base cuando corresponde y ejecuta los migradores existentes en orden: nombres españoles, administración, comunidades y códigos, y campos offline. Los migradores crean respaldos locales en `Mysql/respaldos`. No ejecutes manualmente `02_renombrar_tablas.sql` sobre tablas ya renombradas. Después instala los paquetes del frontend si cambió el proyecto y reinicia los servidores.

## 11. Problemas frecuentes

| Mensaje o síntoma | Qué revisar |
|---|---|
| `node` o `npm` no se reconoce | Instala Node LTS con npm y abre una terminal nueva. |
| PowerShell bloquea `npm.ps1` | Puedes usar `npm.cmd` en los mismos comandos, por ejemplo `npm.cmd install` y `npm.cmd run dev`. |
| No encuentra `package.json` | Estás en la carpeta equivocada: ejecuta npm dentro de Backend Ayni o Frontend Ayni. |
| `ECONNREFUSED` con MySQL | Inicia MySQL Server y verifica `DB_HOST`/`DB_PORT`. |
| `Access denied` | Revisa el usuario, contraseña y permisos de MySQL en el `.env` del backend. |
| `Unknown database` o falta una tabla | Ejecuta todo `00_instalacion_completa.sql` en una instalación nueva y comprueba `DB_NAME=ayni`. Para una instalación antigua, usa el paso 10. |
| Frontend sin conexión a la API | Mantén abierto el backend y comprueba el destino `http://127.0.0.1:3001` del frontend y `/api/health/db`. |
| Puerto ocupado | Cierra la instancia anterior de Ayni. Si cambias puertos, actualiza el proxy, los orígenes permitidos y las restricciones de Maps. |
| Mapa sin sugerencias | Revisa Places API (New), facturación, restricciones de API/sitios y reinicia Vite después de editar el `.env`. |
| Datos antiguos tras actualizar la PWA | Acepta la actualización y recarga. No borres el almacenamiento si aún tienes publicaciones pendientes de enviar. |

Para compartir el proyecto entrega el código, el SQL y estas instrucciones. Cada persona debe crear sus propios `.env`, base de datos y cuentas. No entregues `node_modules`, `.env`, `.admin-inicial.txt`, `Mysql/respaldos` ni archivos privados de usuarios.
