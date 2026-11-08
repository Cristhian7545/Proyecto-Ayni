# Proyecto Ayni

Frontend React + Vite + Tailwind, backend Node.js + Express y MySQL. Los siete módulos se conservan.

## Ejecutar

Abre esta carpeta en VS Code y usa dos terminales:

**Backend:**

```powershell
cd "Backend Ayni"
npm install
npm run dev
```

**Frontend:**

```powershell
cd "Frontend Ayni"
npm install
npm run dev
```

Abre http://127.0.0.1:5173 . MySQL debe estar encendido; las credenciales siguen en Backend Ayni/.env. No se cambiaron ni se imprimieron.

## Base de datos en español

La base sigue llamándose **ayni**, con **25 tablas en español**. Se renombraron las existentes conservando sus filas, claves y relaciones. Antes de migrar se guardó un respaldo local de estructura y datos en Mysql/respaldos. Es privado: no lo publiques ni lo agregues a Git.

- Mysql/01_crear_tablas.sql: instalación nueva, 25 tablas.
- Mysql/02_renombrar_tablas.sql: referencia del cambio inglés → español (ya aplicado aquí; no repetir manualmente).
- Mysql/03_mejoras.sql: guardados y catálogos.
- Mysql/04_catalogos.sql: distritos y barrios iniciales.
- Backend Ayni: npm run db:migrate realiza la migración comprobando el estado actual; npm run db:init prepara una instalación nueva o migra una antigua sin crear tablas paralelas vacías.

Los nombres de columnas y las rutas HTTP se mantienen compatibles con el contrato anterior; los nombres de tablas sí están en español. No es necesario crear otra base ni volver a registrar las cuentas existentes.

## Funciones conectadas

- Registro con distrito, barrio, celular obligatorio y contraseña con requisitos. Selectores de los 43 distritos de la provincia de Lima y un catálogo inicial ampliable de barrios. Si falta tu barrio, usa “Otro barrio / urbanización”. El catálogo público se consulta desde MySQL.
- Inicio muestra el barrio del perfil y permite detectar el distrito mediante GPS. Solicita permiso; si ya lo concediste, intenta detectarlo al abrir. Se eliminó el selector manual redundante y se conserva el manejo de errores. No modifica el distrito registrado.
- Los formularios toman distrito y barrio del usuario, permiten cambiarlos, incluyen días seleccionables y 96 horarios con intervalos de 15 minutos. El backend también valida el intervalo y la hora final.
- Corazones, comentarios y guardados persistentes. Los guardados son privados por usuario y aparecen en el perfil.
- Filtros de disponibles/completados/categorías con conteos reales y paginación; no se mezclan tarjetas ficticias con los totales de MySQL.
- Publicación de apoyo, trueques y emprendimientos, incluyendo foto opcional. Contactar abre una conversación real con su autor.
- Eventos reales con foto opcional, publicación inmediata, filtros, contadores e interés persistente y visible por color.
- Comunidades reales con propuesta, aprobación por moderador o administrador, categorías, conteos y membresía.
- Mensajería real entre participantes, actualizada cada 8 segundos. Las consultas privadas siguen protegidas en el backend.
- Confirmaciones de creación en modal, estados de clic y respeto de la preferencia de reducir animaciones.

El mural utiliza publicaciones reales fijadas o destacadas por apoyos y comentarios, y el perfil auxiliar de referencia de Stitch se conserva; las listas operativas ya usan datos reales. Para probar las acciones, registra dos cuentas de vecinos y publica con una de ellas. No se importan personas ficticias a MySQL.

## GPS y catálogos

La geolocalización requiere permiso del navegador y localhost o HTTPS. El backend consulta OpenStreetMap/Nominatim para convertir coordenadas a un distrito, con caché temporal, límites y mensajes si el servicio falla. Las coordenadas no se guardan en el perfil; no se toma el barrio del GPS para sobrescribir el que elegiste al registrarte. En producción debe revisarse la capacidad y política del proveedor antes de un uso masivo.

El catálogo de barrios no pretende ser un registro oficial exhaustivo. Puedes ampliarlo en las tablas distritos/barrios; se reflejará tras recargar la aplicación. Mysql/catalogo_lima.json sirve de catálogo inicial y respaldo de interfaz cuando la API no responde.

Fuentes: [43 distritos de Lima, PCM](https://www.gob.pe/institucion/pcm/campa%C3%B1as/4355-limametropolitana-informacion-territorial), [MTC](https://portal.mtc.gob.pe/transportes/caminos/normas_carreteras/mapa-ruta-distrital.html), [Nominatim](https://nominatim.org/release-docs/latest/api/Reverse/), [política de uso](https://operations.osmfoundation.org/policies/nominatim/).

## Pruebas

- Frontend Ayni: npm run build y npm run verify.
- Backend Ayni: npm test. Para incluir MySQL real en PowerShell: $env:RUN_DB_TESTS='1'; npm test.
- Las pruebas crean y eliminan únicamente sus propias cuentas y registros temporales. Nunca ejecutarlas en producción.

Reinicia ambos servidores si estaban abiertos al realizar la actualización. Los puertos siguen siendo 3001 y 5173. Los archivos .env permanecen privados y el frontend nunca recibe credenciales de MySQL.


## Última actualización: administración, recuperación e interfaz

Se corrigió el doble acceso de perfil, se unificaron filtros y miniaturas, se eliminó el selector manual del Inicio y el precio referencial se muestra en soles. El chat tiene burbujas, fechas, lectura y restricciones de insultos en el servidor. El registro pide celular y consentimiento SMS opcional; las contraseñas tienen requisitos e icono para mostrarlas.

Nuevas vistas auxiliares dentro de Frontend Ayni: `src/views/Administracion.jsx` en `/administracion` y `src/views/Recuperar.jsx` en `/recuperar`. Las siete áreas principales se conservan. La arquitectura MVC adaptada mantiene modelos de acceso a API en `src/models`, vistas en `src/views`, controladores/hooks en `src/controllers`, componentes compartidos en `src/components` y navegación en `src/routes`.

El administrador solicitado es **leonoreeuu00@gmail.com**. La contraseña inicial está en el archivo privado `Backend Ayni/.admin-inicial.txt`; se puede cambiar desde Mi perfil. Los permisos se comprueban en el backend.

La recuperación de contraseña y las alertas están implementadas; falta completar las claves SMTP y Twilio en el `.env` del backend para envíos reales. Consulta [ADMINISTRACION-Y-CORREO.md](./ADMINISTRACION-Y-CORREO.md) para configurar, usar y probar estas funciones. Los envíos de desarrollo se comprobaron con emisores simulados, sin enviar mensajes reales.

- `Mysql/05_administracion.sql`: cuatro tablas nuevas en español.
- `npm run db:migrate:admin`: migración con respaldo, sin reiniciar datos.
- `npm run admin:create`: genera/reemplaza la contraseña de `ADMIN_EMAIL`; no es un comando de arranque.
