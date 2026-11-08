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

CREATE TABLE IF NOT EXISTS publicaciones (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 author_id CHAR(36) NOT NULL,
 module ENUM('trueque','apoyo','emprendimiento','aviso') NOT NULL,
 category VARCHAR(80) NOT NULL,
 title VARCHAR(120) NOT NULL,
 description TEXT NOT NULL,
 district VARCHAR(120) NOT NULL,
 neighborhood VARCHAR(160) NOT NULL,
 status ENUM('active','completed','archived') NOT NULL DEFAULT 'active',
 pinned BOOLEAN NOT NULL DEFAULT FALSE,
 resolved BOOLEAN NOT NULL DEFAULT FALSE,
 moderated_at DATETIME NULL,
 moderation_reason VARCHAR(500) NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 INDEX idx_posts_feed(module,status,created_at),
 INDEX idx_posts_author(author_id,status),
 FOREIGN KEY(author_id) REFERENCES usuarios(id) ON DELETE CASCADE
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
