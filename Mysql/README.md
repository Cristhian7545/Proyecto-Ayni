# Base de datos Ayni

Para instalar desde cero en MySQL Workbench abre **00_instalacion_completa.sql** y ejecuta todo su contenido mediante Execute (All or Selection). Es autosuficiente: crea la base ayni, las 26 tablas, relaciones e índices, 43 distritos y 7 barrios iniciales. No necesita ejecutar otros SQL ni usar SOURCE.

Guía paso a paso: [INSTALACION-Y-COMANDOS.md](../INSTALACION-Y-COMANDOS.md). Incluye la preparación de los .env y la clave privada de recuperación, que se generan en cada equipo y no pertenecen a la base compartida.

El archivo completo no incluye cuentas ni publicaciones privadas. No borra la base ni las tablas. Repetirlo sobre el esquema actual no duplica el catálogo, pero no actualiza columnas antiguas: para una instalación existente usa npm run db:init en Backend Ayni. Los migradores comprueban y respaldan antes de cambiar la estructura.

## Archivos

| Archivo | Uso |
|---|---|
| 00_instalacion_completa.sql | Instalación nueva en una ejecución: esquema y catálogos. |
| 01_crear_tablas.sql | Fuente del esquema actual utilizada por db:init. |
| 04_catalogos.sql | Fuente del catálogo utilizada en la instalación manual completa. |
| 02_renombrar_tablas.sql | Referencia de migración; no ejecutar sobre tablas ya renombradas. |
| 03_mejoras.sql, 05_administracion.sql, 06_comunidades_y_codigos.sql | Recursos de los migradores; el esquema completo ya los integra. |
| catalogo_lima.json | Catálogo inicial público de distritos/barrios. |
| respaldos/ | Copias privadas de cada instalación, excluidas de Git. |

Las 26 tablas tienen nombres en español. Las columnas y rutas de la API mantienen sus nombres actuales por compatibilidad. El esquema incluye códigos de recuperación, administración, comunidades, chat, guardados, ubicación y claves únicas de sincronización offline. Las credenciales MySQL van en Backend Ayni/.env; SMTP/Twilio se configuran allí y Maps en el .env del frontend.

Si cambia el esquema o catálogo, actualiza también el SQL completo con el contenido de 01_crear_tablas.sql y 04_catalogos.sql, manteniendo su orden. El instalador único es para MySQL 8.0.16 o posterior y no se ha preparado para MariaDB.


## Datos ficticios opcionales

Después de instalar el esquema, puedes ejecutar **07_datos_ejemplo_distritos.sql** completo en Workbench. Agrega cinco registros por sección para Puente Piedra, Los Olivos y San Martín de Porres, con perfiles, comunidades, guardados y conversaciones de demostración. Instrucciones y cuentas: [DATOS-DE-EJEMPLO.md](./DATOS-DE-EJEMPLO.md). Este archivo es opcional y no se incluye en el instalador vacío 00.
