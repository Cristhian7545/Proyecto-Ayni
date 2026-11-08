# Frontend Ayni

npm install → npm run dev. Compilación: npm run build. Verificación: npm run verify.

Vite usa 127.0.0.1:5173 y redirige /api y /uploads al backend 127.0.0.1:3001. Inicia ambos servicios desde sus respectivas carpetas. No se deben colocar credenciales MySQL en variables VITE.

Las publicaciones y sus filtros están centralizados en LivePublications y PostCard. ModuleCatalog reutiliza formularios y presentación entre Trueques, Apoyo y Emprendimientos. PublicationForm usa LocationFields, ScheduleFields y PhotoField. FeedbackProvider presenta confirmaciones accesibles. Eventos, Comunidades y Mensajes ya usan sus endpoints reales. Los nuevos eventos se muestran primero al crearlos.

LocationFields obtiene distritos/barrios de la API, con catálogo local de respaldo. GpsLocation requiere permiso y conexión para consultar Nominatim; ofrece selección manual y no cambia el distrito del perfil. El registro y los formularios ya no fijan San Miguel.

Inicio, Trueques, Apoyo, Emprendimientos, Eventos, Comunidades y Perfil mantienen sus rutas. El perfil incluye Mis publicaciones y Guardados; Contactar abre /mensajes?conversacion=ID. El perfil auxiliar de Stitch se conserva como referencia de diseño.

Los días se eligen con casillas, y las horas con selectores de 15 minutos. Los corazones, comentarios, guardados e interés se guardan en MySQL. Las listas ya no incluyen ejemplos ficticios dentro de los conteos operativos.

La documentación de ejecución y migración está en ../README.md. No ejecutar los importadores históricos de Stitch sobre estas vistas.


Consulta [ADMINISTRACION-Y-CORREO.md](../ADMINISTRACION-Y-CORREO.md) para configurar SMTP, Twilio, la administración y la recuperación de contraseña.

## Actualización de interfaz y administración

- `src/views/Administracion.jsx`: panel del administrador; comunidades, publicaciones, apoyos y alertas SMS.
- `src/views/Recuperar.jsx`: solicitud de enlace y cambio de contraseña con token.
- `src/components/PasswordField.jsx` y `PasswordChange.jsx`: ojo de visibilidad, requisitos y cambio desde el perfil.
- `src/components/MoneyField.jsx`: precio referencial en soles, importe numérico para la API.
- `src/components/MuralCarrusel.jsx`: publicaciones reales fijadas y destacadas.
- `src/views/Mensajes.jsx`: chat adaptable con burbujas, fechas, lectura y editor.
- `src/styles/ayni.css`: filtros compartidos y avatares de 40 × 40 con recorte uniforme. En móvil los filtros tienen hasta dos filas y desplazamiento horizontal cuando hace falta.

La configuración de SMTP y Twilio pertenece exclusivamente al backend. Reinicia los dos servidores después de actualizar.


## Muros de comunidad y perfil actualizado

`src/views/Comunidad.jsx` atiende `/comunidades/:communityId` y reutiliza `LivePublications`. `CommunityPostForm`, `PostGallery`, `UserCommunities` y `AdminUsers` contienen los controles nuevos. `Perfil.jsx` utiliza controles compactos con modales en una columna lateral; las comunidades reemplazan las recomendaciones. `Recuperar.jsx` muestra correo, confirmación de código y confirmación de contraseña. Ver [guía actual](../ACTUALIZACION-COMUNIDADES.md).


## Offline-First local

Ver [OFFLINE-FIRST.md](../OFFLINE-FIRST.md). Pruebas de IndexedDB: `npm test`. PWA: `npm run build` y `npm run preview`. Nuevos módulos: `models/offline-db.js`, `sync-queue.js`, `http.js`, `OfflineStatus`, `QueuedPosts`, `PwaUpdate`, `AddressField`, `InteractiveGuide` y vistas `Busqueda`/`Publicacion`. La clave Maps opcional va en `.env`, nunca se necesita para guardar una dirección o abrir enlaces de coordenadas.
