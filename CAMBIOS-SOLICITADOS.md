# Correspondencia de cambios

| Punto | Implementación |
|---|---|
| 1 | Inicio: GPS con permiso, geocodificación de distrito, manejo de errores y selección manual. |
| 2 | LocationFields: 43 distritos de Lima en registro y formularios. |
| 3 | Barrios según distrito desde MySQL; opción Otro barrio; se muestra el barrio registrado. |
| 4 | PostCard: corazón marcado y comentarios reales desde Inicio. |
| 5 | Formularios inicializados con distrito y barrio del perfil; backend usa el perfil si se omiten. |
| 6 | Casillas de lunes a domingo, sin escribir días manualmente. |
| 7 | Selectores con 96 horarios cada 15 minutos y validación en backend. |
| 8 | Disponibles, Completados y Todos consultan estados reales. |
| 9 | guardados_publicaciones y pestaña Guardados del perfil. |
| 10 | Formulario de Apoyo unificado; prueba de payload y de guardado en MySQL. |
| 11 | Contactar crea o abre la conversación con el autor de esa publicación. |
| 12 | Aviso de acopio sin botón de entrega ni icono de compartir. |
| 13 | Estado seleccionado persistente, color de corazón/interés, animación de clic. |
| 14 | FeedbackProvider con modal de confirmación de creación. |
| 16 | Eventos conectados: se publican, se recargan y el nuevo registro aparece primero. |
| 17 | Todas las publicaciones operativas comparten PostCard y comentarios persistentes. |
| 18 | Conteos desde MySQL por filtros, estado y categoría; paginación de resultados. |
| Tablas | 18 tablas renombradas + guardados_publicaciones, distritos y barrios: 21 tablas. |

El catálogo de barrios es inicial y ampliable, no exhaustivo. No se mezclan ejemplos de Stitch en las listas operativas para evitar conteos y acciones ficticias. El mural y el perfil auxiliar de referencia se conservan. Las columnas y rutas HTTP mantienen su contrato por compatibilidad.


## Actualización del 8 de noviembre de 2026: los 15 puntos de interfaz y administración

| Punto | Resultado |
|---|---|
| 1. Perfil duplicado | Un único avatar abre el menú de cuenta; se quitaron los accesos repetidos. |
| 2. Distrito manual | Eliminado del Inicio; se conserva detección GPS y barrio registrado como alternativa. |
| 3. Precio referencial | Campo con formato de moneda PEN y envío numérico a MySQL. |
| 4. Chat | Burbujas, fechas, hora, indicadores de lectura, conversaciones sin leer, búsqueda y vista móvil. |
| 5. Mural destacado | Primero las publicaciones fijadas; luego las de mayor suma de apoyos y comentarios, hasta seis. |
| 6. Contraseñas | Diez caracteres como mínimo, mayúscula, minúscula, número y carácter especial; botón para ver/ocultar. |
| 7. Filtros | Una cuadrícula compartida se adapta al ancho; hasta dos filas con desplazamiento horizontal en móvil. |
| 8. Miniaturas | Avatares cuadrados de 40 × 40 recortados en círculo y sin deformación. |
| 9. Acceso sin repetición | Pestañas Ya tengo cuenta / Soy nuevo y acción Ingresar. |
| 10. Recuperación | Formulario, correo SMTP, tokens únicos con vencimiento y cierre de sesiones. Requiere claves SMTP. |
| 11. Administrador | Cuenta solicitada creada y acceso comprobado; aprobación/rechazo, resolución de apoyos y alertas SMS con confirmación. SMS requiere claves Twilio. |
| 12. Celular | Obligatorio para nuevas cuentas, validado y normalizado a formato peruano. Consentimiento SMS opcional. |
| 13. Restricciones del chat | Lista inicial de insultos validada en servidor y límite de frecuencia; no detecta todo tipo de abuso. |
| 14. Retirar contenido | Admin retira con motivo, conserva registro y puede restaurar. |
| 15. Fijar murales | Admin fija/desfija publicaciones activas; la prioridad se refleja en Inicio. |

Guía de configuración: [ADMINISTRACION-Y-CORREO.md](./ADMINISTRACION-Y-CORREO.md). La contraseña inicial está únicamente en el archivo privado Backend Ayni/.admin-inicial.txt y en la entrega al usuario.


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


## Actualización local: Offline-First y descubrimiento por distrito

- PWA con vite-plugin-pwa y Service Worker para abrir la interfaz previamente preparada sin conexión. IndexedDB guarda publicaciones, trueques, apoyos, emprendimientos y fotos como pendientes por cuenta.
- Cola que reintenta con sesión válida al volver la conexión. Endpoint autenticado de sincronización, IDs estables y restricciones únicas en MySQL para evitar duplicados tras perder una respuesta. Los errores de datos permanecen visibles para revisión.
- Inicio, catálogos, eventos, comunidades, búsqueda y sus contadores utilizan el distrito registrado. Perfiles, guardados y muros de comunidad conservan su alcance y permisos propios.
- Foto y nombre del autor abren su perfil real. El buscador superior permite explorar publicaciones, eventos, comunidades y vecinos con enlaces al resultado.
- Guía interactiva de ocho pasos sobre registro, publicaciones, ubicación, comunidades, interacciones, uso offline y cuenta.
- Dirección y punto de encuentro opcionales en formularios, mediante GPS, coordenadas o enlace completo de Maps; se muestran sobre las acciones de la tarjeta. Un mapa integrado seleccionable requiere configurar la clave opcional de Google.
- Migración aplicada con respaldo previo, conservando las 26 tablas y los datos. No se hicieron commits ni subidas a GitHub en esta solicitud.

Configuración y prueba manual: [OFFLINE-FIRST.md](./OFFLINE-FIRST.md).


## Ubicación desplegable y textos de la guía

- Formularios existentes: mapa desplegable, sugerencias de dirección en Perú, selección con toque o marcador y botón de ubicación actual. Dirección y coordenadas se guardan mediante el flujo ya existente.
- Se evita publicar al pulsar Enter en una sugerencia, se sincroniza el marcador al cambiar de punto/GPS y se ignoran respuestas atrasadas. La dirección manual sigue disponible si falla Google.
- Guía de ocho pasos con resumen corto, tres instrucciones numeradas, ejemplos, texto más legible y foco al cambiar de paso.
- No se agregaron imágenes a la guía. No se modificó el backend, MySQL ni el .env. No se hicieron commits ni subidas a GitHub en esta actualización.

Instrucciones: [UBICACION-Y-GUIA.md](./UBICACION-Y-GUIA.md).


## Filtros y preparación para compartir el proyecto

- Publicaciones: el estado combinado se llama Cualquier estado; la categoría sin selección se llama Todas las categorías. Se evita mostrar Todos y Todas como opciones ambiguas consecutivas.
- Eventos y comunidades usan el mismo nombre Todas las categorías para restablecer ese filtro. Se conservan los conteos y el filtrado existentes.
- Las guías de instalación, esquema completo, datos demo y documentación de mapa se conservan en sus rutas originales. La versión compartida incluye los .env con credenciales vacías y conserva los archivos locales completos; no se publican contraseñas ni claves de proveedores.
