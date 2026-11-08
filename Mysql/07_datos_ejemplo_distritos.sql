-- DATOS FICTICIOS DE EJEMPLO AYNI - MySQL 8.0.16+
-- Ejecutar TODO el archivo despues de 00_instalacion_completa.sql.
-- 5 vecinos, trueques, apoyos, emprendimientos, avisos, eventos y comunidades por distrito.
-- San Martin corresponde a San Martin de Porres (nombre completo del catalogo).
-- Incluye un mensaje de muro por comunidad y cinco mensajes de chat por distrito.
-- Todos los eventos, personas y ofertas son ficticios, sin telefonos ni envios externos.
-- Cuentas demo publicas: clave compartida Ayni-Demo-2026!; nunca tienen rol admin.
-- Repetir este script no duplica sus registros ni restablece contrasenas existentes.
-- No borra ni modifica registros ajenos. No desactiva claves foraneas.
-- Ver DATOS-DE-EJEMPLO.md para cuentas y cantidades.
SET NAMES utf8mb4;
USE ayni;
SET @ayni_demo_huso_anterior = @@session.time_zone;
SET time_zone = '+00:00';
START TRANSACTION;


-- ===== Puente Piedra =====

INSERT INTO usuarios (id,name,email,password_hash,district,neighborhood,bio,avatar_url,phone,sms_opt_in,role)
SELECT 'c4107ea0-ea1b-42af-837b-7cf7b883a53b','Lucía Torres (Demo PP-1)','demo.ayni.pp.1@example.invalid','scrypt:3bc68006472166fab6ccc063813f0263:6c063f779a983a3cd72a2c2b3c222242799c554d725c1cd7b788b2a9ce1666ddf05d8e1d9ade50e865b635857aa0b9baf2183ae7931c32b6d43d651828a615ea','Puente Piedra','Barrio de ejemplo 1','Perfil ficticio para probar Ayni. Sin datos de contacto reales.','/assets/avatar-default.svg',NULL,0,'neighbor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id='c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT INTO usuarios (id,name,email,password_hash,district,neighborhood,bio,avatar_url,phone,sms_opt_in,role)
SELECT 'df7f5b30-80de-4294-8d72-3224346129e4','Mateo Rojas (Demo PP-2)','demo.ayni.pp.2@example.invalid','scrypt:f10f13ed8a4bb8528d374218c433ad29:6888b75bd5cf0e3242c456aecad9036c6b29c4107b5897ed9540e0a8667435caaa7bf7a4f6cfbab9db543ab4efa29bba1aabd24aa29879375632108336ae3b26','Puente Piedra','Barrio de ejemplo 2','Perfil ficticio para probar Ayni. Sin datos de contacto reales.','/assets/avatar-default.svg',NULL,0,'neighbor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id='df7f5b30-80de-4294-8d72-3224346129e4');

INSERT INTO usuarios (id,name,email,password_hash,district,neighborhood,bio,avatar_url,phone,sms_opt_in,role)
SELECT '757463e0-fc76-4ff9-8e9c-68eacbfdcf42','Valeria Flores (Demo PP-3)','demo.ayni.pp.3@example.invalid','scrypt:1b5a5bc3f3b99ee823b9e1d4251ba77d:aafceabf4916cbe4cc16736c6b6471639d260910b3f5e674a86f8e8b49b3b99fe49432c79b49ad861c9225a3be3a0b55781f5d0f8d8ff18a30375e9839f9d454','Puente Piedra','Barrio de ejemplo 3','Perfil ficticio para probar Ayni. Sin datos de contacto reales.','/assets/avatar-default.svg',NULL,0,'neighbor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT INTO usuarios (id,name,email,password_hash,district,neighborhood,bio,avatar_url,phone,sms_opt_in,role)
SELECT '98418a45-699d-46f0-884f-bfc9bb5aa2cc','Diego Castillo (Demo PP-4)','demo.ayni.pp.4@example.invalid','scrypt:014f134a2bb018ee948e08a1b6b68a0c:edb1720fe84838b61d916e04ccbda438f9cc785171284a939e43a911d4c06d3794456c6a11d7f860df997d33fc8cf8fb605d03f14693b3d89560bb575ac86076','Puente Piedra','Barrio de ejemplo 4','Perfil ficticio para probar Ayni. Sin datos de contacto reales.','/assets/avatar-default.svg',NULL,0,'neighbor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id='98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT INTO usuarios (id,name,email,password_hash,district,neighborhood,bio,avatar_url,phone,sms_opt_in,role)
SELECT '7c7f75e7-974d-46fb-8dee-79e8b813bfd9','Camila Vega (Demo PP-5)','demo.ayni.pp.5@example.invalid','scrypt:3968b114870fe400450c571303002d02:65a30619967b7ae82eec4aeaea04decb6f6a67dc5c987878973d4dfe433e1d0f56bd87e24be34c89246df8abdd7d17d2c0f45827432ed7ae92c94c18ba390510','Puente Piedra','Barrio de ejemplo 5','Perfil ficticio para probar Ayni. Sin datos de contacto reales.','/assets/avatar-default.svg',NULL,0,'neighbor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'c4107ea0-ea1b-42af-837b-7cf7b883a53b','trueque','producto','[Demo] Libros por plantas · Puente Piedra','DATOS DE EJEMPLO. Ofrezco: Cinco libros de lectura en buen estado. Busco: Una planta pequeña para mi sala. Coordinar por el chat de Ayni.','Puente Piedra','Barrio de ejemplo 1','fc71a10e-bd17-4988-82ae-cf7496e271ff','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND client_request_id='fc71a10e-bd17-4988-82ae-cf7496e271ff');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND client_request_id='fc71a10e-bd17-4988-82ae-cf7496e271ff');

INSERT INTO detalles_trueque (post_id,offer,request,item_condition,quantity) SELECT @ayni_demo_publicacion,'Cinco libros de lectura en buen estado','Una planta pequeña para mi sala','Usado en buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_trueque WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='df7f5b30-80de-4294-8d72-3224346129e4' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'df7f5b30-80de-4294-8d72-3224346129e4','trueque','producto','[Demo] Bicicleta por herramientas · Puente Piedra','DATOS DE EJEMPLO. Ofrezco: Bicicleta usada para paseos cortos. Busco: Herramientas de jardinería. Coordinar por el chat de Ayni.','Puente Piedra','Barrio de ejemplo 2','9d31cf7b-9ffc-497d-89fb-9a3fe31ae22a','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='df7f5b30-80de-4294-8d72-3224346129e4' AND client_request_id='9d31cf7b-9ffc-497d-89fb-9a3fe31ae22a');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='df7f5b30-80de-4294-8d72-3224346129e4' AND client_request_id='9d31cf7b-9ffc-497d-89fb-9a3fe31ae22a');

INSERT INTO detalles_trueque (post_id,offer,request,item_condition,quantity) SELECT @ayni_demo_publicacion,'Bicicleta usada para paseos cortos','Herramientas de jardinería','Usado en buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_trueque WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '757463e0-fc76-4ff9-8e9c-68eacbfdcf42','trueque','habilidad','[Demo] Clases de matemática por inglés · Puente Piedra','DATOS DE EJEMPLO. Ofrezco: Una hora de apoyo en matemática. Busco: Una hora de conversación en inglés. Coordinar por el chat de Ayni.','Puente Piedra','Barrio de ejemplo 3','f3f8797a-32ff-4a0b-838a-4204a25467db','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND client_request_id='f3f8797a-32ff-4a0b-838a-4204a25467db');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND client_request_id='f3f8797a-32ff-4a0b-838a-4204a25467db');

INSERT INTO detalles_trueque (post_id,offer,request,item_condition,quantity) SELECT @ayni_demo_publicacion,'Una hora de apoyo en matemática','Una hora de conversación en inglés','Usado en buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_trueque WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '98418a45-699d-46f0-884f-bfc9bb5aa2cc','trueque','servicio','[Demo] Reparación de ropa por cocina · Puente Piedra','DATOS DE EJEMPLO. Ofrezco: Arreglo básico de dos prendas. Busco: Una clase de cocina casera. Coordinar por el chat de Ayni.','Puente Piedra','Barrio de ejemplo 4','f8e8bb63-97cf-4832-8011-d28011bc3420','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND client_request_id='f8e8bb63-97cf-4832-8011-d28011bc3420');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND client_request_id='f8e8bb63-97cf-4832-8011-d28011bc3420');

INSERT INTO detalles_trueque (post_id,offer,request,item_condition,quantity) SELECT @ayni_demo_publicacion,'Arreglo básico de dos prendas','Una clase de cocina casera','Usado en buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_trueque WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '7c7f75e7-974d-46fb-8dee-79e8b813bfd9','trueque','producto','[Demo] Rompecabezas por juegos de mesa · Puente Piedra','DATOS DE EJEMPLO. Ofrezco: Rompecabezas completo de 500 piezas. Busco: Un juego de mesa familiar. Coordinar por el chat de Ayni.','Puente Piedra','Barrio de ejemplo 5','2b3af550-a5b3-4a33-8381-60180c9e1118','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND client_request_id='2b3af550-a5b3-4a33-8381-60180c9e1118');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND client_request_id='2b3af550-a5b3-4a33-8381-60180c9e1118');

INSERT INTO detalles_trueque (post_id,offer,request,item_condition,quantity) SELECT @ayni_demo_publicacion,'Rompecabezas completo de 500 piezas','Un juego de mesa familiar','Usado en buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_trueque WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'c4107ea0-ea1b-42af-837b-7cf7b883a53b','apoyo','donacion','[Demo] Donación de ropa de abrigo · Puente Piedra','DATOS DE EJEMPLO. Ofrezco prendas limpias en buen estado para personas que las necesiten.','Puente Piedra','Barrio de ejemplo 1','dccb47f7-9aff-4e37-81f3-0ff73d0b64b8','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND client_request_id='dccb47f7-9aff-4e37-81f3-0ff73d0b64b8');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND client_request_id='dccb47f7-9aff-4e37-81f3-0ff73d0b64b8');

INSERT INTO detalles_apoyo (post_id,priority,item_condition,quantity) SELECT @ayni_demo_publicacion,'Regular','Buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_apoyo WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='df7f5b30-80de-4294-8d72-3224346129e4' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'df7f5b30-80de-4294-8d72-3224346129e4','apoyo','necesito','[Demo] Apoyo con útiles escolares · Puente Piedra','DATOS DE EJEMPLO. Solicitamos cuadernos y colores para un taller vecinal de ejemplo.','Puente Piedra','Barrio de ejemplo 2','6bd2dd91-e107-4822-8ce2-1c999d4f6814','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='df7f5b30-80de-4294-8d72-3224346129e4' AND client_request_id='6bd2dd91-e107-4822-8ce2-1c999d4f6814');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='df7f5b30-80de-4294-8d72-3224346129e4' AND client_request_id='6bd2dd91-e107-4822-8ce2-1c999d4f6814');

INSERT INTO detalles_apoyo (post_id,priority,item_condition,quantity) SELECT @ayni_demo_publicacion,'Prioritario','Buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_apoyo WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '757463e0-fc76-4ff9-8e9c-68eacbfdcf42','apoyo','voluntariado','[Demo] Voluntarios para limpiar el parque · Puente Piedra','DATOS DE EJEMPLO. Invitamos a vecinos a colaborar con una jornada de limpieza.','Puente Piedra','Barrio de ejemplo 3','60d2f466-d020-4258-8fa4-c172d1c32210','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND client_request_id='60d2f466-d020-4258-8fa4-c172d1c32210');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND client_request_id='60d2f466-d020-4258-8fa4-c172d1c32210');

INSERT INTO detalles_apoyo (post_id,priority,item_condition,quantity) SELECT @ayni_demo_publicacion,'Regular','Buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_apoyo WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '98418a45-699d-46f0-884f-bfc9bb5aa2cc','apoyo','servicio','[Demo] Apoyo digital para adultos mayores · Puente Piedra','DATOS DE EJEMPLO. Ayudamos gratuitamente a usar el celular y hacer videollamadas.','Puente Piedra','Barrio de ejemplo 4','9c15320f-d83f-4e49-815d-6bd4034f3a3f','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND client_request_id='9c15320f-d83f-4e49-815d-6bd4034f3a3f');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND client_request_id='9c15320f-d83f-4e49-815d-6bd4034f3a3f');

INSERT INTO detalles_apoyo (post_id,priority,item_condition,quantity) SELECT @ayni_demo_publicacion,'Regular','Buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_apoyo WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '7c7f75e7-974d-46fb-8dee-79e8b813bfd9','apoyo','donacion','[Demo] Donación de libros infantiles · Puente Piedra','DATOS DE EJEMPLO. Compartimos cuentos para fomentar la lectura entre familias.','Puente Piedra','Barrio de ejemplo 5','177ef312-551a-4cb4-882d-bc26868acb64','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND client_request_id='177ef312-551a-4cb4-882d-bc26868acb64');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND client_request_id='177ef312-551a-4cb4-882d-bc26868acb64');

INSERT INTO detalles_apoyo (post_id,priority,item_condition,quantity) SELECT @ayni_demo_publicacion,'Regular','Buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_apoyo WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'c4107ea0-ea1b-42af-837b-7cf7b883a53b','emprendimiento','producto','[Demo] Panadería artesanal · Puente Piedra','DATOS DE EJEMPLO. Panes caseros preparados por encargo. Precio referencial por paquete.','Puente Piedra','Barrio de ejemplo 1','0cd0298b-17b8-4dd2-8acd-a3ceb57c7c87','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND client_request_id='0cd0298b-17b8-4dd2-8acd-a3ceb57c7c87');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND client_request_id='0cd0298b-17b8-4dd2-8acd-a3ceb57c7c87');

INSERT INTO detalles_emprendimiento (post_id,price,accepts_barter) SELECT @ayni_demo_publicacion,12,0 WHERE NOT EXISTS (SELECT 1 FROM detalles_emprendimiento WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='df7f5b30-80de-4294-8d72-3224346129e4' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) SELECT @ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4','c4107ea0-ea1b-42af-837b-7cf7b883a53b','Reseña ficticia: buena atención y coordinación.' WHERE NOT EXISTS(SELECT 1 FROM resenas WHERE post_id=@ayni_demo_publicacion AND author_id='df7f5b30-80de-4294-8d72-3224346129e4');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'df7f5b30-80de-4294-8d72-3224346129e4','emprendimiento','servicio','[Demo] Servicio de costura · Puente Piedra','DATOS DE EJEMPLO. Arreglos de prendas y bastas. Precio referencial por servicio.','Puente Piedra','Barrio de ejemplo 2','2410f167-ea62-4bfd-8b8e-a0fc0c0ed130','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='df7f5b30-80de-4294-8d72-3224346129e4' AND client_request_id='2410f167-ea62-4bfd-8b8e-a0fc0c0ed130');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='df7f5b30-80de-4294-8d72-3224346129e4' AND client_request_id='2410f167-ea62-4bfd-8b8e-a0fc0c0ed130');

INSERT INTO detalles_emprendimiento (post_id,price,accepts_barter) SELECT @ayni_demo_publicacion,15,1 WHERE NOT EXISTS (SELECT 1 FROM detalles_emprendimiento WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) SELECT @ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42','df7f5b30-80de-4294-8d72-3224346129e4','Reseña ficticia: buena atención y coordinación.' WHERE NOT EXISTS(SELECT 1 FROM resenas WHERE post_id=@ayni_demo_publicacion AND author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '757463e0-fc76-4ff9-8e9c-68eacbfdcf42','emprendimiento','producto','[Demo] Postres por encargo · Puente Piedra','DATOS DE EJEMPLO. Queques y postres familiares. Precio referencial por porción.','Puente Piedra','Barrio de ejemplo 3','224e1fba-245a-4df9-8089-3433c3beb196','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND client_request_id='224e1fba-245a-4df9-8089-3433c3beb196');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND client_request_id='224e1fba-245a-4df9-8089-3433c3beb196');

INSERT INTO detalles_emprendimiento (post_id,price,accepts_barter) SELECT @ayni_demo_publicacion,8.5,0 WHERE NOT EXISTS (SELECT 1 FROM detalles_emprendimiento WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) SELECT @ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc','757463e0-fc76-4ff9-8e9c-68eacbfdcf42','Reseña ficticia: buena atención y coordinación.' WHERE NOT EXISTS(SELECT 1 FROM resenas WHERE post_id=@ayni_demo_publicacion AND author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '98418a45-699d-46f0-884f-bfc9bb5aa2cc','emprendimiento','servicio','[Demo] Mantenimiento de computadoras · Puente Piedra','DATOS DE EJEMPLO. Revisión y limpieza básica de equipos. Precio referencial.','Puente Piedra','Barrio de ejemplo 4','383fb427-d94b-44aa-8def-00f7d7df01b4','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND client_request_id='383fb427-d94b-44aa-8def-00f7d7df01b4');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND client_request_id='383fb427-d94b-44aa-8def-00f7d7df01b4');

INSERT INTO detalles_emprendimiento (post_id,price,accepts_barter) SELECT @ayni_demo_publicacion,45,1 WHERE NOT EXISTS (SELECT 1 FROM detalles_emprendimiento WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) SELECT @ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9','98418a45-699d-46f0-884f-bfc9bb5aa2cc','Reseña ficticia: buena atención y coordinación.' WHERE NOT EXISTS(SELECT 1 FROM resenas WHERE post_id=@ayni_demo_publicacion AND author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '7c7f75e7-974d-46fb-8dee-79e8b813bfd9','emprendimiento','producto','[Demo] Macetas y plantas · Puente Piedra','DATOS DE EJEMPLO. Macetas decorativas con plantas pequeñas. Precio referencial por unidad.','Puente Piedra','Barrio de ejemplo 5','06918911-0ac9-4221-8c70-c5019605409d','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND client_request_id='06918911-0ac9-4221-8c70-c5019605409d');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND client_request_id='06918911-0ac9-4221-8c70-c5019605409d');

INSERT INTO detalles_emprendimiento (post_id,price,accepts_barter) SELECT @ayni_demo_publicacion,20,0 WHERE NOT EXISTS (SELECT 1 FROM detalles_emprendimiento WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) SELECT @ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b','7c7f75e7-974d-46fb-8dee-79e8b813bfd9','Reseña ficticia: buena atención y coordinación.' WHERE NOT EXISTS(SELECT 1 FROM resenas WHERE post_id=@ayni_demo_publicacion AND author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'c4107ea0-ea1b-42af-837b-7cf7b883a53b','aviso','Vecindad','[Demo] Bienvenida al mural vecinal · Puente Piedra','DATOS DE EJEMPLO. Este aviso es ficticio y sirve para conocer el mural de Inicio. Comparte tus ideas y participa con respeto.','Puente Piedra','Barrio de ejemplo 1','650acd0c-0829-43cb-8fd4-0d8ebbbd6563','active','Punto de encuentro de ejemplo, por coordinar',1 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND client_request_id='650acd0c-0829-43cb-8fd4-0d8ebbbd6563');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND client_request_id='650acd0c-0829-43cb-8fd4-0d8ebbbd6563');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='df7f5b30-80de-4294-8d72-3224346129e4' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'df7f5b30-80de-4294-8d72-3224346129e4','aviso','Vecindad','[Demo] Invitación a compartir libros · Puente Piedra','DATOS DE EJEMPLO. Este aviso es ficticio y sirve para conocer el mural de Inicio. Comparte tus ideas y participa con respeto.','Puente Piedra','Barrio de ejemplo 2','375fb20b-3a66-48d4-857c-5d81de2a2b73','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='df7f5b30-80de-4294-8d72-3224346129e4' AND client_request_id='375fb20b-3a66-48d4-857c-5d81de2a2b73');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='df7f5b30-80de-4294-8d72-3224346129e4' AND client_request_id='375fb20b-3a66-48d4-857c-5d81de2a2b73');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '757463e0-fc76-4ff9-8e9c-68eacbfdcf42','aviso','Vecindad','[Demo] Ideas para cuidar nuestro parque · Puente Piedra','DATOS DE EJEMPLO. Este aviso es ficticio y sirve para conocer el mural de Inicio. Comparte tus ideas y participa con respeto.','Puente Piedra','Barrio de ejemplo 3','1c36c00f-d892-47df-8492-ca641f3af60d','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND client_request_id='1c36c00f-d892-47df-8492-ca641f3af60d');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND client_request_id='1c36c00f-d892-47df-8492-ca641f3af60d');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '98418a45-699d-46f0-884f-bfc9bb5aa2cc','aviso','Vecindad','[Demo] Punto de encuentro entre vecinos · Puente Piedra','DATOS DE EJEMPLO. Este aviso es ficticio y sirve para conocer el mural de Inicio. Comparte tus ideas y participa con respeto.','Puente Piedra','Barrio de ejemplo 4','0c964039-9406-4c87-869a-2c9a2248f7e0','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND client_request_id='0c964039-9406-4c87-869a-2c9a2248f7e0');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND client_request_id='0c964039-9406-4c87-869a-2c9a2248f7e0');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '7c7f75e7-974d-46fb-8dee-79e8b813bfd9','aviso','Vecindad','[Demo] Propuestas para una feria del barrio · Puente Piedra','DATOS DE EJEMPLO. Este aviso es ficticio y sirve para conocer el mural de Inicio. Comparte tus ideas y participa con respeto.','Puente Piedra','Barrio de ejemplo 5','af9e75a6-9194-47c5-805b-488d4a8dce03','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND client_request_id='af9e75a6-9194-47c5-805b-488d4a8dce03');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND client_request_id='af9e75a6-9194-47c5-805b-488d4a8dce03');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO comunidades (creator_id,name,category,district,description,status)
SELECT 'c4107ea0-ea1b-42af-837b-7cf7b883a53b','[Demo] Lectura y cultura · Puente Piedra','Cultura y vecindad','Puente Piedra','Comunidad ficticia para probar publicaciones y participación vecinal.','approved'
WHERE NOT EXISTS (SELECT 1 FROM comunidades WHERE creator_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND name='[Demo] Lectura y cultura · Puente Piedra' AND district='Puente Piedra');

SET @ayni_demo_comunidad = (SELECT MIN(id) FROM comunidades WHERE creator_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND name='[Demo] Lectura y cultura · Puente Piedra' AND district='Puente Piedra');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned,community_id) SELECT 'c4107ea0-ea1b-42af-837b-7cf7b883a53b','aviso','Comunidad','[Demo] Bienvenidos a Lectura y cultura · Puente Piedra','DATOS DE EJEMPLO. Publicación ficticia del muro de esta comunidad. Puedes comentar, guardar o dar Me gusta.','Puente Piedra','Barrio de ejemplo 1','6574b845-2caa-4245-8a40-e7131d1aa7bd','active','Punto de encuentro de ejemplo, por coordinar',0,@ayni_demo_comunidad WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND client_request_id='6574b845-2caa-4245-8a40-e7131d1aa7bd');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND client_request_id='6574b845-2caa-4245-8a40-e7131d1aa7bd');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'df7f5b30-80de-4294-8d72-3224346129e4','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='df7f5b30-80de-4294-8d72-3224346129e4' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO comunidades (creator_id,name,category,district,description,status)
SELECT 'df7f5b30-80de-4294-8d72-3224346129e4','[Demo] Vecinos preparados · Puente Piedra','Seguridad y prevención','Puente Piedra','Comunidad ficticia para probar publicaciones y participación vecinal.','approved'
WHERE NOT EXISTS (SELECT 1 FROM comunidades WHERE creator_id='df7f5b30-80de-4294-8d72-3224346129e4' AND name='[Demo] Vecinos preparados · Puente Piedra' AND district='Puente Piedra');

SET @ayni_demo_comunidad = (SELECT MIN(id) FROM comunidades WHERE creator_id='df7f5b30-80de-4294-8d72-3224346129e4' AND name='[Demo] Vecinos preparados · Puente Piedra' AND district='Puente Piedra');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned,community_id) SELECT 'df7f5b30-80de-4294-8d72-3224346129e4','aviso','Comunidad','[Demo] Bienvenidos a Vecinos preparados · Puente Piedra','DATOS DE EJEMPLO. Publicación ficticia del muro de esta comunidad. Puedes comentar, guardar o dar Me gusta.','Puente Piedra','Barrio de ejemplo 2','fd6d2545-5c44-42ba-8df5-d6c9a31d96d3','active','Punto de encuentro de ejemplo, por coordinar',0,@ayni_demo_comunidad WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='df7f5b30-80de-4294-8d72-3224346129e4' AND client_request_id='fd6d2545-5c44-42ba-8df5-d6c9a31d96d3');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='df7f5b30-80de-4294-8d72-3224346129e4' AND client_request_id='fd6d2545-5c44-42ba-8df5-d6c9a31d96d3');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO comunidades (creator_id,name,category,district,description,status)
SELECT '757463e0-fc76-4ff9-8e9c-68eacbfdcf42','[Demo] Huertos y reciclaje · Puente Piedra','Medio ambiente','Puente Piedra','Comunidad ficticia para probar publicaciones y participación vecinal.','approved'
WHERE NOT EXISTS (SELECT 1 FROM comunidades WHERE creator_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND name='[Demo] Huertos y reciclaje · Puente Piedra' AND district='Puente Piedra');

SET @ayni_demo_comunidad = (SELECT MIN(id) FROM comunidades WHERE creator_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND name='[Demo] Huertos y reciclaje · Puente Piedra' AND district='Puente Piedra');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned,community_id) SELECT '757463e0-fc76-4ff9-8e9c-68eacbfdcf42','aviso','Comunidad','[Demo] Bienvenidos a Huertos y reciclaje · Puente Piedra','DATOS DE EJEMPLO. Publicación ficticia del muro de esta comunidad. Puedes comentar, guardar o dar Me gusta.','Puente Piedra','Barrio de ejemplo 3','064ac5fb-4470-42b2-8ddc-4f53f41a00cf','active','Punto de encuentro de ejemplo, por coordinar',0,@ayni_demo_comunidad WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND client_request_id='064ac5fb-4470-42b2-8ddc-4f53f41a00cf');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND client_request_id='064ac5fb-4470-42b2-8ddc-4f53f41a00cf');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'98418a45-699d-46f0-884f-bfc9bb5aa2cc','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO comunidades (creator_id,name,category,district,description,status)
SELECT '98418a45-699d-46f0-884f-bfc9bb5aa2cc','[Demo] Red de apoyo · Puente Piedra','Ayuda solidaria','Puente Piedra','Comunidad ficticia para probar publicaciones y participación vecinal.','approved'
WHERE NOT EXISTS (SELECT 1 FROM comunidades WHERE creator_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND name='[Demo] Red de apoyo · Puente Piedra' AND district='Puente Piedra');

SET @ayni_demo_comunidad = (SELECT MIN(id) FROM comunidades WHERE creator_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND name='[Demo] Red de apoyo · Puente Piedra' AND district='Puente Piedra');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned,community_id) SELECT '98418a45-699d-46f0-884f-bfc9bb5aa2cc','aviso','Comunidad','[Demo] Bienvenidos a Red de apoyo · Puente Piedra','DATOS DE EJEMPLO. Publicación ficticia del muro de esta comunidad. Puedes comentar, guardar o dar Me gusta.','Puente Piedra','Barrio de ejemplo 4','a3926a00-e234-4626-82c7-fad3e3ccee89','active','Punto de encuentro de ejemplo, por coordinar',0,@ayni_demo_comunidad WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND client_request_id='a3926a00-e234-4626-82c7-fad3e3ccee89');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND client_request_id='a3926a00-e234-4626-82c7-fad3e3ccee89');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO comunidades (creator_id,name,category,district,description,status)
SELECT '7c7f75e7-974d-46fb-8dee-79e8b813bfd9','[Demo] Oficios del barrio · Puente Piedra','Oficios y trabajo','Puente Piedra','Comunidad ficticia para probar publicaciones y participación vecinal.','approved'
WHERE NOT EXISTS (SELECT 1 FROM comunidades WHERE creator_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND name='[Demo] Oficios del barrio · Puente Piedra' AND district='Puente Piedra');

SET @ayni_demo_comunidad = (SELECT MIN(id) FROM comunidades WHERE creator_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND name='[Demo] Oficios del barrio · Puente Piedra' AND district='Puente Piedra');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned,community_id) SELECT '7c7f75e7-974d-46fb-8dee-79e8b813bfd9','aviso','Comunidad','[Demo] Bienvenidos a Oficios del barrio · Puente Piedra','DATOS DE EJEMPLO. Publicación ficticia del muro de esta comunidad. Puedes comentar, guardar o dar Me gusta.','Puente Piedra','Barrio de ejemplo 5','e1bbccdd-e557-4abc-8910-0610a2aa7647','active','Punto de encuentro de ejemplo, por coordinar',0,@ayni_demo_comunidad WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND client_request_id='e1bbccdd-e557-4abc-8910-0610a2aa7647');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND client_request_id='e1bbccdd-e557-4abc-8910-0610a2aa7647');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'c4107ea0-ea1b-42af-837b-7cf7b883a53b','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO eventos(organizer_id,district,title,description,category,location,starts_at,ends_at,contribution) SELECT 'c4107ea0-ea1b-42af-837b-7cf7b883a53b','Puente Piedra','[Demo] Taller de huerto en casa · Puente Piedra','Evento ficticio para demostrar Ayni. No representa una actividad real.','Ferias y Talleres','Lugar de ejemplo por coordinar, Puente Piedra',TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 7 DAY),'15:00:00'),TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 7 DAY),'17:00:00'),0 WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE organizer_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND title='[Demo] Taller de huerto en casa · Puente Piedra' AND district='Puente Piedra');

SET @ayni_demo_evento=(SELECT MIN(id) FROM eventos WHERE organizer_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND title='[Demo] Taller de huerto en casa · Puente Piedra' AND district='Puente Piedra');

INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(@ayni_demo_evento,'df7f5b30-80de-4294-8d72-3224346129e4');

INSERT INTO eventos(organizer_id,district,title,description,category,location,starts_at,ends_at,contribution) SELECT 'df7f5b30-80de-4294-8d72-3224346129e4','Puente Piedra','[Demo] Feria de postres por el barrio · Puente Piedra','Evento ficticio para demostrar Ayni. No representa una actividad real.','Actividades Profondos','Lugar de ejemplo por coordinar, Puente Piedra',TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 8 DAY),'15:00:00'),TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 8 DAY),'17:00:00'),0 WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE organizer_id='df7f5b30-80de-4294-8d72-3224346129e4' AND title='[Demo] Feria de postres por el barrio · Puente Piedra' AND district='Puente Piedra');

SET @ayni_demo_evento=(SELECT MIN(id) FROM eventos WHERE organizer_id='df7f5b30-80de-4294-8d72-3224346129e4' AND title='[Demo] Feria de postres por el barrio · Puente Piedra' AND district='Puente Piedra');

INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(@ayni_demo_evento,'757463e0-fc76-4ff9-8e9c-68eacbfdcf42');

INSERT INTO eventos(organizer_id,district,title,description,category,location,starts_at,ends_at,contribution) SELECT '757463e0-fc76-4ff9-8e9c-68eacbfdcf42','Puente Piedra','[Demo] Encuentro de bienestar vecinal · Puente Piedra','Evento ficticio para demostrar Ayni. No representa una actividad real.','Campañas Comunitarias y Salud','Lugar de ejemplo por coordinar, Puente Piedra',TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 9 DAY),'15:00:00'),TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 9 DAY),'17:00:00'),0 WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE organizer_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND title='[Demo] Encuentro de bienestar vecinal · Puente Piedra' AND district='Puente Piedra');

SET @ayni_demo_evento=(SELECT MIN(id) FROM eventos WHERE organizer_id='757463e0-fc76-4ff9-8e9c-68eacbfdcf42' AND title='[Demo] Encuentro de bienestar vecinal · Puente Piedra' AND district='Puente Piedra');

INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(@ayni_demo_evento,'98418a45-699d-46f0-884f-bfc9bb5aa2cc');

INSERT INTO eventos(organizer_id,district,title,description,category,location,starts_at,ends_at,contribution) SELECT '98418a45-699d-46f0-884f-bfc9bb5aa2cc','Puente Piedra','[Demo] Partido amistoso de vóley · Puente Piedra','Evento ficticio para demostrar Ayni. No representa una actividad real.','Deportes y Campeonatos','Lugar de ejemplo por coordinar, Puente Piedra',TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 10 DAY),'15:00:00'),TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 10 DAY),'17:00:00'),0 WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE organizer_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND title='[Demo] Partido amistoso de vóley · Puente Piedra' AND district='Puente Piedra');

SET @ayni_demo_evento=(SELECT MIN(id) FROM eventos WHERE organizer_id='98418a45-699d-46f0-884f-bfc9bb5aa2cc' AND title='[Demo] Partido amistoso de vóley · Puente Piedra' AND district='Puente Piedra');

INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(@ayni_demo_evento,'7c7f75e7-974d-46fb-8dee-79e8b813bfd9');

INSERT INTO eventos(organizer_id,district,title,description,category,location,starts_at,ends_at,contribution) SELECT '7c7f75e7-974d-46fb-8dee-79e8b813bfd9','Puente Piedra','[Demo] Práctica de encuentro vecinal · Puente Piedra','Evento ficticio para demostrar Ayni. No representa una actividad real.','Simulacros Vecinales','Lugar de ejemplo por coordinar, Puente Piedra',TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 11 DAY),'15:00:00'),TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 11 DAY),'17:00:00'),0 WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE organizer_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND title='[Demo] Práctica de encuentro vecinal · Puente Piedra' AND district='Puente Piedra');

SET @ayni_demo_evento=(SELECT MIN(id) FROM eventos WHERE organizer_id='7c7f75e7-974d-46fb-8dee-79e8b813bfd9' AND title='[Demo] Práctica de encuentro vecinal · Puente Piedra' AND district='Puente Piedra');

INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(@ayni_demo_evento,'c4107ea0-ea1b-42af-837b-7cf7b883a53b');

INSERT INTO conversaciones (id,participant_a,participant_b)
SELECT '46262dd6-e34a-4eed-8a8b-7dd0360086f1','c4107ea0-ea1b-42af-837b-7cf7b883a53b','df7f5b30-80de-4294-8d72-3224346129e4'
WHERE NOT EXISTS (SELECT 1 FROM conversaciones WHERE participant_a='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND participant_b='df7f5b30-80de-4294-8d72-3224346129e4');

SET @ayni_demo_chat=(SELECT id FROM conversaciones WHERE participant_a='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND participant_b='df7f5b30-80de-4294-8d72-3224346129e4');

INSERT INTO mensajes(conversation_id,sender_id,body) SELECT @ayni_demo_chat,'c4107ea0-ea1b-42af-837b-7cf7b883a53b','Hola, este es un chat de ejemplo.' WHERE NOT EXISTS (SELECT 1 FROM mensajes WHERE conversation_id=@ayni_demo_chat AND sender_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND body='Hola, este es un chat de ejemplo.');

INSERT INTO mensajes(conversation_id,sender_id,body) SELECT @ayni_demo_chat,'df7f5b30-80de-4294-8d72-3224346129e4','Gracias por participar en la comunidad de prueba.' WHERE NOT EXISTS (SELECT 1 FROM mensajes WHERE conversation_id=@ayni_demo_chat AND sender_id='df7f5b30-80de-4294-8d72-3224346129e4' AND body='Gracias por participar en la comunidad de prueba.');

INSERT INTO mensajes(conversation_id,sender_id,body) SELECT @ayni_demo_chat,'c4107ea0-ea1b-42af-837b-7cf7b883a53b','Podemos coordinar por aquí el intercambio ficticio.' WHERE NOT EXISTS (SELECT 1 FROM mensajes WHERE conversation_id=@ayni_demo_chat AND sender_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND body='Podemos coordinar por aquí el intercambio ficticio.');

INSERT INTO mensajes(conversation_id,sender_id,body) SELECT @ayni_demo_chat,'df7f5b30-80de-4294-8d72-3224346129e4','De acuerdo, revisemos el punto de encuentro.' WHERE NOT EXISTS (SELECT 1 FROM mensajes WHERE conversation_id=@ayni_demo_chat AND sender_id='df7f5b30-80de-4294-8d72-3224346129e4' AND body='De acuerdo, revisemos el punto de encuentro.');

INSERT INTO mensajes(conversation_id,sender_id,body) SELECT @ayni_demo_chat,'c4107ea0-ea1b-42af-837b-7cf7b883a53b','¡Perfecto! Estos mensajes son solo una demostración.' WHERE NOT EXISTS (SELECT 1 FROM mensajes WHERE conversation_id=@ayni_demo_chat AND sender_id='c4107ea0-ea1b-42af-837b-7cf7b883a53b' AND body='¡Perfecto! Estos mensajes son solo una demostración.');


-- ===== Los Olivos =====

INSERT INTO usuarios (id,name,email,password_hash,district,neighborhood,bio,avatar_url,phone,sms_opt_in,role)
SELECT 'cb9dd156-a4ae-48dc-8025-b13b54fc2811','Lucía Torres (Demo LO-1)','demo.ayni.lo.1@example.invalid','scrypt:cba89843b5a6fcc488420edf37ca5ccc:2a01ac7bc38bf80c5121672f39a39b8ecb40f0dcf9b5d6c416dd20da0ad17fa7a0f146d15b8a8f529ecdd148bda4b1d884132617af422c0f0315380b9c0baeb1','Los Olivos','Barrio de ejemplo 1','Perfil ficticio para probar Ayni. Sin datos de contacto reales.','/assets/avatar-default.svg',NULL,0,'neighbor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id='cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT INTO usuarios (id,name,email,password_hash,district,neighborhood,bio,avatar_url,phone,sms_opt_in,role)
SELECT '2acb48cc-1948-4b29-8bda-666bad6fd816','Mateo Rojas (Demo LO-2)','demo.ayni.lo.2@example.invalid','scrypt:8495050da9ee2e3586a5cae1a102de83:e316eae9462d1164e1df826682bc23a0be96c7ebafed45a9868d54b9440e7bc5d0f450d9f1bc51ab7eb55ae4ebab6c5653baae950ac7ced732ae29b18d87f9f6','Los Olivos','Barrio de ejemplo 2','Perfil ficticio para probar Ayni. Sin datos de contacto reales.','/assets/avatar-default.svg',NULL,0,'neighbor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id='2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT INTO usuarios (id,name,email,password_hash,district,neighborhood,bio,avatar_url,phone,sms_opt_in,role)
SELECT 'd77fa55c-1a38-4359-831f-76c65d7db8a7','Valeria Flores (Demo LO-3)','demo.ayni.lo.3@example.invalid','scrypt:e2af11a80a833cd39658865c61bfa831:9bce58f840d2b35971f5d1cbf6a91e26ce54f6c70f24ebebb8211999ac5feed8aa283e372e8a057b85f5a3a9f1380a1faaf34e2ee808788f6232adf6f4f7fa63','Los Olivos','Barrio de ejemplo 3','Perfil ficticio para probar Ayni. Sin datos de contacto reales.','/assets/avatar-default.svg',NULL,0,'neighbor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id='d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT INTO usuarios (id,name,email,password_hash,district,neighborhood,bio,avatar_url,phone,sms_opt_in,role)
SELECT '7da165cc-2e64-45fb-8561-d1c5d0cf1387','Diego Castillo (Demo LO-4)','demo.ayni.lo.4@example.invalid','scrypt:c42f0c62cb029e4c7eef51159873a914:f8acff4b00b48fc9132f05b5301d599f07b2639ece345c91c9fa8dd053ee4a11d699315a5007eeb9a4ec48aca283a6ba2124e69c707e26a38141b9e05eacf4df','Los Olivos','Barrio de ejemplo 4','Perfil ficticio para probar Ayni. Sin datos de contacto reales.','/assets/avatar-default.svg',NULL,0,'neighbor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id='7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT INTO usuarios (id,name,email,password_hash,district,neighborhood,bio,avatar_url,phone,sms_opt_in,role)
SELECT '700e7093-d6c0-4a16-814e-d1ae302f7e2c','Camila Vega (Demo LO-5)','demo.ayni.lo.5@example.invalid','scrypt:00781caa1f13307d79e5dad1fc6377be:88700a4424fba2b8e5a632c71c57cc8a3a8b4386c8a7aad445f930812d19ac37c5aa531ba4c3318c67d2afac487cbc0970e6d826ea3ba5962a57afaab32c2c90','Los Olivos','Barrio de ejemplo 5','Perfil ficticio para probar Ayni. Sin datos de contacto reales.','/assets/avatar-default.svg',NULL,0,'neighbor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id='700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'cb9dd156-a4ae-48dc-8025-b13b54fc2811','trueque','producto','[Demo] Libros por plantas · Los Olivos','DATOS DE EJEMPLO. Ofrezco: Cinco libros de lectura en buen estado. Busco: Una planta pequeña para mi sala. Coordinar por el chat de Ayni.','Los Olivos','Barrio de ejemplo 1','b11132c5-9321-4deb-8578-cbe6a425e953','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND client_request_id='b11132c5-9321-4deb-8578-cbe6a425e953');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND client_request_id='b11132c5-9321-4deb-8578-cbe6a425e953');

INSERT INTO detalles_trueque (post_id,offer,request,item_condition,quantity) SELECT @ayni_demo_publicacion,'Cinco libros de lectura en buen estado','Una planta pequeña para mi sala','Usado en buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_trueque WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '2acb48cc-1948-4b29-8bda-666bad6fd816','trueque','producto','[Demo] Bicicleta por herramientas · Los Olivos','DATOS DE EJEMPLO. Ofrezco: Bicicleta usada para paseos cortos. Busco: Herramientas de jardinería. Coordinar por el chat de Ayni.','Los Olivos','Barrio de ejemplo 2','af000df2-82bf-431c-8a37-4f7700737c20','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND client_request_id='af000df2-82bf-431c-8a37-4f7700737c20');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND client_request_id='af000df2-82bf-431c-8a37-4f7700737c20');

INSERT INTO detalles_trueque (post_id,offer,request,item_condition,quantity) SELECT @ayni_demo_publicacion,'Bicicleta usada para paseos cortos','Herramientas de jardinería','Usado en buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_trueque WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'd77fa55c-1a38-4359-831f-76c65d7db8a7','trueque','habilidad','[Demo] Clases de matemática por inglés · Los Olivos','DATOS DE EJEMPLO. Ofrezco: Una hora de apoyo en matemática. Busco: Una hora de conversación en inglés. Coordinar por el chat de Ayni.','Los Olivos','Barrio de ejemplo 3','5184663f-65b7-4309-8830-b448a98b93d1','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND client_request_id='5184663f-65b7-4309-8830-b448a98b93d1');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND client_request_id='5184663f-65b7-4309-8830-b448a98b93d1');

INSERT INTO detalles_trueque (post_id,offer,request,item_condition,quantity) SELECT @ayni_demo_publicacion,'Una hora de apoyo en matemática','Una hora de conversación en inglés','Usado en buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_trueque WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '7da165cc-2e64-45fb-8561-d1c5d0cf1387','trueque','servicio','[Demo] Reparación de ropa por cocina · Los Olivos','DATOS DE EJEMPLO. Ofrezco: Arreglo básico de dos prendas. Busco: Una clase de cocina casera. Coordinar por el chat de Ayni.','Los Olivos','Barrio de ejemplo 4','9c4864ff-288b-41ec-8199-2c6f2107d42e','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND client_request_id='9c4864ff-288b-41ec-8199-2c6f2107d42e');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND client_request_id='9c4864ff-288b-41ec-8199-2c6f2107d42e');

INSERT INTO detalles_trueque (post_id,offer,request,item_condition,quantity) SELECT @ayni_demo_publicacion,'Arreglo básico de dos prendas','Una clase de cocina casera','Usado en buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_trueque WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '700e7093-d6c0-4a16-814e-d1ae302f7e2c','trueque','producto','[Demo] Rompecabezas por juegos de mesa · Los Olivos','DATOS DE EJEMPLO. Ofrezco: Rompecabezas completo de 500 piezas. Busco: Un juego de mesa familiar. Coordinar por el chat de Ayni.','Los Olivos','Barrio de ejemplo 5','d7e8214a-8c46-40fe-8d62-748954a3d777','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND client_request_id='d7e8214a-8c46-40fe-8d62-748954a3d777');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND client_request_id='d7e8214a-8c46-40fe-8d62-748954a3d777');

INSERT INTO detalles_trueque (post_id,offer,request,item_condition,quantity) SELECT @ayni_demo_publicacion,'Rompecabezas completo de 500 piezas','Un juego de mesa familiar','Usado en buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_trueque WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'cb9dd156-a4ae-48dc-8025-b13b54fc2811','apoyo','donacion','[Demo] Donación de ropa de abrigo · Los Olivos','DATOS DE EJEMPLO. Ofrezco prendas limpias en buen estado para personas que las necesiten.','Los Olivos','Barrio de ejemplo 1','3eb05cd8-9fc5-4393-84e5-a657ea2e4ce9','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND client_request_id='3eb05cd8-9fc5-4393-84e5-a657ea2e4ce9');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND client_request_id='3eb05cd8-9fc5-4393-84e5-a657ea2e4ce9');

INSERT INTO detalles_apoyo (post_id,priority,item_condition,quantity) SELECT @ayni_demo_publicacion,'Regular','Buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_apoyo WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '2acb48cc-1948-4b29-8bda-666bad6fd816','apoyo','necesito','[Demo] Apoyo con útiles escolares · Los Olivos','DATOS DE EJEMPLO. Solicitamos cuadernos y colores para un taller vecinal de ejemplo.','Los Olivos','Barrio de ejemplo 2','24405fb2-efe7-43c8-8e00-213ec4910fcf','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND client_request_id='24405fb2-efe7-43c8-8e00-213ec4910fcf');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND client_request_id='24405fb2-efe7-43c8-8e00-213ec4910fcf');

INSERT INTO detalles_apoyo (post_id,priority,item_condition,quantity) SELECT @ayni_demo_publicacion,'Prioritario','Buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_apoyo WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'd77fa55c-1a38-4359-831f-76c65d7db8a7','apoyo','voluntariado','[Demo] Voluntarios para limpiar el parque · Los Olivos','DATOS DE EJEMPLO. Invitamos a vecinos a colaborar con una jornada de limpieza.','Los Olivos','Barrio de ejemplo 3','8fe21fe4-8102-4fb6-8a9f-de7bddc49547','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND client_request_id='8fe21fe4-8102-4fb6-8a9f-de7bddc49547');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND client_request_id='8fe21fe4-8102-4fb6-8a9f-de7bddc49547');

INSERT INTO detalles_apoyo (post_id,priority,item_condition,quantity) SELECT @ayni_demo_publicacion,'Regular','Buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_apoyo WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '7da165cc-2e64-45fb-8561-d1c5d0cf1387','apoyo','servicio','[Demo] Apoyo digital para adultos mayores · Los Olivos','DATOS DE EJEMPLO. Ayudamos gratuitamente a usar el celular y hacer videollamadas.','Los Olivos','Barrio de ejemplo 4','1c547345-f029-48a6-8543-d685159f140b','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND client_request_id='1c547345-f029-48a6-8543-d685159f140b');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND client_request_id='1c547345-f029-48a6-8543-d685159f140b');

INSERT INTO detalles_apoyo (post_id,priority,item_condition,quantity) SELECT @ayni_demo_publicacion,'Regular','Buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_apoyo WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '700e7093-d6c0-4a16-814e-d1ae302f7e2c','apoyo','donacion','[Demo] Donación de libros infantiles · Los Olivos','DATOS DE EJEMPLO. Compartimos cuentos para fomentar la lectura entre familias.','Los Olivos','Barrio de ejemplo 5','9245db9e-2680-4ab9-8241-1cd7ad5a40f9','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND client_request_id='9245db9e-2680-4ab9-8241-1cd7ad5a40f9');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND client_request_id='9245db9e-2680-4ab9-8241-1cd7ad5a40f9');

INSERT INTO detalles_apoyo (post_id,priority,item_condition,quantity) SELECT @ayni_demo_publicacion,'Regular','Buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_apoyo WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'cb9dd156-a4ae-48dc-8025-b13b54fc2811','emprendimiento','producto','[Demo] Panadería artesanal · Los Olivos','DATOS DE EJEMPLO. Panes caseros preparados por encargo. Precio referencial por paquete.','Los Olivos','Barrio de ejemplo 1','1d0e7d14-a034-4bcb-8868-1ce3334a8b7d','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND client_request_id='1d0e7d14-a034-4bcb-8868-1ce3334a8b7d');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND client_request_id='1d0e7d14-a034-4bcb-8868-1ce3334a8b7d');

INSERT INTO detalles_emprendimiento (post_id,price,accepts_barter) SELECT @ayni_demo_publicacion,12,0 WHERE NOT EXISTS (SELECT 1 FROM detalles_emprendimiento WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) SELECT @ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816','cb9dd156-a4ae-48dc-8025-b13b54fc2811','Reseña ficticia: buena atención y coordinación.' WHERE NOT EXISTS(SELECT 1 FROM resenas WHERE post_id=@ayni_demo_publicacion AND author_id='2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '2acb48cc-1948-4b29-8bda-666bad6fd816','emprendimiento','servicio','[Demo] Servicio de costura · Los Olivos','DATOS DE EJEMPLO. Arreglos de prendas y bastas. Precio referencial por servicio.','Los Olivos','Barrio de ejemplo 2','bfce4119-1c6d-4ad3-82a6-a2826e62d565','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND client_request_id='bfce4119-1c6d-4ad3-82a6-a2826e62d565');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND client_request_id='bfce4119-1c6d-4ad3-82a6-a2826e62d565');

INSERT INTO detalles_emprendimiento (post_id,price,accepts_barter) SELECT @ayni_demo_publicacion,15,1 WHERE NOT EXISTS (SELECT 1 FROM detalles_emprendimiento WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) SELECT @ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7','2acb48cc-1948-4b29-8bda-666bad6fd816','Reseña ficticia: buena atención y coordinación.' WHERE NOT EXISTS(SELECT 1 FROM resenas WHERE post_id=@ayni_demo_publicacion AND author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'd77fa55c-1a38-4359-831f-76c65d7db8a7','emprendimiento','producto','[Demo] Postres por encargo · Los Olivos','DATOS DE EJEMPLO. Queques y postres familiares. Precio referencial por porción.','Los Olivos','Barrio de ejemplo 3','fe020db6-87f6-4ec6-8216-2b4bd95a1c2b','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND client_request_id='fe020db6-87f6-4ec6-8216-2b4bd95a1c2b');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND client_request_id='fe020db6-87f6-4ec6-8216-2b4bd95a1c2b');

INSERT INTO detalles_emprendimiento (post_id,price,accepts_barter) SELECT @ayni_demo_publicacion,8.5,0 WHERE NOT EXISTS (SELECT 1 FROM detalles_emprendimiento WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) SELECT @ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387','d77fa55c-1a38-4359-831f-76c65d7db8a7','Reseña ficticia: buena atención y coordinación.' WHERE NOT EXISTS(SELECT 1 FROM resenas WHERE post_id=@ayni_demo_publicacion AND author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '7da165cc-2e64-45fb-8561-d1c5d0cf1387','emprendimiento','servicio','[Demo] Mantenimiento de computadoras · Los Olivos','DATOS DE EJEMPLO. Revisión y limpieza básica de equipos. Precio referencial.','Los Olivos','Barrio de ejemplo 4','48144eeb-016b-472b-8945-fc4f5978522e','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND client_request_id='48144eeb-016b-472b-8945-fc4f5978522e');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND client_request_id='48144eeb-016b-472b-8945-fc4f5978522e');

INSERT INTO detalles_emprendimiento (post_id,price,accepts_barter) SELECT @ayni_demo_publicacion,45,1 WHERE NOT EXISTS (SELECT 1 FROM detalles_emprendimiento WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) SELECT @ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c','7da165cc-2e64-45fb-8561-d1c5d0cf1387','Reseña ficticia: buena atención y coordinación.' WHERE NOT EXISTS(SELECT 1 FROM resenas WHERE post_id=@ayni_demo_publicacion AND author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '700e7093-d6c0-4a16-814e-d1ae302f7e2c','emprendimiento','producto','[Demo] Macetas y plantas · Los Olivos','DATOS DE EJEMPLO. Macetas decorativas con plantas pequeñas. Precio referencial por unidad.','Los Olivos','Barrio de ejemplo 5','23fe0b7f-6d81-42c5-88e3-6adb46a9050e','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND client_request_id='23fe0b7f-6d81-42c5-88e3-6adb46a9050e');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND client_request_id='23fe0b7f-6d81-42c5-88e3-6adb46a9050e');

INSERT INTO detalles_emprendimiento (post_id,price,accepts_barter) SELECT @ayni_demo_publicacion,20,0 WHERE NOT EXISTS (SELECT 1 FROM detalles_emprendimiento WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) SELECT @ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811','700e7093-d6c0-4a16-814e-d1ae302f7e2c','Reseña ficticia: buena atención y coordinación.' WHERE NOT EXISTS(SELECT 1 FROM resenas WHERE post_id=@ayni_demo_publicacion AND author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'cb9dd156-a4ae-48dc-8025-b13b54fc2811','aviso','Vecindad','[Demo] Bienvenida al mural vecinal · Los Olivos','DATOS DE EJEMPLO. Este aviso es ficticio y sirve para conocer el mural de Inicio. Comparte tus ideas y participa con respeto.','Los Olivos','Barrio de ejemplo 1','475f949c-8f20-412d-8cd2-f700b04759c4','active','Punto de encuentro de ejemplo, por coordinar',1 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND client_request_id='475f949c-8f20-412d-8cd2-f700b04759c4');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND client_request_id='475f949c-8f20-412d-8cd2-f700b04759c4');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '2acb48cc-1948-4b29-8bda-666bad6fd816','aviso','Vecindad','[Demo] Invitación a compartir libros · Los Olivos','DATOS DE EJEMPLO. Este aviso es ficticio y sirve para conocer el mural de Inicio. Comparte tus ideas y participa con respeto.','Los Olivos','Barrio de ejemplo 2','3bcaf659-c686-4191-8be4-00a165283342','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND client_request_id='3bcaf659-c686-4191-8be4-00a165283342');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND client_request_id='3bcaf659-c686-4191-8be4-00a165283342');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'd77fa55c-1a38-4359-831f-76c65d7db8a7','aviso','Vecindad','[Demo] Ideas para cuidar nuestro parque · Los Olivos','DATOS DE EJEMPLO. Este aviso es ficticio y sirve para conocer el mural de Inicio. Comparte tus ideas y participa con respeto.','Los Olivos','Barrio de ejemplo 3','cbd51c51-04ab-4cbe-820f-7fda7dfae530','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND client_request_id='cbd51c51-04ab-4cbe-820f-7fda7dfae530');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND client_request_id='cbd51c51-04ab-4cbe-820f-7fda7dfae530');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '7da165cc-2e64-45fb-8561-d1c5d0cf1387','aviso','Vecindad','[Demo] Punto de encuentro entre vecinos · Los Olivos','DATOS DE EJEMPLO. Este aviso es ficticio y sirve para conocer el mural de Inicio. Comparte tus ideas y participa con respeto.','Los Olivos','Barrio de ejemplo 4','98ab96ba-fd39-460e-8d06-ee671532d340','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND client_request_id='98ab96ba-fd39-460e-8d06-ee671532d340');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND client_request_id='98ab96ba-fd39-460e-8d06-ee671532d340');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '700e7093-d6c0-4a16-814e-d1ae302f7e2c','aviso','Vecindad','[Demo] Propuestas para una feria del barrio · Los Olivos','DATOS DE EJEMPLO. Este aviso es ficticio y sirve para conocer el mural de Inicio. Comparte tus ideas y participa con respeto.','Los Olivos','Barrio de ejemplo 5','849aedd6-e936-4cf9-8ecf-0d69bebdbd10','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND client_request_id='849aedd6-e936-4cf9-8ecf-0d69bebdbd10');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND client_request_id='849aedd6-e936-4cf9-8ecf-0d69bebdbd10');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO comunidades (creator_id,name,category,district,description,status)
SELECT 'cb9dd156-a4ae-48dc-8025-b13b54fc2811','[Demo] Lectura y cultura · Los Olivos','Cultura y vecindad','Los Olivos','Comunidad ficticia para probar publicaciones y participación vecinal.','approved'
WHERE NOT EXISTS (SELECT 1 FROM comunidades WHERE creator_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND name='[Demo] Lectura y cultura · Los Olivos' AND district='Los Olivos');

SET @ayni_demo_comunidad = (SELECT MIN(id) FROM comunidades WHERE creator_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND name='[Demo] Lectura y cultura · Los Olivos' AND district='Los Olivos');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned,community_id) SELECT 'cb9dd156-a4ae-48dc-8025-b13b54fc2811','aviso','Comunidad','[Demo] Bienvenidos a Lectura y cultura · Los Olivos','DATOS DE EJEMPLO. Publicación ficticia del muro de esta comunidad. Puedes comentar, guardar o dar Me gusta.','Los Olivos','Barrio de ejemplo 1','2642c139-0c1e-4f3f-8156-345316b31eab','active','Punto de encuentro de ejemplo, por coordinar',0,@ayni_demo_comunidad WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND client_request_id='2642c139-0c1e-4f3f-8156-345316b31eab');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND client_request_id='2642c139-0c1e-4f3f-8156-345316b31eab');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'2acb48cc-1948-4b29-8bda-666bad6fd816','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO comunidades (creator_id,name,category,district,description,status)
SELECT '2acb48cc-1948-4b29-8bda-666bad6fd816','[Demo] Vecinos preparados · Los Olivos','Seguridad y prevención','Los Olivos','Comunidad ficticia para probar publicaciones y participación vecinal.','approved'
WHERE NOT EXISTS (SELECT 1 FROM comunidades WHERE creator_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND name='[Demo] Vecinos preparados · Los Olivos' AND district='Los Olivos');

SET @ayni_demo_comunidad = (SELECT MIN(id) FROM comunidades WHERE creator_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND name='[Demo] Vecinos preparados · Los Olivos' AND district='Los Olivos');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned,community_id) SELECT '2acb48cc-1948-4b29-8bda-666bad6fd816','aviso','Comunidad','[Demo] Bienvenidos a Vecinos preparados · Los Olivos','DATOS DE EJEMPLO. Publicación ficticia del muro de esta comunidad. Puedes comentar, guardar o dar Me gusta.','Los Olivos','Barrio de ejemplo 2','2c82fe36-0191-4769-8aab-4ba873b56999','active','Punto de encuentro de ejemplo, por coordinar',0,@ayni_demo_comunidad WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND client_request_id='2c82fe36-0191-4769-8aab-4ba873b56999');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND client_request_id='2c82fe36-0191-4769-8aab-4ba873b56999');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'d77fa55c-1a38-4359-831f-76c65d7db8a7','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO comunidades (creator_id,name,category,district,description,status)
SELECT 'd77fa55c-1a38-4359-831f-76c65d7db8a7','[Demo] Huertos y reciclaje · Los Olivos','Medio ambiente','Los Olivos','Comunidad ficticia para probar publicaciones y participación vecinal.','approved'
WHERE NOT EXISTS (SELECT 1 FROM comunidades WHERE creator_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND name='[Demo] Huertos y reciclaje · Los Olivos' AND district='Los Olivos');

SET @ayni_demo_comunidad = (SELECT MIN(id) FROM comunidades WHERE creator_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND name='[Demo] Huertos y reciclaje · Los Olivos' AND district='Los Olivos');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned,community_id) SELECT 'd77fa55c-1a38-4359-831f-76c65d7db8a7','aviso','Comunidad','[Demo] Bienvenidos a Huertos y reciclaje · Los Olivos','DATOS DE EJEMPLO. Publicación ficticia del muro de esta comunidad. Puedes comentar, guardar o dar Me gusta.','Los Olivos','Barrio de ejemplo 3','8b0e5b0d-b820-4688-8656-6b871557f25c','active','Punto de encuentro de ejemplo, por coordinar',0,@ayni_demo_comunidad WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND client_request_id='8b0e5b0d-b820-4688-8656-6b871557f25c');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND client_request_id='8b0e5b0d-b820-4688-8656-6b871557f25c');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'7da165cc-2e64-45fb-8561-d1c5d0cf1387','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO comunidades (creator_id,name,category,district,description,status)
SELECT '7da165cc-2e64-45fb-8561-d1c5d0cf1387','[Demo] Red de apoyo · Los Olivos','Ayuda solidaria','Los Olivos','Comunidad ficticia para probar publicaciones y participación vecinal.','approved'
WHERE NOT EXISTS (SELECT 1 FROM comunidades WHERE creator_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND name='[Demo] Red de apoyo · Los Olivos' AND district='Los Olivos');

SET @ayni_demo_comunidad = (SELECT MIN(id) FROM comunidades WHERE creator_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND name='[Demo] Red de apoyo · Los Olivos' AND district='Los Olivos');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned,community_id) SELECT '7da165cc-2e64-45fb-8561-d1c5d0cf1387','aviso','Comunidad','[Demo] Bienvenidos a Red de apoyo · Los Olivos','DATOS DE EJEMPLO. Publicación ficticia del muro de esta comunidad. Puedes comentar, guardar o dar Me gusta.','Los Olivos','Barrio de ejemplo 4','c8848d7e-b3f2-41ce-8537-630dcc82bd40','active','Punto de encuentro de ejemplo, por coordinar',0,@ayni_demo_comunidad WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND client_request_id='c8848d7e-b3f2-41ce-8537-630dcc82bd40');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND client_request_id='c8848d7e-b3f2-41ce-8537-630dcc82bd40');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'700e7093-d6c0-4a16-814e-d1ae302f7e2c','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO comunidades (creator_id,name,category,district,description,status)
SELECT '700e7093-d6c0-4a16-814e-d1ae302f7e2c','[Demo] Oficios del barrio · Los Olivos','Oficios y trabajo','Los Olivos','Comunidad ficticia para probar publicaciones y participación vecinal.','approved'
WHERE NOT EXISTS (SELECT 1 FROM comunidades WHERE creator_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND name='[Demo] Oficios del barrio · Los Olivos' AND district='Los Olivos');

SET @ayni_demo_comunidad = (SELECT MIN(id) FROM comunidades WHERE creator_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND name='[Demo] Oficios del barrio · Los Olivos' AND district='Los Olivos');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned,community_id) SELECT '700e7093-d6c0-4a16-814e-d1ae302f7e2c','aviso','Comunidad','[Demo] Bienvenidos a Oficios del barrio · Los Olivos','DATOS DE EJEMPLO. Publicación ficticia del muro de esta comunidad. Puedes comentar, guardar o dar Me gusta.','Los Olivos','Barrio de ejemplo 5','9e6dedfa-bf7e-4c4a-8790-780905e60faa','active','Punto de encuentro de ejemplo, por coordinar',0,@ayni_demo_comunidad WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND client_request_id='9e6dedfa-bf7e-4c4a-8790-780905e60faa');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND client_request_id='9e6dedfa-bf7e-4c4a-8790-780905e60faa');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'cb9dd156-a4ae-48dc-8025-b13b54fc2811','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO eventos(organizer_id,district,title,description,category,location,starts_at,ends_at,contribution) SELECT 'cb9dd156-a4ae-48dc-8025-b13b54fc2811','Los Olivos','[Demo] Taller de huerto en casa · Los Olivos','Evento ficticio para demostrar Ayni. No representa una actividad real.','Ferias y Talleres','Lugar de ejemplo por coordinar, Los Olivos',TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 7 DAY),'15:00:00'),TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 7 DAY),'17:00:00'),0 WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE organizer_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND title='[Demo] Taller de huerto en casa · Los Olivos' AND district='Los Olivos');

SET @ayni_demo_evento=(SELECT MIN(id) FROM eventos WHERE organizer_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND title='[Demo] Taller de huerto en casa · Los Olivos' AND district='Los Olivos');

INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(@ayni_demo_evento,'2acb48cc-1948-4b29-8bda-666bad6fd816');

INSERT INTO eventos(organizer_id,district,title,description,category,location,starts_at,ends_at,contribution) SELECT '2acb48cc-1948-4b29-8bda-666bad6fd816','Los Olivos','[Demo] Feria de postres por el barrio · Los Olivos','Evento ficticio para demostrar Ayni. No representa una actividad real.','Actividades Profondos','Lugar de ejemplo por coordinar, Los Olivos',TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 8 DAY),'15:00:00'),TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 8 DAY),'17:00:00'),0 WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE organizer_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND title='[Demo] Feria de postres por el barrio · Los Olivos' AND district='Los Olivos');

SET @ayni_demo_evento=(SELECT MIN(id) FROM eventos WHERE organizer_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND title='[Demo] Feria de postres por el barrio · Los Olivos' AND district='Los Olivos');

INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(@ayni_demo_evento,'d77fa55c-1a38-4359-831f-76c65d7db8a7');

INSERT INTO eventos(organizer_id,district,title,description,category,location,starts_at,ends_at,contribution) SELECT 'd77fa55c-1a38-4359-831f-76c65d7db8a7','Los Olivos','[Demo] Encuentro de bienestar vecinal · Los Olivos','Evento ficticio para demostrar Ayni. No representa una actividad real.','Campañas Comunitarias y Salud','Lugar de ejemplo por coordinar, Los Olivos',TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 9 DAY),'15:00:00'),TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 9 DAY),'17:00:00'),0 WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE organizer_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND title='[Demo] Encuentro de bienestar vecinal · Los Olivos' AND district='Los Olivos');

SET @ayni_demo_evento=(SELECT MIN(id) FROM eventos WHERE organizer_id='d77fa55c-1a38-4359-831f-76c65d7db8a7' AND title='[Demo] Encuentro de bienestar vecinal · Los Olivos' AND district='Los Olivos');

INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(@ayni_demo_evento,'7da165cc-2e64-45fb-8561-d1c5d0cf1387');

INSERT INTO eventos(organizer_id,district,title,description,category,location,starts_at,ends_at,contribution) SELECT '7da165cc-2e64-45fb-8561-d1c5d0cf1387','Los Olivos','[Demo] Partido amistoso de vóley · Los Olivos','Evento ficticio para demostrar Ayni. No representa una actividad real.','Deportes y Campeonatos','Lugar de ejemplo por coordinar, Los Olivos',TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 10 DAY),'15:00:00'),TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 10 DAY),'17:00:00'),0 WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE organizer_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND title='[Demo] Partido amistoso de vóley · Los Olivos' AND district='Los Olivos');

SET @ayni_demo_evento=(SELECT MIN(id) FROM eventos WHERE organizer_id='7da165cc-2e64-45fb-8561-d1c5d0cf1387' AND title='[Demo] Partido amistoso de vóley · Los Olivos' AND district='Los Olivos');

INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(@ayni_demo_evento,'700e7093-d6c0-4a16-814e-d1ae302f7e2c');

INSERT INTO eventos(organizer_id,district,title,description,category,location,starts_at,ends_at,contribution) SELECT '700e7093-d6c0-4a16-814e-d1ae302f7e2c','Los Olivos','[Demo] Práctica de encuentro vecinal · Los Olivos','Evento ficticio para demostrar Ayni. No representa una actividad real.','Simulacros Vecinales','Lugar de ejemplo por coordinar, Los Olivos',TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 11 DAY),'15:00:00'),TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 11 DAY),'17:00:00'),0 WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE organizer_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND title='[Demo] Práctica de encuentro vecinal · Los Olivos' AND district='Los Olivos');

SET @ayni_demo_evento=(SELECT MIN(id) FROM eventos WHERE organizer_id='700e7093-d6c0-4a16-814e-d1ae302f7e2c' AND title='[Demo] Práctica de encuentro vecinal · Los Olivos' AND district='Los Olivos');

INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(@ayni_demo_evento,'cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT INTO conversaciones (id,participant_a,participant_b)
SELECT '737a0daa-92f7-4bdd-8334-c0687ae42e17','2acb48cc-1948-4b29-8bda-666bad6fd816','cb9dd156-a4ae-48dc-8025-b13b54fc2811'
WHERE NOT EXISTS (SELECT 1 FROM conversaciones WHERE participant_a='2acb48cc-1948-4b29-8bda-666bad6fd816' AND participant_b='cb9dd156-a4ae-48dc-8025-b13b54fc2811');

SET @ayni_demo_chat=(SELECT id FROM conversaciones WHERE participant_a='2acb48cc-1948-4b29-8bda-666bad6fd816' AND participant_b='cb9dd156-a4ae-48dc-8025-b13b54fc2811');

INSERT INTO mensajes(conversation_id,sender_id,body) SELECT @ayni_demo_chat,'cb9dd156-a4ae-48dc-8025-b13b54fc2811','Hola, este es un chat de ejemplo.' WHERE NOT EXISTS (SELECT 1 FROM mensajes WHERE conversation_id=@ayni_demo_chat AND sender_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND body='Hola, este es un chat de ejemplo.');

INSERT INTO mensajes(conversation_id,sender_id,body) SELECT @ayni_demo_chat,'2acb48cc-1948-4b29-8bda-666bad6fd816','Gracias por participar en la comunidad de prueba.' WHERE NOT EXISTS (SELECT 1 FROM mensajes WHERE conversation_id=@ayni_demo_chat AND sender_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND body='Gracias por participar en la comunidad de prueba.');

INSERT INTO mensajes(conversation_id,sender_id,body) SELECT @ayni_demo_chat,'cb9dd156-a4ae-48dc-8025-b13b54fc2811','Podemos coordinar por aquí el intercambio ficticio.' WHERE NOT EXISTS (SELECT 1 FROM mensajes WHERE conversation_id=@ayni_demo_chat AND sender_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND body='Podemos coordinar por aquí el intercambio ficticio.');

INSERT INTO mensajes(conversation_id,sender_id,body) SELECT @ayni_demo_chat,'2acb48cc-1948-4b29-8bda-666bad6fd816','De acuerdo, revisemos el punto de encuentro.' WHERE NOT EXISTS (SELECT 1 FROM mensajes WHERE conversation_id=@ayni_demo_chat AND sender_id='2acb48cc-1948-4b29-8bda-666bad6fd816' AND body='De acuerdo, revisemos el punto de encuentro.');

INSERT INTO mensajes(conversation_id,sender_id,body) SELECT @ayni_demo_chat,'cb9dd156-a4ae-48dc-8025-b13b54fc2811','¡Perfecto! Estos mensajes son solo una demostración.' WHERE NOT EXISTS (SELECT 1 FROM mensajes WHERE conversation_id=@ayni_demo_chat AND sender_id='cb9dd156-a4ae-48dc-8025-b13b54fc2811' AND body='¡Perfecto! Estos mensajes son solo una demostración.');


-- ===== San Martín de Porres =====

INSERT INTO usuarios (id,name,email,password_hash,district,neighborhood,bio,avatar_url,phone,sms_opt_in,role)
SELECT 'c8bbdac8-ba7e-4384-87c3-44b361887f7f','Lucía Torres (Demo SMP-1)','demo.ayni.smp.1@example.invalid','scrypt:429987110b693afdc0adde51d2ba142b:e83e223bfc6699ce40536ac190dcd2e5ed9bbe81e8f759dffe3883b188e1f277d86175ffae18dccdc3317078fd6bd370a1e77d60d60d7a1fb30c9329d00edd30','San Martín de Porres','Barrio de ejemplo 1','Perfil ficticio para probar Ayni. Sin datos de contacto reales.','/assets/avatar-default.svg',NULL,0,'neighbor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id='c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT INTO usuarios (id,name,email,password_hash,district,neighborhood,bio,avatar_url,phone,sms_opt_in,role)
SELECT '289f00dd-f782-46ce-86f8-37403e99bce7','Mateo Rojas (Demo SMP-2)','demo.ayni.smp.2@example.invalid','scrypt:102270f4fea3deb715965466ddaa308d:f12a22eb5ef8c7c044f0df8adcf9bf3ce71928484e4e2cd6fdd8ac33fe7b8430f02c879a96c682854273bd13d4d5315e0ce7845250d54bde1431e1041592872c','San Martín de Porres','Barrio de ejemplo 2','Perfil ficticio para probar Ayni. Sin datos de contacto reales.','/assets/avatar-default.svg',NULL,0,'neighbor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id='289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT INTO usuarios (id,name,email,password_hash,district,neighborhood,bio,avatar_url,phone,sms_opt_in,role)
SELECT '59660101-a098-4b6a-8c1a-1301c2aff998','Valeria Flores (Demo SMP-3)','demo.ayni.smp.3@example.invalid','scrypt:3e2b0a6ccd32ac04496e29ef8458a0e7:8bddd94e91446476c4e238de9630d5986f9d18feb6daeefbea5c154634e03242a8089fb23973bdfc89380989481ebf2d4d70d1519ff20363bf4e589f9da85bf8','San Martín de Porres','Barrio de ejemplo 3','Perfil ficticio para probar Ayni. Sin datos de contacto reales.','/assets/avatar-default.svg',NULL,0,'neighbor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id='59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT INTO usuarios (id,name,email,password_hash,district,neighborhood,bio,avatar_url,phone,sms_opt_in,role)
SELECT '8c25897e-05bf-48c8-87b9-1ab513aaa7ea','Diego Castillo (Demo SMP-4)','demo.ayni.smp.4@example.invalid','scrypt:a61ee33e0c50e7d9a41397de65550749:018d630a730e998949bc7ee6866fbbb9d7588be8a45df1dde9277637309084caac271caa90cd58ba322c7f71368b10965cdd2eb819f5a6be3d6e12eb39f9bfe6','San Martín de Porres','Barrio de ejemplo 4','Perfil ficticio para probar Ayni. Sin datos de contacto reales.','/assets/avatar-default.svg',NULL,0,'neighbor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT INTO usuarios (id,name,email,password_hash,district,neighborhood,bio,avatar_url,phone,sms_opt_in,role)
SELECT 'f799b475-1816-462a-8595-580f75a409e9','Camila Vega (Demo SMP-5)','demo.ayni.smp.5@example.invalid','scrypt:cd9207b8a90b936f1f289ec0ea593da1:9b4ccc7867d75e2ab88653359876eada3482f8db1af43bd336da49064cfd48f30604b52afd39444112b92bef16a5488e504fae262d50b230c5e5db5d1d2340bb','San Martín de Porres','Barrio de ejemplo 5','Perfil ficticio para probar Ayni. Sin datos de contacto reales.','/assets/avatar-default.svg',NULL,0,'neighbor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id='f799b475-1816-462a-8595-580f75a409e9');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'c8bbdac8-ba7e-4384-87c3-44b361887f7f','trueque','producto','[Demo] Libros por plantas · San Martín de Porres','DATOS DE EJEMPLO. Ofrezco: Cinco libros de lectura en buen estado. Busco: Una planta pequeña para mi sala. Coordinar por el chat de Ayni.','San Martín de Porres','Barrio de ejemplo 1','02f5db5c-c4fb-4df7-8d8d-56924d2ed7d1','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND client_request_id='02f5db5c-c4fb-4df7-8d8d-56924d2ed7d1');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND client_request_id='02f5db5c-c4fb-4df7-8d8d-56924d2ed7d1');

INSERT INTO detalles_trueque (post_id,offer,request,item_condition,quantity) SELECT @ayni_demo_publicacion,'Cinco libros de lectura en buen estado','Una planta pequeña para mi sala','Usado en buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_trueque WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '289f00dd-f782-46ce-86f8-37403e99bce7','trueque','producto','[Demo] Bicicleta por herramientas · San Martín de Porres','DATOS DE EJEMPLO. Ofrezco: Bicicleta usada para paseos cortos. Busco: Herramientas de jardinería. Coordinar por el chat de Ayni.','San Martín de Porres','Barrio de ejemplo 2','5c044fe7-f399-4a3e-8f8d-88a3aee09285','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND client_request_id='5c044fe7-f399-4a3e-8f8d-88a3aee09285');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND client_request_id='5c044fe7-f399-4a3e-8f8d-88a3aee09285');

INSERT INTO detalles_trueque (post_id,offer,request,item_condition,quantity) SELECT @ayni_demo_publicacion,'Bicicleta usada para paseos cortos','Herramientas de jardinería','Usado en buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_trueque WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '59660101-a098-4b6a-8c1a-1301c2aff998','trueque','habilidad','[Demo] Clases de matemática por inglés · San Martín de Porres','DATOS DE EJEMPLO. Ofrezco: Una hora de apoyo en matemática. Busco: Una hora de conversación en inglés. Coordinar por el chat de Ayni.','San Martín de Porres','Barrio de ejemplo 3','04e68f1b-43e1-4154-8978-fdf6d6fca185','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND client_request_id='04e68f1b-43e1-4154-8978-fdf6d6fca185');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND client_request_id='04e68f1b-43e1-4154-8978-fdf6d6fca185');

INSERT INTO detalles_trueque (post_id,offer,request,item_condition,quantity) SELECT @ayni_demo_publicacion,'Una hora de apoyo en matemática','Una hora de conversación en inglés','Usado en buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_trueque WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '8c25897e-05bf-48c8-87b9-1ab513aaa7ea','trueque','servicio','[Demo] Reparación de ropa por cocina · San Martín de Porres','DATOS DE EJEMPLO. Ofrezco: Arreglo básico de dos prendas. Busco: Una clase de cocina casera. Coordinar por el chat de Ayni.','San Martín de Porres','Barrio de ejemplo 4','ec0cd5db-49a0-4cc9-83b9-478f66892283','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND client_request_id='ec0cd5db-49a0-4cc9-83b9-478f66892283');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND client_request_id='ec0cd5db-49a0-4cc9-83b9-478f66892283');

INSERT INTO detalles_trueque (post_id,offer,request,item_condition,quantity) SELECT @ayni_demo_publicacion,'Arreglo básico de dos prendas','Una clase de cocina casera','Usado en buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_trueque WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='f799b475-1816-462a-8595-580f75a409e9' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'f799b475-1816-462a-8595-580f75a409e9','trueque','producto','[Demo] Rompecabezas por juegos de mesa · San Martín de Porres','DATOS DE EJEMPLO. Ofrezco: Rompecabezas completo de 500 piezas. Busco: Un juego de mesa familiar. Coordinar por el chat de Ayni.','San Martín de Porres','Barrio de ejemplo 5','eeffeea5-fa87-499e-812c-a520e71401d2','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='f799b475-1816-462a-8595-580f75a409e9' AND client_request_id='eeffeea5-fa87-499e-812c-a520e71401d2');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='f799b475-1816-462a-8595-580f75a409e9' AND client_request_id='eeffeea5-fa87-499e-812c-a520e71401d2');

INSERT INTO detalles_trueque (post_id,offer,request,item_condition,quantity) SELECT @ayni_demo_publicacion,'Rompecabezas completo de 500 piezas','Un juego de mesa familiar','Usado en buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_trueque WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'c8bbdac8-ba7e-4384-87c3-44b361887f7f','apoyo','donacion','[Demo] Donación de ropa de abrigo · San Martín de Porres','DATOS DE EJEMPLO. Ofrezco prendas limpias en buen estado para personas que las necesiten.','San Martín de Porres','Barrio de ejemplo 1','8ab2d5d6-28f4-4530-802c-823a09fd5233','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND client_request_id='8ab2d5d6-28f4-4530-802c-823a09fd5233');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND client_request_id='8ab2d5d6-28f4-4530-802c-823a09fd5233');

INSERT INTO detalles_apoyo (post_id,priority,item_condition,quantity) SELECT @ayni_demo_publicacion,'Regular','Buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_apoyo WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '289f00dd-f782-46ce-86f8-37403e99bce7','apoyo','necesito','[Demo] Apoyo con útiles escolares · San Martín de Porres','DATOS DE EJEMPLO. Solicitamos cuadernos y colores para un taller vecinal de ejemplo.','San Martín de Porres','Barrio de ejemplo 2','d78690b8-b851-4fde-859a-e1cf663be20d','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND client_request_id='d78690b8-b851-4fde-859a-e1cf663be20d');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND client_request_id='d78690b8-b851-4fde-859a-e1cf663be20d');

INSERT INTO detalles_apoyo (post_id,priority,item_condition,quantity) SELECT @ayni_demo_publicacion,'Prioritario','Buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_apoyo WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '59660101-a098-4b6a-8c1a-1301c2aff998','apoyo','voluntariado','[Demo] Voluntarios para limpiar el parque · San Martín de Porres','DATOS DE EJEMPLO. Invitamos a vecinos a colaborar con una jornada de limpieza.','San Martín de Porres','Barrio de ejemplo 3','af7c66e5-09ed-42a8-8756-25056c483093','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND client_request_id='af7c66e5-09ed-42a8-8756-25056c483093');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND client_request_id='af7c66e5-09ed-42a8-8756-25056c483093');

INSERT INTO detalles_apoyo (post_id,priority,item_condition,quantity) SELECT @ayni_demo_publicacion,'Regular','Buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_apoyo WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '8c25897e-05bf-48c8-87b9-1ab513aaa7ea','apoyo','servicio','[Demo] Apoyo digital para adultos mayores · San Martín de Porres','DATOS DE EJEMPLO. Ayudamos gratuitamente a usar el celular y hacer videollamadas.','San Martín de Porres','Barrio de ejemplo 4','60f13241-3505-436f-83eb-21507e96a106','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND client_request_id='60f13241-3505-436f-83eb-21507e96a106');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND client_request_id='60f13241-3505-436f-83eb-21507e96a106');

INSERT INTO detalles_apoyo (post_id,priority,item_condition,quantity) SELECT @ayni_demo_publicacion,'Regular','Buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_apoyo WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='f799b475-1816-462a-8595-580f75a409e9' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'f799b475-1816-462a-8595-580f75a409e9','apoyo','donacion','[Demo] Donación de libros infantiles · San Martín de Porres','DATOS DE EJEMPLO. Compartimos cuentos para fomentar la lectura entre familias.','San Martín de Porres','Barrio de ejemplo 5','91ea7195-d7b9-4435-8867-c80777b4f577','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='f799b475-1816-462a-8595-580f75a409e9' AND client_request_id='91ea7195-d7b9-4435-8867-c80777b4f577');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='f799b475-1816-462a-8595-580f75a409e9' AND client_request_id='91ea7195-d7b9-4435-8867-c80777b4f577');

INSERT INTO detalles_apoyo (post_id,priority,item_condition,quantity) SELECT @ayni_demo_publicacion,'Regular','Buen estado',1 WHERE NOT EXISTS (SELECT 1 FROM detalles_apoyo WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'c8bbdac8-ba7e-4384-87c3-44b361887f7f','emprendimiento','producto','[Demo] Panadería artesanal · San Martín de Porres','DATOS DE EJEMPLO. Panes caseros preparados por encargo. Precio referencial por paquete.','San Martín de Porres','Barrio de ejemplo 1','09edacf4-b6b8-4b1e-81cf-6fe1e5702b56','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND client_request_id='09edacf4-b6b8-4b1e-81cf-6fe1e5702b56');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND client_request_id='09edacf4-b6b8-4b1e-81cf-6fe1e5702b56');

INSERT INTO detalles_emprendimiento (post_id,price,accepts_barter) SELECT @ayni_demo_publicacion,12,0 WHERE NOT EXISTS (SELECT 1 FROM detalles_emprendimiento WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) SELECT @ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7','c8bbdac8-ba7e-4384-87c3-44b361887f7f','Reseña ficticia: buena atención y coordinación.' WHERE NOT EXISTS(SELECT 1 FROM resenas WHERE post_id=@ayni_demo_publicacion AND author_id='289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '289f00dd-f782-46ce-86f8-37403e99bce7','emprendimiento','servicio','[Demo] Servicio de costura · San Martín de Porres','DATOS DE EJEMPLO. Arreglos de prendas y bastas. Precio referencial por servicio.','San Martín de Porres','Barrio de ejemplo 2','b9cdfa65-4d9a-497d-8f5d-8ad0b74418a8','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND client_request_id='b9cdfa65-4d9a-497d-8f5d-8ad0b74418a8');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND client_request_id='b9cdfa65-4d9a-497d-8f5d-8ad0b74418a8');

INSERT INTO detalles_emprendimiento (post_id,price,accepts_barter) SELECT @ayni_demo_publicacion,15,1 WHERE NOT EXISTS (SELECT 1 FROM detalles_emprendimiento WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) SELECT @ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998','289f00dd-f782-46ce-86f8-37403e99bce7','Reseña ficticia: buena atención y coordinación.' WHERE NOT EXISTS(SELECT 1 FROM resenas WHERE post_id=@ayni_demo_publicacion AND author_id='59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '59660101-a098-4b6a-8c1a-1301c2aff998','emprendimiento','producto','[Demo] Postres por encargo · San Martín de Porres','DATOS DE EJEMPLO. Queques y postres familiares. Precio referencial por porción.','San Martín de Porres','Barrio de ejemplo 3','65be8b15-165e-4e3b-8415-c8a8f8b6ac3b','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND client_request_id='65be8b15-165e-4e3b-8415-c8a8f8b6ac3b');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND client_request_id='65be8b15-165e-4e3b-8415-c8a8f8b6ac3b');

INSERT INTO detalles_emprendimiento (post_id,price,accepts_barter) SELECT @ayni_demo_publicacion,8.5,0 WHERE NOT EXISTS (SELECT 1 FROM detalles_emprendimiento WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) SELECT @ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea','59660101-a098-4b6a-8c1a-1301c2aff998','Reseña ficticia: buena atención y coordinación.' WHERE NOT EXISTS(SELECT 1 FROM resenas WHERE post_id=@ayni_demo_publicacion AND author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '8c25897e-05bf-48c8-87b9-1ab513aaa7ea','emprendimiento','servicio','[Demo] Mantenimiento de computadoras · San Martín de Porres','DATOS DE EJEMPLO. Revisión y limpieza básica de equipos. Precio referencial.','San Martín de Porres','Barrio de ejemplo 4','2d50ff0b-f5f0-44e5-891b-dd4ef26c2de0','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND client_request_id='2d50ff0b-f5f0-44e5-891b-dd4ef26c2de0');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND client_request_id='2d50ff0b-f5f0-44e5-891b-dd4ef26c2de0');

INSERT INTO detalles_emprendimiento (post_id,price,accepts_barter) SELECT @ayni_demo_publicacion,45,1 WHERE NOT EXISTS (SELECT 1 FROM detalles_emprendimiento WHERE post_id=@ayni_demo_publicacion);

INSERT INTO disponibilidad (post_id,days,start_time,end_time,modality) SELECT @ayni_demo_publicacion,'Lunes, Miércoles, Sábado','09:00:00','12:00:00','Presencial' WHERE NOT EXISTS (SELECT 1 FROM disponibilidad WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='f799b475-1816-462a-8595-580f75a409e9' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) SELECT @ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9','8c25897e-05bf-48c8-87b9-1ab513aaa7ea','Reseña ficticia: buena atención y coordinación.' WHERE NOT EXISTS(SELECT 1 FROM resenas WHERE post_id=@ayni_demo_publicacion AND author_id='f799b475-1816-462a-8595-580f75a409e9');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'f799b475-1816-462a-8595-580f75a409e9','emprendimiento','producto','[Demo] Macetas y plantas · San Martín de Porres','DATOS DE EJEMPLO. Macetas decorativas con plantas pequeñas. Precio referencial por unidad.','San Martín de Porres','Barrio de ejemplo 5','b6619898-bce7-4e39-811f-392558dd26f1','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='f799b475-1816-462a-8595-580f75a409e9' AND client_request_id='b6619898-bce7-4e39-811f-392558dd26f1');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='f799b475-1816-462a-8595-580f75a409e9' AND client_request_id='b6619898-bce7-4e39-811f-392558dd26f1');

INSERT INTO detalles_emprendimiento (post_id,price,accepts_barter) SELECT @ayni_demo_publicacion,20,0 WHERE NOT EXISTS (SELECT 1 FROM detalles_emprendimiento WHERE post_id=@ayni_demo_publicacion);

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO resenas(post_id,author_id,reviewed_user_id,body) SELECT @ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f','f799b475-1816-462a-8595-580f75a409e9','Reseña ficticia: buena atención y coordinación.' WHERE NOT EXISTS(SELECT 1 FROM resenas WHERE post_id=@ayni_demo_publicacion AND author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'c8bbdac8-ba7e-4384-87c3-44b361887f7f','aviso','Vecindad','[Demo] Bienvenida al mural vecinal · San Martín de Porres','DATOS DE EJEMPLO. Este aviso es ficticio y sirve para conocer el mural de Inicio. Comparte tus ideas y participa con respeto.','San Martín de Porres','Barrio de ejemplo 1','99ef496a-ae85-4fdd-8a2f-cc3878c77d37','active','Punto de encuentro de ejemplo, por coordinar',1 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND client_request_id='99ef496a-ae85-4fdd-8a2f-cc3878c77d37');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND client_request_id='99ef496a-ae85-4fdd-8a2f-cc3878c77d37');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '289f00dd-f782-46ce-86f8-37403e99bce7','aviso','Vecindad','[Demo] Invitación a compartir libros · San Martín de Porres','DATOS DE EJEMPLO. Este aviso es ficticio y sirve para conocer el mural de Inicio. Comparte tus ideas y participa con respeto.','San Martín de Porres','Barrio de ejemplo 2','0f8756e4-9967-44e5-8337-05357edbb685','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND client_request_id='0f8756e4-9967-44e5-8337-05357edbb685');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND client_request_id='0f8756e4-9967-44e5-8337-05357edbb685');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '59660101-a098-4b6a-8c1a-1301c2aff998','aviso','Vecindad','[Demo] Ideas para cuidar nuestro parque · San Martín de Porres','DATOS DE EJEMPLO. Este aviso es ficticio y sirve para conocer el mural de Inicio. Comparte tus ideas y participa con respeto.','San Martín de Porres','Barrio de ejemplo 3','3bf40aad-3dab-4ac3-849d-2b7b4260b3d3','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND client_request_id='3bf40aad-3dab-4ac3-849d-2b7b4260b3d3');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND client_request_id='3bf40aad-3dab-4ac3-849d-2b7b4260b3d3');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT '8c25897e-05bf-48c8-87b9-1ab513aaa7ea','aviso','Vecindad','[Demo] Punto de encuentro entre vecinos · San Martín de Porres','DATOS DE EJEMPLO. Este aviso es ficticio y sirve para conocer el mural de Inicio. Comparte tus ideas y participa con respeto.','San Martín de Porres','Barrio de ejemplo 4','89b3c4d9-8a02-42a7-8705-26d5f0c69402','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND client_request_id='89b3c4d9-8a02-42a7-8705-26d5f0c69402');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND client_request_id='89b3c4d9-8a02-42a7-8705-26d5f0c69402');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='f799b475-1816-462a-8595-580f75a409e9' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned) SELECT 'f799b475-1816-462a-8595-580f75a409e9','aviso','Vecindad','[Demo] Propuestas para una feria del barrio · San Martín de Porres','DATOS DE EJEMPLO. Este aviso es ficticio y sirve para conocer el mural de Inicio. Comparte tus ideas y participa con respeto.','San Martín de Porres','Barrio de ejemplo 5','86a0ed3c-68e1-4125-859f-6702b29c33cd','active','Punto de encuentro de ejemplo, por coordinar',0 WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='f799b475-1816-462a-8595-580f75a409e9' AND client_request_id='86a0ed3c-68e1-4125-859f-6702b29c33cd');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='f799b475-1816-462a-8595-580f75a409e9' AND client_request_id='86a0ed3c-68e1-4125-859f-6702b29c33cd');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO comunidades (creator_id,name,category,district,description,status)
SELECT 'c8bbdac8-ba7e-4384-87c3-44b361887f7f','[Demo] Lectura y cultura · San Martín de Porres','Cultura y vecindad','San Martín de Porres','Comunidad ficticia para probar publicaciones y participación vecinal.','approved'
WHERE NOT EXISTS (SELECT 1 FROM comunidades WHERE creator_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND name='[Demo] Lectura y cultura · San Martín de Porres' AND district='San Martín de Porres');

SET @ayni_demo_comunidad = (SELECT MIN(id) FROM comunidades WHERE creator_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND name='[Demo] Lectura y cultura · San Martín de Porres' AND district='San Martín de Porres');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'f799b475-1816-462a-8595-580f75a409e9');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned,community_id) SELECT 'c8bbdac8-ba7e-4384-87c3-44b361887f7f','aviso','Comunidad','[Demo] Bienvenidos a Lectura y cultura · San Martín de Porres','DATOS DE EJEMPLO. Publicación ficticia del muro de esta comunidad. Puedes comentar, guardar o dar Me gusta.','San Martín de Porres','Barrio de ejemplo 1','db7b56f8-6e7e-4c2b-8674-4c0269d8f3bf','active','Punto de encuentro de ejemplo, por coordinar',0,@ayni_demo_comunidad WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND client_request_id='db7b56f8-6e7e-4c2b-8674-4c0269d8f3bf');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND client_request_id='db7b56f8-6e7e-4c2b-8674-4c0269d8f3bf');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'289f00dd-f782-46ce-86f8-37403e99bce7','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO comunidades (creator_id,name,category,district,description,status)
SELECT '289f00dd-f782-46ce-86f8-37403e99bce7','[Demo] Vecinos preparados · San Martín de Porres','Seguridad y prevención','San Martín de Porres','Comunidad ficticia para probar publicaciones y participación vecinal.','approved'
WHERE NOT EXISTS (SELECT 1 FROM comunidades WHERE creator_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND name='[Demo] Vecinos preparados · San Martín de Porres' AND district='San Martín de Porres');

SET @ayni_demo_comunidad = (SELECT MIN(id) FROM comunidades WHERE creator_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND name='[Demo] Vecinos preparados · San Martín de Porres' AND district='San Martín de Porres');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'f799b475-1816-462a-8595-580f75a409e9');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned,community_id) SELECT '289f00dd-f782-46ce-86f8-37403e99bce7','aviso','Comunidad','[Demo] Bienvenidos a Vecinos preparados · San Martín de Porres','DATOS DE EJEMPLO. Publicación ficticia del muro de esta comunidad. Puedes comentar, guardar o dar Me gusta.','San Martín de Porres','Barrio de ejemplo 2','ff2ea06d-6059-4fcb-826c-9876c7499907','active','Punto de encuentro de ejemplo, por coordinar',0,@ayni_demo_comunidad WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND client_request_id='ff2ea06d-6059-4fcb-826c-9876c7499907');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND client_request_id='ff2ea06d-6059-4fcb-826c-9876c7499907');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'59660101-a098-4b6a-8c1a-1301c2aff998','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO comunidades (creator_id,name,category,district,description,status)
SELECT '59660101-a098-4b6a-8c1a-1301c2aff998','[Demo] Huertos y reciclaje · San Martín de Porres','Medio ambiente','San Martín de Porres','Comunidad ficticia para probar publicaciones y participación vecinal.','approved'
WHERE NOT EXISTS (SELECT 1 FROM comunidades WHERE creator_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND name='[Demo] Huertos y reciclaje · San Martín de Porres' AND district='San Martín de Porres');

SET @ayni_demo_comunidad = (SELECT MIN(id) FROM comunidades WHERE creator_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND name='[Demo] Huertos y reciclaje · San Martín de Porres' AND district='San Martín de Porres');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'f799b475-1816-462a-8595-580f75a409e9');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned,community_id) SELECT '59660101-a098-4b6a-8c1a-1301c2aff998','aviso','Comunidad','[Demo] Bienvenidos a Huertos y reciclaje · San Martín de Porres','DATOS DE EJEMPLO. Publicación ficticia del muro de esta comunidad. Puedes comentar, guardar o dar Me gusta.','San Martín de Porres','Barrio de ejemplo 3','702bd779-2787-4a41-8384-83e35efc2580','active','Punto de encuentro de ejemplo, por coordinar',0,@ayni_demo_comunidad WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND client_request_id='702bd779-2787-4a41-8384-83e35efc2580');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND client_request_id='702bd779-2787-4a41-8384-83e35efc2580');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO comunidades (creator_id,name,category,district,description,status)
SELECT '8c25897e-05bf-48c8-87b9-1ab513aaa7ea','[Demo] Red de apoyo · San Martín de Porres','Ayuda solidaria','San Martín de Porres','Comunidad ficticia para probar publicaciones y participación vecinal.','approved'
WHERE NOT EXISTS (SELECT 1 FROM comunidades WHERE creator_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND name='[Demo] Red de apoyo · San Martín de Porres' AND district='San Martín de Porres');

SET @ayni_demo_comunidad = (SELECT MIN(id) FROM comunidades WHERE creator_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND name='[Demo] Red de apoyo · San Martín de Porres' AND district='San Martín de Porres');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'f799b475-1816-462a-8595-580f75a409e9');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned,community_id) SELECT '8c25897e-05bf-48c8-87b9-1ab513aaa7ea','aviso','Comunidad','[Demo] Bienvenidos a Red de apoyo · San Martín de Porres','DATOS DE EJEMPLO. Publicación ficticia del muro de esta comunidad. Puedes comentar, guardar o dar Me gusta.','San Martín de Porres','Barrio de ejemplo 4','aedb130f-5dcf-469f-8629-7b012e7c0963','active','Punto de encuentro de ejemplo, por coordinar',0,@ayni_demo_comunidad WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND client_request_id='aedb130f-5dcf-469f-8629-7b012e7c0963');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND client_request_id='aedb130f-5dcf-469f-8629-7b012e7c0963');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'f799b475-1816-462a-8595-580f75a409e9','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='f799b475-1816-462a-8595-580f75a409e9' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO comunidades (creator_id,name,category,district,description,status)
SELECT 'f799b475-1816-462a-8595-580f75a409e9','[Demo] Oficios del barrio · San Martín de Porres','Oficios y trabajo','San Martín de Porres','Comunidad ficticia para probar publicaciones y participación vecinal.','approved'
WHERE NOT EXISTS (SELECT 1 FROM comunidades WHERE creator_id='f799b475-1816-462a-8595-580f75a409e9' AND name='[Demo] Oficios del barrio · San Martín de Porres' AND district='San Martín de Porres');

SET @ayni_demo_comunidad = (SELECT MIN(id) FROM comunidades WHERE creator_id='f799b475-1816-462a-8595-580f75a409e9' AND name='[Demo] Oficios del barrio · San Martín de Porres' AND district='San Martín de Porres');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT IGNORE INTO miembros_comunidad(community_id,user_id) VALUES(@ayni_demo_comunidad,'f799b475-1816-462a-8595-580f75a409e9');

INSERT INTO publicaciones (author_id,module,category,title,description,district,neighborhood,client_request_id,status,address,pinned,community_id) SELECT 'f799b475-1816-462a-8595-580f75a409e9','aviso','Comunidad','[Demo] Bienvenidos a Oficios del barrio · San Martín de Porres','DATOS DE EJEMPLO. Publicación ficticia del muro de esta comunidad. Puedes comentar, guardar o dar Me gusta.','San Martín de Porres','Barrio de ejemplo 5','02ff2f1e-2638-4815-87bd-41f512320165','active','Punto de encuentro de ejemplo, por coordinar',0,@ayni_demo_comunidad WHERE NOT EXISTS (SELECT 1 FROM publicaciones WHERE author_id='f799b475-1816-462a-8595-580f75a409e9' AND client_request_id='02ff2f1e-2638-4815-87bd-41f512320165');

SET @ayni_demo_publicacion = (SELECT id FROM publicaciones WHERE author_id='f799b475-1816-462a-8595-580f75a409e9' AND client_request_id='02ff2f1e-2638-4815-87bd-41f512320165');

INSERT IGNORE INTO me_gusta_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT IGNORE INTO guardados_publicaciones(post_id,user_id) VALUES(@ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT INTO comentarios(post_id,author_id,body) SELECT @ayni_demo_publicacion,'c8bbdac8-ba7e-4384-87c3-44b361887f7f','Comentario de ejemplo: gracias por compartir con el barrio.' WHERE NOT EXISTS (SELECT 1 FROM comentarios WHERE post_id=@ayni_demo_publicacion AND author_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND body='Comentario de ejemplo: gracias por compartir con el barrio.');

INSERT INTO eventos(organizer_id,district,title,description,category,location,starts_at,ends_at,contribution) SELECT 'c8bbdac8-ba7e-4384-87c3-44b361887f7f','San Martín de Porres','[Demo] Taller de huerto en casa · San Martín de Porres','Evento ficticio para demostrar Ayni. No representa una actividad real.','Ferias y Talleres','Lugar de ejemplo por coordinar, San Martín de Porres',TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 7 DAY),'15:00:00'),TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 7 DAY),'17:00:00'),0 WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE organizer_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND title='[Demo] Taller de huerto en casa · San Martín de Porres' AND district='San Martín de Porres');

SET @ayni_demo_evento=(SELECT MIN(id) FROM eventos WHERE organizer_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND title='[Demo] Taller de huerto en casa · San Martín de Porres' AND district='San Martín de Porres');

INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(@ayni_demo_evento,'289f00dd-f782-46ce-86f8-37403e99bce7');

INSERT INTO eventos(organizer_id,district,title,description,category,location,starts_at,ends_at,contribution) SELECT '289f00dd-f782-46ce-86f8-37403e99bce7','San Martín de Porres','[Demo] Feria de postres por el barrio · San Martín de Porres','Evento ficticio para demostrar Ayni. No representa una actividad real.','Actividades Profondos','Lugar de ejemplo por coordinar, San Martín de Porres',TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 8 DAY),'15:00:00'),TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 8 DAY),'17:00:00'),0 WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE organizer_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND title='[Demo] Feria de postres por el barrio · San Martín de Porres' AND district='San Martín de Porres');

SET @ayni_demo_evento=(SELECT MIN(id) FROM eventos WHERE organizer_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND title='[Demo] Feria de postres por el barrio · San Martín de Porres' AND district='San Martín de Porres');

INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(@ayni_demo_evento,'59660101-a098-4b6a-8c1a-1301c2aff998');

INSERT INTO eventos(organizer_id,district,title,description,category,location,starts_at,ends_at,contribution) SELECT '59660101-a098-4b6a-8c1a-1301c2aff998','San Martín de Porres','[Demo] Encuentro de bienestar vecinal · San Martín de Porres','Evento ficticio para demostrar Ayni. No representa una actividad real.','Campañas Comunitarias y Salud','Lugar de ejemplo por coordinar, San Martín de Porres',TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 9 DAY),'15:00:00'),TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 9 DAY),'17:00:00'),0 WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE organizer_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND title='[Demo] Encuentro de bienestar vecinal · San Martín de Porres' AND district='San Martín de Porres');

SET @ayni_demo_evento=(SELECT MIN(id) FROM eventos WHERE organizer_id='59660101-a098-4b6a-8c1a-1301c2aff998' AND title='[Demo] Encuentro de bienestar vecinal · San Martín de Porres' AND district='San Martín de Porres');

INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(@ayni_demo_evento,'8c25897e-05bf-48c8-87b9-1ab513aaa7ea');

INSERT INTO eventos(organizer_id,district,title,description,category,location,starts_at,ends_at,contribution) SELECT '8c25897e-05bf-48c8-87b9-1ab513aaa7ea','San Martín de Porres','[Demo] Partido amistoso de vóley · San Martín de Porres','Evento ficticio para demostrar Ayni. No representa una actividad real.','Deportes y Campeonatos','Lugar de ejemplo por coordinar, San Martín de Porres',TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 10 DAY),'15:00:00'),TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 10 DAY),'17:00:00'),0 WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE organizer_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND title='[Demo] Partido amistoso de vóley · San Martín de Porres' AND district='San Martín de Porres');

SET @ayni_demo_evento=(SELECT MIN(id) FROM eventos WHERE organizer_id='8c25897e-05bf-48c8-87b9-1ab513aaa7ea' AND title='[Demo] Partido amistoso de vóley · San Martín de Porres' AND district='San Martín de Porres');

INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(@ayni_demo_evento,'f799b475-1816-462a-8595-580f75a409e9');

INSERT INTO eventos(organizer_id,district,title,description,category,location,starts_at,ends_at,contribution) SELECT 'f799b475-1816-462a-8595-580f75a409e9','San Martín de Porres','[Demo] Práctica de encuentro vecinal · San Martín de Porres','Evento ficticio para demostrar Ayni. No representa una actividad real.','Simulacros Vecinales','Lugar de ejemplo por coordinar, San Martín de Porres',TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 11 DAY),'15:00:00'),TIMESTAMP(DATE_ADD(UTC_DATE(),INTERVAL 11 DAY),'17:00:00'),0 WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE organizer_id='f799b475-1816-462a-8595-580f75a409e9' AND title='[Demo] Práctica de encuentro vecinal · San Martín de Porres' AND district='San Martín de Porres');

SET @ayni_demo_evento=(SELECT MIN(id) FROM eventos WHERE organizer_id='f799b475-1816-462a-8595-580f75a409e9' AND title='[Demo] Práctica de encuentro vecinal · San Martín de Porres' AND district='San Martín de Porres');

INSERT IGNORE INTO intereses_eventos(event_id,user_id) VALUES(@ayni_demo_evento,'c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT INTO conversaciones (id,participant_a,participant_b)
SELECT '5be8d984-4f57-4f6f-88c6-5ed0ad5ced0a','289f00dd-f782-46ce-86f8-37403e99bce7','c8bbdac8-ba7e-4384-87c3-44b361887f7f'
WHERE NOT EXISTS (SELECT 1 FROM conversaciones WHERE participant_a='289f00dd-f782-46ce-86f8-37403e99bce7' AND participant_b='c8bbdac8-ba7e-4384-87c3-44b361887f7f');

SET @ayni_demo_chat=(SELECT id FROM conversaciones WHERE participant_a='289f00dd-f782-46ce-86f8-37403e99bce7' AND participant_b='c8bbdac8-ba7e-4384-87c3-44b361887f7f');

INSERT INTO mensajes(conversation_id,sender_id,body) SELECT @ayni_demo_chat,'c8bbdac8-ba7e-4384-87c3-44b361887f7f','Hola, este es un chat de ejemplo.' WHERE NOT EXISTS (SELECT 1 FROM mensajes WHERE conversation_id=@ayni_demo_chat AND sender_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND body='Hola, este es un chat de ejemplo.');

INSERT INTO mensajes(conversation_id,sender_id,body) SELECT @ayni_demo_chat,'289f00dd-f782-46ce-86f8-37403e99bce7','Gracias por participar en la comunidad de prueba.' WHERE NOT EXISTS (SELECT 1 FROM mensajes WHERE conversation_id=@ayni_demo_chat AND sender_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND body='Gracias por participar en la comunidad de prueba.');

INSERT INTO mensajes(conversation_id,sender_id,body) SELECT @ayni_demo_chat,'c8bbdac8-ba7e-4384-87c3-44b361887f7f','Podemos coordinar por aquí el intercambio ficticio.' WHERE NOT EXISTS (SELECT 1 FROM mensajes WHERE conversation_id=@ayni_demo_chat AND sender_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND body='Podemos coordinar por aquí el intercambio ficticio.');

INSERT INTO mensajes(conversation_id,sender_id,body) SELECT @ayni_demo_chat,'289f00dd-f782-46ce-86f8-37403e99bce7','De acuerdo, revisemos el punto de encuentro.' WHERE NOT EXISTS (SELECT 1 FROM mensajes WHERE conversation_id=@ayni_demo_chat AND sender_id='289f00dd-f782-46ce-86f8-37403e99bce7' AND body='De acuerdo, revisemos el punto de encuentro.');

INSERT INTO mensajes(conversation_id,sender_id,body) SELECT @ayni_demo_chat,'c8bbdac8-ba7e-4384-87c3-44b361887f7f','¡Perfecto! Estos mensajes son solo una demostración.' WHERE NOT EXISTS (SELECT 1 FROM mensajes WHERE conversation_id=@ayni_demo_chat AND sender_id='c8bbdac8-ba7e-4384-87c3-44b361887f7f' AND body='¡Perfecto! Estos mensajes son solo una demostración.');

COMMIT;
SET time_zone = @ayni_demo_huso_anterior;

-- Resumen SOLO de registros de estas cuentas demo.
SELECT u.district, 'vecinos' AS seccion, COUNT(*) AS cantidad FROM usuarios u WHERE u.email LIKE 'demo.ayni.%@example.invalid' GROUP BY u.district
UNION ALL SELECT p.district,IF(p.community_id IS NOT NULL,'muros_comunidad',p.module),COUNT(*) FROM publicaciones p JOIN usuarios u ON u.id=p.author_id WHERE u.email LIKE 'demo.ayni.%@example.invalid' GROUP BY p.district,IF(p.community_id IS NOT NULL,'muros_comunidad',p.module)
UNION ALL SELECT e.district,'eventos',COUNT(*) FROM eventos e JOIN usuarios u ON u.id=e.organizer_id WHERE u.email LIKE 'demo.ayni.%@example.invalid' GROUP BY e.district
UNION ALL SELECT c.district,'comunidades',COUNT(*) FROM comunidades c JOIN usuarios u ON u.id=c.creator_id WHERE u.email LIKE 'demo.ayni.%@example.invalid' GROUP BY c.district
ORDER BY district,seccion;
