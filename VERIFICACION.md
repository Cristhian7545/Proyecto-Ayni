# Verificación de la actualización

Fecha: 7 de noviembre de 2026.

- MySQL: 21 tablas con nombres españoles; 43 distritos cargados.
- Migración aplicada sobre ayni sin crear otra base. Se verificó la conservación del número de filas previo a la migración. Respaldo local en Mysql/respaldos, excluido de Git.
- Backend: 9 pruebas aprobadas, 0 fallos, con integración MySQL real activada. Incluyen registro con barrio/distrito, Apoyo Solidario, horarios válidos/inválidos, corazones idempotentes, comentarios persistentes, guardados privados, filtros y conteos, contacto/chat privado, evento publicado, interés persistente, permisos de moderación y membresías.
- Frontend: npm run verify comprueba las 10 vistas, selectores de distrito/barrio, siete días, 96 horarios cada 15 minutos y la ubicación de la foto antes del botón. También comprueba el payload real del formulario de Apoyo, incluyendo días múltiples y barrio.
- Compilación de producción con npm run build.
- Las pruebas crean y limpian solamente sus cuentas y registros temporales. Un usuario temporal se usa para probar moderación y se elimina; no se cambia el rol de cuentas existentes.

La detección GPS se verificó con una respuesta simulada del geocodificador, incluida la prioridad del distrito frente al nombre de la ciudad y la caché. No se obtuvo ni se transmitió una ubicación real del equipo durante las pruebas. El funcionamiento GPS en cada dispositivo requiere permiso e internet; la interfaz ofrece selección manual y mensajes de fallo.

No hubo una nueva revisión visual automatizada en navegador porque la herramienta de control del navegador no está disponible en esta sesión. Las pruebas cubren renderizado, compilación y funcionamiento de API/MySQL. Las animaciones respetan la preferencia de movimiento reducido.


## Verificación de la actualización del 8 de noviembre de 2026

- Frontend: npm run build completado correctamente (83 módulos).
- Frontend: npm run verify completado; doce vistas renderizadas, moneda, contraseñas, un solo menú de cuenta, formulario de apoyo, distritos, días, horarios y recursos comprobados.
- Backend: RUN_DB_TESTS=1 npm test; 19 pruebas aprobadas, cero fallos y cero omitidas.
- MySQL: migración aplicada con respaldo previo; 25 tablas en español en la base existente.
- Instalación limpia: SQL y catálogo ejecutados en una base temporal; 25 tablas, rol admin y 43 distritos comprobados. Solo esa base temporal se eliminó al terminar.
- Cuenta administradora solicitada: registro/rol preparados, inicio de sesión y acceso al resumen del panel comprobados mediante la API; sesión de comprobación cerrada.
- SMS: probado con emisor simulado; permisos, consentimiento, teléfonos duplicados, retirada de consentimiento, vista previa, confirmación, límites y prevención de reenvío.
- Recuperación: probada con emisor simulado; respuesta genérica, token almacenado como hash, vencimiento, un solo uso y revocación de sesiones.
- Moderación: aprobación y rechazo, fijado, retirada, protección frente a reactivación del autor, restauración y resolución de apoyo comprobados.
- Chat: insultos rechazados sin guardar, privacidad de conversación y lectura comprobadas.
- Cuentas de prueba residuales con los prefijos de esta suite: 0.
- No se enviaron correos ni SMS reales. SMTP y Twilio no tienen claves configuradas; falta validar entrega real después de configurarlos.
- No hubo acceso a un navegador interactivo en esta sesión: la revisión visual y de clics en navegador queda pendiente. La verificación de frontend fue mediante compilación y renderizado, no mediante capturas de pantalla.


## Actualización: comunidades, perfil y administración

- Muros por comunidad con título, descripción, hasta seis fotos y navegación de regreso. Likes, comentarios y guardados reutilizan el sistema existente.
- Pertenencia validada en el backend, sin filtración al Inicio. Fotos protegidas mediante API, incluso ante enlaces directos o codificados de uploads.
- Mis comunidades en el perfil reemplaza recomendaciones. Perfiles reales de autores muestran sus comunidades. Editar perfil y Cambiar contraseña se ubican a la derecha y abren modales.
- Contactos de emergencia con iconos, colores y enlace oficial gob.pe/547-telefonos-de-emergencia; eliminadas las referencias fijas a San Miguel.
- Recuperación con código de seis dígitos, confirmación y nueva contraseña; diez minutos, cinco intentos, reemplazo al reenviar, HMAC privado y autorización de cinco minutos tras confirmar.
- Administración de cuentas: búsqueda, creación, edición, roles y eliminación lógica que revoca sesiones y conserva el contenido de otros vecinos. No permite eliminarse o quitarse el propio rol de administrador.
- MySQL actualizado con respaldo: 26 tablas. Se conservan las cuentas y publicaciones existentes.
- Validación final: npm run build correcto; npm run verify con trece vistas y controles nuevos; RUN_DB_TESTS=1 npm test con 25 pruebas aprobadas, cero fallos y cero omitidas.
- Instalación limpia: 26 tablas y 43 distritos comprobados en una base temporal; eliminada solo esa base al terminar.
- Autenticación SMTP de Google verificada correctamente con la configuración local. No se enviaron correos ni SMS reales; las pruebas de código utilizan un emisor simulado. La recepción real en bandeja queda pendiente de probar desde la aplicación.
- Cuentas temporales residuales de las suites: cero. Las fotos temporales se eliminaron.
- No hay navegador interactivo disponible en esta sesión: la revisión visual y de clics queda pendiente. Se comprobó compilación, renderizado y API.

Guía actual: [ACTUALIZACION-COMUNIDADES.md](./ACTUALIZACION-COMUNIDADES.md). Reinicia backend y frontend; en este equipo la migración ya está aplicada.


## Verificación: Offline-First, búsqueda y ubicación

Fecha: 8 de noviembre de 2026.

- Backend con MySQL real: 32 pruebas aprobadas, cero fallos y cero omitidas. Incluyen distrito y conteos, búsqueda, validación de coordenadas, permisos, sesión/propietario, subidas idempotentes, reintentos y concurrencia. La suite nueva se volvió a ejecutar tras añadir la comprobación del detalle de eventos: 7 aprobadas.
- Frontend: 14 pruebas de IndexedDB y cola aprobadas, cero fallos. Se comprueban blobs persistentes, respuesta perdida, cambios de cuenta/pestaña, vencimiento de sesión, errores rechazados, HTTP 429, cache por cuenta y URLs de ubicación.
- npm run verify: quince vistas renderizadas, guía de ocho pasos, envío del formulario con ubicación, distritos y controles existentes comprobados.
- npm run build completado. PWA: manifiesto, iconos, 23 chunks de JavaScript en precache y exclusión de API/uploads comprobados. Vista previa HTTP: rutas SPA, Service Worker, proxy y CORS del backend correctos.
- Instalación limpia del SQL en una base temporal: 26 tablas, 43 distritos, columnas de ubicación e idempotencia e índices únicos comprobados; se eliminó solo esa base temporal.
- Migración de la base local aplicada con respaldo. Se mantienen 26 tablas. Cuentas temporales residuales de la suite offline: cero.
- Dependencias de producción del frontend: npm audit --omit=dev informa cero vulnerabilidades. El audit completo conserva seis avisos transitivos de herramientas de compilación de Workbox (dos bajos y cuatro moderados); npm audit fix no ofrece una corrección compatible. No se forzaron degradaciones.
- No se enviaron correos ni SMS reales. No se subió nada a GitHub y no se crearon commits en esta solicitud.
- No hubo navegador interactivo disponible. La instalación PWA, recarga offline, revisión visual y selector integrado de Google Maps requieren la prueba manual descrita en la guía. La compilación y pruebas automatizadas no equivalen a esa revisión. No se utilizó una clave real de Google Maps.

Guía vigente: [OFFLINE-FIRST.md](./OFFLINE-FIRST.md). Reinicia los servidores. Para probar el Service Worker, usa npm run build y npm run preview; está desactivado en desarrollo.
