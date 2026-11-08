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
