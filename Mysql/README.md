# Esquema de Ayni en español

La base ayni conserva los datos existentes. Sus tablas son:

usuarios, sesiones, publicaciones, detalles_trueque, detalles_apoyo, detalles_emprendimiento, disponibilidad, archivos_multimedia, me_gusta_publicaciones, comentarios, eventos, intereses_eventos, comunidades, miembros_comunidad, conversaciones, publicaciones_conversacion, mensajes, resenas, guardados_publicaciones, distritos, barrios, tokens_recuperacion, acciones_admin, alertas_sms, destinatarios_alerta.

Para instalar desde cero: ejecuta npm run db:init dentro de Backend Ayni (usa .env). Para una instalación antigua: npm run db:migrate y luego npm run db:migrate:admin. El migrador verifica nombres, realiza respaldo local en Mysql/respaldos y renombra las tablas mediante una sola sentencia RENAME TABLE. Si encuentra nombres en ambos idiomas, se detiene para no ocultar ni mezclar datos.

01_crear_tablas.sql contiene el esquema completo; 04_catalogos.sql carga los catálogos cuando se trabaja manualmente en Workbench. La migración de este equipo ya se aplicó. No vuelvas a ejecutar 02_renombrar_tablas.sql manualmente sobre tablas ya renombradas.

Las columnas y las rutas de la API conservan sus nombres anteriores por compatibilidad. Los nuevos registros validan distritos, días y horarios en el backend. El respaldo contiene datos privados y hashes de contraseña: conservar localmente, no compartir ni subir a Git. .gitignore excluye la carpeta respaldos.

05_administracion.sql contiene las cuatro tablas nuevas; el migrador de administración agrega también las columnas necesarias a las tablas existentes. 01_crear_tablas.sql incluye el esquema completo de 25 tablas. El respaldo de esta actualización se conserva en respaldos/admin-*.json.
