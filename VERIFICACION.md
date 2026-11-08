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
