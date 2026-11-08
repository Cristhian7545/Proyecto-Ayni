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


## Verificación: mapa desplegable, direcciones y guía accesible

Fecha: 8 de noviembre de 2026.

- npm run build correcto: 105 módulos; PWA con 70 entradas precargadas y Service Worker generado.
- Frontend: 21 pruebas aprobadas, cero fallos u omisiones (14 offline y 7 de ubicación/guía, incluyendo la prueba contenedora). La suite DOM se volvió a ejecutar tras fijar jsdom 26 por compatibilidad con Node: 7 aprobadas.
- npm run verify: quince vistas renderizadas y controles existentes comprobados.
- Interacciones DOM probadas: desplegable, dirección y coordenadas, Enter sin publicar, exclusión de ubicación opcional, selección en mapa, arrastre, GPS, retirada de marcador, respuesta atrasada, error de sugerencias, reintento de carga y guía con foco, avance, regreso y cierre.
- Se confirmó únicamente la presencia de la clave local sin imprimirla ni modificar el .env. Las pruebas usan servicios simulados y no envían ubicaciones ni consumen llamadas a Google.
- No hubo navegador interactivo disponible. Queda pendiente comprobar el mapa/sugerencias reales y la presentación visual con las APIs, facturación y restricciones del proyecto de Google Cloud del usuario. La implementación no activa APIs ni cambia la cuenta de Google Cloud.
- No se modificó el backend o la base de datos. No se crearon commits ni se subió esta actualización a GitHub.

Guía: [UBICACION-Y-GUIA.md](./UBICACION-Y-GUIA.md).


## Verificación: instalador SQL único y guía para otras computadoras

- Creado Mysql/00_instalacion_completa.sql, autosuficiente, con el esquema actual completo y los catálogos públicos. No incluye datos de cuentas ni credenciales.
- Ejecutado todo el archivo en una sola llamada MySQL sobre una base temporal nueva: 26 tablas, 43 distritos y 7 barrios iniciales.
- Segunda ejecución completa sin duplicar el catálogo; cero cuentas precargadas. Columnas de comunidad/ubicación/offline e índices únicos comprobados.
- Backend conectado al esquema instalado: health/db correcto, registro y publicación de trueque con ubicación correctos mediante API. Sin correos, SMS ni servicios externos.
- Eliminada únicamente la base temporal creada para la comprobación. Conteos de usuarios/publicaciones de la base original conservados.
- Creada INSTALACION-Y-COMANDOS.md en la raíz con descargas, SQL, npm install en cada carpeta, .env, secreto de recuperación, dos terminales, administrador opcional, proveedores, PWA y solución de errores.
- No se cambió el código de las aplicaciones ni se reconstruyó el frontend por esta entrega de SQL y documentación. No se crearon commits ni se subieron cambios a GitHub.


## Datos ficticios para tres distritos

- Creado Mysql/07_datos_ejemplo_distritos.sql con cinco vecinos, trueques, apoyos, emprendimientos, avisos públicos, eventos y comunidades por distrito: Puente Piedra, Los Olivos y San Martín de Porres. Agrega un mensaje de muro por comunidad, interacciones y conversaciones demo.
- Probado sobre una base temporal instalada desde 00: 15 usuarios, 75 publicaciones (60 públicas y 15 de comunidades), 15 eventos, 15 comunidades, 75 membresías y 3 conversaciones con 15 mensajes.
- Segunda ejecución sin duplicar filas en ninguna de las 26 tablas. Las cuentas no tienen rol admin, teléfonos ni consentimiento SMS.
- Inicio de sesión real por API con una cuenta de cada distrito; cinco registros por módulo, cinco eventos/comunidades, pertenencia y un mensaje en cada muro, perfil y cinco guardados por cuenta comprobados. Inicio combina 20 publicaciones públicas por distrito.
- Solo se cargaron datos en bases temporales de verificación, eliminadas al terminar. La base actual no se modificó; no se enviaron correos ni SMS y no se subió nada a GitHub.
- Cuentas e instrucciones en Mysql/DATOS-DE-EJEMPLO.md.


## Preparación de publicación: filtros y archivos de instalación

- Filtros de publicaciones: Disponibles, Completados y Cualquier estado; el botón de categoría se llama Todas las categorías. Eventos y comunidades emplean la misma etiqueta de categoría. No cambia el alcance del filtrado.
- npm test: 21 pruebas aprobadas, cero fallos y cero omitidas. npm run verify: 15 vistas comprobadas. npm run build: 105 módulos, Service Worker y 70 entradas de precache generados.
- Se conservan las rutas de INSTALACION-Y-COMANDOS.md, Mysql/00_instalacion_completa.sql, Mysql/07_datos_ejemplo_distritos.sql, Mysql/DATOS-DE-EJEMPLO.md y las guías existentes. Los SQL ya fueron comprobados en bases temporales según los apartados anteriores.
- El primer intento con configuración completa y DB_PASSWORD vacío fue bloqueado por revisión automática por exposición de credenciales de proveedores. Se corrigió el commit no publicado para incluir únicamente configuración sin secretos; los archivos locales completos se conservan. Las plantillas también se conservan. No se incluyen node_modules, dist, respaldos MySQL ni uploads privados.
