# Ayni: modo offline, distrito, búsqueda y ubicación

Esta versión incluye archivos .env con los puertos y opciones de conexión preparados y las credenciales de MySQL y proveedores vacías. Cada instalación debe completar sus datos locales. Los .env.example también se conservan. Los archivos locales del propietario mantienen sus claves y no se sobrescriben para preparar la subida.

## Qué puedes hacer sin conexión

- Abrir la interfaz de la PWA después de haberla cargado con conexión y esperar a que indique que está lista para uso offline.
- Consultar publicaciones, catálogos, perfiles y búsquedas que este navegador haya guardado previamente para tu cuenta. Las lecturas duran hasta siete días, con un máximo de cien respuestas por cuenta.
- Crear trueques, apoyos solidarios, emprendimientos y publicaciones en los muros de comunidad. La publicación y sus fotos se guardan primero en IndexedDB y aparecen como pendientes, con una indicación clara de que todavía no se publicaron.
- Revisar los pendientes, reintentar un envío y corregir datos rechazados. No se simulan me gusta, comentarios o mensajes enviados: esas acciones, crear eventos, proponer/unirse a comunidades y administrar cuentas requieren conexión.

Necesitas haber iniciado sesión anteriormente en ese navegador para crear pendientes asociados a tu cuenta. Una identidad guardada permite redactar, pero no sustituye la autorización del backend. No se guardan contraseñas ni tokens de sesión en IndexedDB; las cookies siguen siendo HttpOnly.

Las fotos de borradores sí se conservan con ellos. Las imágenes remotas de publicaciones ya leídas no se copian a IndexedDB; pueden no verse sin conexión, especialmente las fotos privadas de comunidades. Los mapas externos también necesitan conexión. Un filtro o búsqueda que nunca se consultó puede no tener una lectura guardada.

## Cola de sincronización

IndexedDB `ayni-offline-v1` contiene `queue`, `snapshots` y `meta`. Cada pendiente pertenece a un usuario y conserva un UUID propio y UUID estables para sus fotos. La cola admite hasta cincuenta publicaciones y cien MB de fotos por cuenta, dentro de la capacidad que permita el navegador.

La sincronización se intenta al iniciar la aplicación, al recuperar conexión con `window.addEventListener('online')`, al pulsar Sincronizar ahora y periódicamente mientras la página está abierta. Si cierras la PWA, los datos permanecen en IndexedDB; el envío continuará cuando vuelvas a abrirla con conexión y sesión válida. No se implementa un servicio de envío que funcione con la aplicación cerrada.

Antes de enviar, se comprueba la sesión real. Las subidas y los envíos incluyen una comprobación de propietario para evitar que una sesión o una pestaña distinta atribuya contenido a otra cuenta. Web Locks coordina las pestañas cuando está disponible; la garantía de no duplicación está también en MySQL.

`POST /api/sync/posts` recibe:

```json
{
  "ownerId": "UUID del usuario autenticado",
  "entries": [
    {
      "clientId": "UUID estable de la publicación",
      "payload": {
        "module": "trueque",
        "category": "producto",
        "title": "Libros por plantas",
        "description": "Intercambio libros de mi barrio.",
        "offer": "Libros",
        "request": "Plantas",
        "district": "Los Olivos",
        "neighborhood": "Mi barrio"
      }
    }
  ]
}
```

Acepta hasta diez entradas por petición y devuelve resultados individuales. La restricción única `(author_id, client_request_id)` y la transacción impiden duplicar una publicación, incluso si se pierde la respuesta o dos peticiones llegan juntas. Una repetición con el mismo contenido devuelve el ID ya creado; con datos distintos se rechaza con 409. Las fotos usan una restricción equivalente por propietario y solicitud.

Solo se elimina el pendiente local cuando el servidor confirma su publicación. Los errores temporales y los límites de solicitudes conservan el pendiente para reintento. Si la sesión venció se pide iniciar sesión; los errores de datos o permisos quedan visibles para revisión. Cambiar de cuenta no transfiere borradores. Cerrar sesión borra las lecturas y la identidad guardada, pero conserva los pendientes privados de esa cuenta para recuperarlos al reingresar. No borres los datos del navegador antes de sincronizar.

Los datos locales son específicos del navegador y del origen: `localhost`, `127.0.0.1` y puertos diferentes tienen almacenes distintos. Usa el mismo origen al probar una cola.

## PWA y prueba manual

Se utiliza `vite-plugin-pwa` con Workbox, manifiesto e iconos locales. El Service Worker precarga el HTML, CSS, JavaScript de las rutas y recursos públicos de la interfaz. Las rutas `/api` y `/uploads` están excluidas de la navegación offline y no tienen caché genérica de respuestas privadas. Las lecturas de datos se controlan en React/IndexedDB y están separadas por cuenta.

El Service Worker se genera en producción; no se activa en `npm run dev` para evitar que interfiera con el desarrollo.

1. Inicia MySQL y el backend con `npm run dev` desde Backend Ayni.
2. En Frontend Ayni ejecuta:

```powershell
npm install
npm run build
npm run preview
```

3. Abre `http://127.0.0.1:4173`, inicia sesión, visita los módulos y espera el aviso de disponibilidad offline. `FRONTEND_ORIGINS` del backend debe incluir ese origen; la plantilla ya lo incluye.
4. En las herramientas del navegador, activa Network → Offline. Mantén habilitado el Service Worker, sin Bypass for network. Recarga Inicio y crea un trueque con foto: debe aparecer como pendiente, no como publicado.
5. Cierra y vuelve a abrir la pestaña en el mismo origen. El pendiente debe seguir presente. Recupera la conexión, vuelve a ingresar si la sesión venció y comprueba el envío desde Pendientes y el catálogo.

La instalación y el GPS necesitan un contexto seguro: HTTPS o localhost. Las actualizaciones de PWA se ofrecen mediante un botón; guarda tus formularios antes de recargar para actualizar. Referencia: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/guide/).

## Distrito del perfil

Inicio, trueques, apoyo, emprendimientos, eventos, comunidades y búsqueda se filtran por el distrito registrado de la sesión. Los contadores se calculan con el mismo filtro. No se usa el GPS actual para cambiar silenciosamente el distrito del perfil.

Mis publicaciones, Guardados, los perfiles visitados y los muros de comunidades conservan su alcance propio; los muros siguen requiriendo pertenencia o permisos de moderación. El distrito es un filtro de descubrimiento, no una barrera de privacidad de las publicaciones públicas. Invitados sin distrito registrado pueden ver contenido público. Un pendiente conserva el distrito elegido al redactarlo, aunque después cambie tu perfil.

## Ubicación opcional

En los formularios marca «Añadir una ubicación a esta publicación». Abre «Buscar dirección o elegir en el mapa» para escribir una dirección, elegir una sugerencia o marcar y mover un punto. También puedes usar tu ubicación actual, escribir una referencia sin mapa o abrir «Otras formas de indicar el lugar» para pegar coordenadas o un enlace completo de Google Maps. Desactivado, no se envía ubicación. Un enlace corto de Maps debe abrirse primero para copiar sus coordenadas o el enlace completo. La dirección y el acceso a Maps aparecen sobre los botones de acciones de la publicación.

El GPS solicita permiso solo al pulsar el botón. Las coordenadas elegidas se conservan con el borrador offline y se envían al publicar. No se hace seguimiento continuo ni se sobrescribe el distrito registrado.

Los enlaces que abren el punto en Google Maps no necesitan clave. Para seleccionar con un clic sobre el mapa dentro del formulario, configura opcionalmente en el `.env` del frontend:

```dotenv
VITE_GOOGLE_MAPS_API_KEY=
VITE_GOOGLE_MAPS_MAP_ID=
```

Debes tener Maps JavaScript API y Places API (New) habilitadas, con facturación y restricciones de sitio web en tu proyecto de Google Cloud. En la restricción de API de la clave permite ambas. Para desarrollo autoriza http://127.0.0.1:5173/* y http://localhost:5173/*; para probar la PWA agrega los mismos orígenes en el puerto 4173. El mapa usa Advanced Markers y, si no se indica map ID, el ID de demostración para desarrollo. Sin clave siguen disponibles GPS, dirección y coordenadas. Referencias: [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started), [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview).

## Buscador, perfiles y guía

El buscador superior abre `/buscar?q=...` con pestañas de publicaciones, eventos, comunidades y vecinos. Requiere dos caracteres y respeta el distrito del perfil. Los resultados abren la publicación, evento, comunidad o perfil reales. En las tarjetas, la foto y el nombre del autor llevan a su perfil; allí también aparecen sus publicaciones públicas.

La guía de Inicio tiene ocho pasos con navegación Anterior/Siguiente. Cada paso usa un resumen corto, tres instrucciones numeradas y un consejo. Explica registro, búsqueda, publicaciones, ubicación, comunidades, interacciones, modo sin conexión y cuenta. Se aumentó la legibilidad y el foco del teclado se mueve al título de cada paso.

## Migración y estructura

En este equipo ya se aplicó `npm run db:migrate:offline` con respaldo privado previo. Para otra instalación existente, ejecuta ese comando en Backend Ayni. Una instalación nueva usa `npm run db:init`, que incluye todas las migraciones. Se conservan las veintiséis tablas y se agregan columnas de idempotencia, ubicación y distrito de eventos e índices únicos. Los eventos antiguos toman el distrito del texto de ubicación cuando se reconoce, o el del organizador como alternativa.

| Capa | Archivos principales |
|---|---|
| Datos locales y HTTP | src/models/offline-db.js, http.js, api.js y sync-queue.js del frontend |
| Identidad y eventos de conexión | SessionContext.jsx y OfflineStatus.jsx |
| PWA | vite.config.js y PwaUpdate.jsx |
| Ubicación | AddressField.jsx, GooglePointPicker.jsx y models/maps.js |
| Búsqueda | views/Busqueda.jsx y routes/search.js del backend |
| Creación única | services/posts.js, routes/sync.js y scripts/migrate-offline.js del backend |

## Pruebas y límites de la verificación

- Frontend: `npm test`, `npm run verify` y `npm run build`.
- Backend: `$env:RUN_DB_TESTS='1'` y luego `npm test` para incluir MySQL real con cuentas temporales.
- Las pruebas de IndexedDB usan fake-indexeddb y simulan pérdidas de conexión, respuestas perdidas, sesiones, cambios de cuenta y reintentos. Las de backend comprueban transacciones reales, idempotencia, fotos, distrito, búsqueda y coordenadas. No envían correos ni SMS.
- La revisión de instalación PWA, reapertura offline y selección de Maps en un navegador real debe completarse con los pasos manuales anteriores; no hubo navegador interactivo disponible durante esta actualización. El mapa integrado necesita una clave y no se probó contra un proyecto de Google Cloud.
