-- INSTALACION COMPLETA DE AYNI - MySQL 8.0.16+ (InnoDB, utf8mb4)
-- Para una instalacion nueva. Ejecutar TODO este archivo en una sola accion
-- en Workbench: Execute (All or Selection), sin dejar una seleccion parcial.
-- Crea la base ayni, 26 tablas, relaciones, indices y catalogos publicos.
-- No necesita SOURCE, otros archivos SQL ni procedimientos almacenados.
-- No contiene cuentas, claves ni datos privados. No elimina tablas existentes.
-- CREATE TABLE IF NOT EXISTS no migra estructuras antiguas: usar db:init para ellas.
-- Configurar DB_NAME=ayni en Backend Ayni/.env.
-- Instrucciones completas: ../INSTALACION-Y-COMANDOS.md.

SET NAMES utf8mb4;

-- 1. Base de datos y estructura actual
-- Ayni · MySQL 8.0.16+ / 8.4+ · InnoDB y utf8mb4.
-- No elimina bases ni tablas existentes. Ejecutar sobre una base dedicada a Ayni.
CREATE DATABASE IF NOT EXISTS ayni CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE ayni;

CREATE TABLE IF NOT EXISTS usuarios (
 id CHAR(36) PRIMARY KEY,
 name VARCHAR(120) NOT NULL,
 email VARCHAR(254) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 district VARCHAR(120) NOT NULL DEFAULT '',
 neighborhood VARCHAR(160) NOT NULL,
 bio VARCHAR(1000) NOT NULL DEFAULT '',
 avatar_url VARCHAR(255) NULL,
 phone VARCHAR(16) NULL,
 sms_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
 deleted_at DATETIME NULL,
 role ENUM('neighbor','moderator','admin') NOT NULL DEFAULT 'neighbor',
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sesiones (
 token_hash CHAR(64) PRIMARY KEY,
 user_id CHAR(36) NOT NULL,
 expires_at DATETIME NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 INDEX idx_sessions_expiration(expires_at),
 FOREIGN KEY(user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comunidades (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 creator_id CHAR(36) NOT NULL,
 name VARCHAR(160) NOT NULL,
 category VARCHAR(80) NOT NULL,
 district VARCHAR(120) NOT NULL,
 description TEXT NOT NULL,
 status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(creator_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS publicaciones (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 author_id CHAR(36) NOT NULL,
 module ENUM('trueque','apoyo','emprendimiento','aviso') NOT NULL,
 category VARCHAR(80) NOT NULL,
 title VARCHAR(120) NOT NULL,
 description TEXT NOT NULL,
 district VARCHAR(120) NOT NULL,
 neighborhood VARCHAR(160) NOT NULL,
 community_id BIGINT UNSIGNED NULL,
 address VARCHAR(255) NULL,latitude DECIMAL(10,7) NULL,longitude DECIMAL(10,7) NULL,
 client_request_id CHAR(36) NULL,sync_hash CHAR(64) NULL,
 UNIQUE KEY uq_publicacion_solicitud(author_id,client_request_id),
 INDEX idx_publicacion_distrito(district,module,status),
 status ENUM('active','completed','archived') NOT NULL DEFAULT 'active',
 pinned BOOLEAN NOT NULL DEFAULT FALSE,
 resolved BOOLEAN NOT NULL DEFAULT FALSE,
 moderated_at DATETIME NULL,
 moderation_reason VARCHAR(500) NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 INDEX idx_posts_feed(module,status,created_at),
 INDEX idx_posts_author(author_id,status),
 FOREIGN KEY(author_id) REFERENCES usuarios(id) ON DELETE CASCADE,
 FOREIGN KEY(community_id) REFERENCES comunidades(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS detalles_trueque (
 post_id BIGINT UNSIGNED PRIMARY KEY,
 offer VARCHAR(500) NOT NULL,
 request VARCHAR(500) NOT NULL,
 item_condition VARCHAR(100) NULL,
 quantity INT UNSIGNED NOT NULL DEFAULT 1,
 CHECK(quantity > 0),
 FOREIGN KEY(post_id) REFERENCES publicaciones(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS detalles_apoyo (
 post_id BIGINT UNSIGNED PRIMARY KEY,
 priority ENUM('Regular','Prioritario','Urgente') NOT NULL DEFAULT 'Regular',
 item_condition VARCHAR(100) NULL,
 quantity INT UNSIGNED NOT NULL DEFAULT 1,
 CHECK(quantity > 0),
 FOREIGN KEY(post_id) REFERENCES publicaciones(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS detalles_emprendimiento (
 post_id BIGINT UNSIGNED PRIMARY KEY,
 price DECIMAL(10,2) NOT NULL,
 accepts_barter BOOLEAN NOT NULL DEFAULT FALSE,
 CHECK(price >= 0),
 FOREIGN KEY(post_id) REFERENCES publicaciones(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS disponibilidad (
 post_id BIGINT UNSIGNED PRIMARY KEY,
 days VARCHAR(160) NOT NULL,
 start_time TIME NOT NULL,
 end_time TIME NOT NULL,
 modality ENUM('Presencial','Virtual','Mixta') NOT NULL DEFAULT 'Presencial',
 CHECK(end_time > start_time),
 FOREIGN KEY(post_id) REFERENCES publicaciones(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS archivos_multimedia (
 id CHAR(36) PRIMARY KEY,
 owner_id CHAR(36) NOT NULL,
 post_id BIGINT UNSIGNED NULL,
 url VARCHAR(255) NOT NULL UNIQUE,
 mime_type VARCHAR(50) NOT NULL,
 size_bytes INT UNSIGNED NOT NULL,
 client_request_id CHAR(36) NULL,
 UNIQUE KEY uq_archivo_solicitud(owner_id,client_request_id),
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(owner_id) REFERENCES usuarios(id) ON DELETE CASCADE,
 FOREIGN KEY(post_id) REFERENCES publicaciones(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS me_gusta_publicaciones (
 post_id BIGINT UNSIGNED NOT NULL,
 user_id CHAR(36) NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(post_id,user_id),
 FOREIGN KEY(post_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
 FOREIGN KEY(user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comentarios (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 post_id BIGINT UNSIGNED NOT NULL,
 author_id CHAR(36) NOT NULL,
 body VARCHAR(2000) NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(post_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
 FOREIGN KEY(author_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS eventos (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 organizer_id CHAR(36) NOT NULL,
 district VARCHAR(120) NULL,
 title VARCHAR(160) NOT NULL,
 description TEXT NOT NULL,
 category VARCHAR(80) NOT NULL,
 location VARCHAR(255) NOT NULL,
 starts_at DATETIME NOT NULL,
 ends_at DATETIME NOT NULL,
 contribution DECIMAL(10,2) NOT NULL DEFAULT 0,
 image_url VARCHAR(255) NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHECK(ends_at > starts_at), CHECK(contribution >= 0),
 INDEX idx_events_date(starts_at),
 FOREIGN KEY(organizer_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS intereses_eventos (
 event_id BIGINT UNSIGNED NOT NULL,
 user_id CHAR(36) NOT NULL,
 PRIMARY KEY(event_id,user_id),
 FOREIGN KEY(event_id) REFERENCES eventos(id) ON DELETE CASCADE,
 FOREIGN KEY(user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;



CREATE TABLE IF NOT EXISTS miembros_comunidad (
 community_id BIGINT UNSIGNED NOT NULL,
 user_id CHAR(36) NOT NULL,
 joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(community_id,user_id),
 FOREIGN KEY(community_id) REFERENCES comunidades(id) ON DELETE CASCADE,
 FOREIGN KEY(user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS conversaciones (
 id CHAR(36) PRIMARY KEY,
 participant_a CHAR(36) NOT NULL,
 participant_b CHAR(36) NOT NULL,
 post_id BIGINT UNSIGNED NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHECK(participant_a <> participant_b),
 UNIQUE KEY uq_conversation_pair(participant_a,participant_b),
 FOREIGN KEY(participant_a) REFERENCES usuarios(id) ON DELETE CASCADE,
 FOREIGN KEY(participant_b) REFERENCES usuarios(id) ON DELETE CASCADE,
 FOREIGN KEY(post_id) REFERENCES publicaciones(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS publicaciones_conversacion (
 conversation_id CHAR(36) NOT NULL,
 post_id BIGINT UNSIGNED NOT NULL,
 PRIMARY KEY(conversation_id,post_id),
 FOREIGN KEY(conversation_id) REFERENCES conversaciones(id) ON DELETE CASCADE,
 FOREIGN KEY(post_id) REFERENCES publicaciones(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mensajes (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 conversation_id CHAR(36) NOT NULL,
 sender_id CHAR(36) NOT NULL,
 body VARCHAR(4000) NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 read_at DATETIME NULL,
 INDEX idx_messages_conversation(conversation_id,id),
 FOREIGN KEY(conversation_id) REFERENCES conversaciones(id) ON DELETE CASCADE,
 FOREIGN KEY(sender_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS resenas (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 post_id BIGINT UNSIGNED NOT NULL,
 author_id CHAR(36) NOT NULL,
 reviewed_user_id CHAR(36) NOT NULL,
 body VARCHAR(1000) NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHECK(author_id <> reviewed_user_id),
 UNIQUE KEY uq_review(author_id,post_id),
 FOREIGN KEY(post_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
 FOREIGN KEY(author_id) REFERENCES usuarios(id) ON DELETE CASCADE,
 FOREIGN KEY(reviewed_user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS guardados_publicaciones (
 post_id BIGINT UNSIGNED NOT NULL, user_id CHAR(36) NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(post_id,user_id),
 FOREIGN KEY(post_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
 FOREIGN KEY(user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS distritos (
 id SMALLINT UNSIGNED PRIMARY KEY, nombre VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS barrios (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, distrito_id SMALLINT UNSIGNED NOT NULL,
 nombre VARCHAR(160) NOT NULL,
 UNIQUE KEY uq_barrio(distrito_id,nombre),
 FOREIGN KEY(distrito_id) REFERENCES distritos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tokens_recuperacion (
 token_hash CHAR(64) PRIMARY KEY, user_id CHAR(36) NOT NULL, expires_at DATETIME NOT NULL,
 used_at DATETIME NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS acciones_admin (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, admin_id CHAR(36) NOT NULL,
 action VARCHAR(60) NOT NULL, entity_id VARCHAR(100) NOT NULL, reason VARCHAR(500) NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(admin_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS alertas_sms (
 id CHAR(36) PRIMARY KEY, admin_id CHAR(36) NOT NULL, district VARCHAR(120) NOT NULL,
 message VARCHAR(320) NOT NULL, state ENUM('draft','sending','completed') NOT NULL DEFAULT 'draft',
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(admin_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS destinatarios_alerta (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, alert_id CHAR(36) NOT NULL, user_id CHAR(36) NOT NULL,
 status VARCHAR(32) NOT NULL DEFAULT 'pending', provider_id VARCHAR(80) NULL,
 UNIQUE KEY uq_alerta_usuario(alert_id,user_id),
 FOREIGN KEY(alert_id) REFERENCES alertas_sms(id) ON DELETE CASCADE,
 FOREIGN KEY(user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS codigos_recuperacion (
 user_id CHAR(36) PRIMARY KEY,
 code_hash CHAR(64) NOT NULL,
 expires_at DATETIME NOT NULL,
 attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- 2. Catalogos iniciales
USE ayni;
INSERT INTO distritos(id,nombre) VALUES
(1,'Lima'),
(2,'Ancón'),
(3,'Ate'),
(4,'Barranco'),
(5,'Breña'),
(6,'Carabayllo'),
(7,'Chaclacayo'),
(8,'Chorrillos'),
(9,'Cieneguilla'),
(10,'Comas'),
(11,'El Agustino'),
(12,'Independencia'),
(13,'Jesús María'),
(14,'La Molina'),
(15,'La Victoria'),
(16,'Lince'),
(17,'Los Olivos'),
(18,'Lurigancho'),
(19,'Lurín'),
(20,'Magdalena del Mar'),
(21,'Pueblo Libre'),
(22,'Miraflores'),
(23,'Pachacámac'),
(24,'Pucusana'),
(25,'Puente Piedra'),
(26,'Punta Hermosa'),
(27,'Punta Negra'),
(28,'Rímac'),
(29,'San Bartolo'),
(30,'San Borja'),
(31,'San Isidro'),
(32,'San Juan de Lurigancho'),
(33,'San Juan de Miraflores'),
(34,'San Luis'),
(35,'San Martín de Porres'),
(36,'San Miguel'),
(37,'Santa Anita'),
(38,'Santa María del Mar'),
(39,'Santa Rosa'),
(40,'Santiago de Surco'),
(41,'Surquillo'),
(42,'Villa El Salvador'),
(43,'Villa María del Triunfo')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);
INSERT IGNORE INTO barrios(distrito_id,nombre) VALUES(36,'Maranga');
INSERT IGNORE INTO barrios(distrito_id,nombre) VALUES(36,'Pando');
INSERT IGNORE INTO barrios(distrito_id,nombre) VALUES(1,'Barrios Altos');
INSERT IGNORE INTO barrios(distrito_id,nombre) VALUES(22,'Santa Cruz');
INSERT IGNORE INTO barrios(distrito_id,nombre) VALUES(40,'Chacarilla del Estanque');
INSERT IGNORE INTO barrios(distrito_id,nombre) VALUES(30,'San Borja Norte');
INSERT IGNORE INTO barrios(distrito_id,nombre) VALUES(30,'San Borja Sur');


-- 3. Resumen de instalacion (esperado: 26 tablas, 43 distritos, 7 barrios iniciales)
SELECT DATABASE() AS base_instalada;
SELECT 'tablas' AS elemento, COUNT(*) AS cantidad
FROM information_schema.tables WHERE table_schema=DATABASE() AND table_type='BASE TABLE'
UNION ALL SELECT 'distritos', COUNT(*) FROM distritos
UNION ALL SELECT 'barrios_iniciales', COUNT(*) FROM barrios;
