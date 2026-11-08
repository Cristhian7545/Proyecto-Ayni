# Datos de ejemplo por distrito

Abre 07_datos_ejemplo_distritos.sql en MySQL Workbench y ejecuta TODO el archivo en una sola acción. Necesita el esquema actual: en una instalación nueva ejecuta primero 00_instalacion_completa.sql. Si usas una base con otro nombre, cambia USE ayni por ese nombre.

La carga es opcional: el instalador de la base vacía no ejecuta estos ejemplos automáticamente.

Cada distrito (Puente Piedra, Los Olivos, San Martín de Porres) recibe:

| Contenido | Cantidad por distrito |
|---|---:|
| Vecinos con perfil | 5 |
| Trueques | 5 |
| Apoyos solidarios | 5 |
| Emprendimientos y servicios | 5 |
| Avisos públicos para Inicio | 5 |
| Eventos | 5 |
| Comunidades aprobadas | 5 |
| Publicaciones privadas en comunidades | 5 (una por comunidad) |
| Conversaciones / mensajes | 1 conversación con 5 mensajes |

Inicio es un listado combinado: muestra los trueques, apoyos, emprendimientos y avisos públicos del distrito, no solo los cinco avisos. El carrusel destacado usa esas publicaciones y sus interacciones. Los muros privados siguen requiriendo pertenencia. Las cinco cuentas demo del mismo distrito se unen a sus cinco comunidades. También se incluyen likes, comentarios, guardados y reseñas ficticias.

Todos los datos son ficticios y llevan etiquetas Demo o descripciones de ejemplo. No incluyen celulares reales, coordenadas de domicilios, fotos subidas ni credenciales de proveedores. Los eventos se fechan de 7 a 11 días después de la primera carga; repetir el SQL conserva sus fechas.

## Cuentas para probar

Contraseña compartida de las cuentas demo: **Ayni-Demo-2026!**. Son cuentas de vecino, sin permisos de administrador, destinadas a demostraciones locales. Cada contraseña está almacenada con scrypt compatible con el backend.

| Distrito | Primera cuenta | Otras cuentas |
|---|---|---|
| Puente Piedra | demo.ayni.pp.1@example.invalid | Cambia 1 por 2, 3, 4 o 5 |
| Los Olivos | demo.ayni.lo.1@example.invalid | Cambia 1 por 2, 3, 4 o 5 |
| San Martín de Porres | demo.ayni.smp.1@example.invalid | Cambia 1 por 2, 3, 4 o 5 |

La recuperación por correo no entrega mensajes a example.invalid. Entra con una de estas cuentas para ver el distrito correspondiente; no hace falta permitir el GPS. Mi perfil mostrará sus comunidades y guardados. Para ver el chat de ejemplo, usa la cuenta 1 o 2 de cada distrito.

## Repetición

Se usan UUID estables y comprobaciones de existencia. Repetir el archivo no duplica los datos originales ni cambia las contraseñas, roles o publicaciones que ya hayas editado. El resumen final cuenta también cualquier contenido nuevo que creen esas cuentas después. No se desactivan las claves foráneas y no se elimina contenido. Ejecuta con la opción de detenerse ante errores; si falla antes de COMMIT, ejecuta ROLLBACK en la misma conexión y revisa el esquema antes de reintentar.
