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
