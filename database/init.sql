-- ============================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS
-- Se ejecuta automáticamente al desplegar en Railway
-- ============================================

-- Crear tablas si no existen
CREATE TABLE IF NOT EXISTS director (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombres varchar(100) NOT NULL,
  apellidos varchar(100) NOT NULL,
  nacionalidad varchar(50) DEFAULT NULL,
  estado tinyint(1) DEFAULT 1,
  fecha_creacion timestamp NOT NULL DEFAULT current_timestamp(),
  fecha_actualizacion timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS genero (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(50) NOT NULL,
  estado tinyint(1) DEFAULT 1,
  fecha_creacion timestamp NOT NULL DEFAULT current_timestamp(),
  fecha_actualizacion timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS productora (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  sede_social varchar(100) DEFAULT NULL,
  estado tinyint(1) DEFAULT 1,
  fecha_creacion timestamp NOT NULL DEFAULT current_timestamp(),
  fecha_actualizacion timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tipo (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(50) NOT NULL,
  estado tinyint(1) DEFAULT 1,
  fecha_creacion timestamp NOT NULL DEFAULT current_timestamp(),
  fecha_actualizacion timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS media (
  id int(11) NOT NULL AUTO_INCREMENT,
  serial varchar(50) NOT NULL,
  titulo varchar(200) NOT NULL,
  sinopsis text DEFAULT NULL,
  url_pelicula varchar(500) DEFAULT NULL,
  anio_estreno int(11) DEFAULT NULL,
  id_genero int(11) DEFAULT NULL,
  id_director int(11) DEFAULT NULL,
  id_productora int(11) DEFAULT NULL,
  id_tipo int(11) DEFAULT NULL,
  estado tinyint(1) DEFAULT 1,
  fecha_creacion timestamp NOT NULL DEFAULT current_timestamp(),
  fecha_actualizacion timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY serial (serial),
  FOREIGN KEY (id_genero) REFERENCES genero(id),
  FOREIGN KEY (id_director) REFERENCES director(id),
  FOREIGN KEY (id_productora) REFERENCES productora(id),
  FOREIGN KEY (id_tipo) REFERENCES tipo(id)
);

-- ============================================
-- DATOS INICIALES (Usando INSERT IGNORE para evitar duplicados)
-- ============================================

-- Directores
INSERT IGNORE INTO director (id, nombres, apellidos, nacionalidad, estado) VALUES 
(1, 'Christopher', 'Nolan', 'Británica', 1),
(2, 'Steven', 'Spielberg', 'Estadounidense', 1),
(3, 'Quentin', 'Tarantino', 'Estadounidense', 1),
(4, 'Martin', 'Scorsese', 'Estadounidense', 1),
(5, 'James', 'Cameron', 'Canadiense', 1),
(6, 'Ridley', 'Scott', 'Británica', 1),
(7, 'Peter', 'Jackson', 'Neozelandés', 1),
(8, 'David', 'Fincher', 'Estadounidense', 1),
(9, 'Francis Ford', 'Coppola', 'Estadounidense', 1),
(10, 'Alfred', 'Hitchcock', 'Británica', 1),
(11, 'Stanley', 'Kubrick', 'Estadounidense', 1),
(12, 'Pedro', 'Almodóvar', 'Española', 1),
(13, 'Guillermo', 'del Toro', 'Mexicana', 1),
(14, 'Alejandro', 'González Iñárritu', 'Mexicana', 1),
(15, 'Alfonso', 'Cuarón', 'Mexicana', 1),
(16, 'Wes', 'Anderson', 'Estadounidense', 1),
(17, 'Tim', 'Burton', 'Estadounidense', 1),
(18, 'Clint', 'Eastwood', 'Estadounidense', 1),
(20, 'Ron', 'Howard', 'Estadounidense', 1);

-- Géneros
INSERT IGNORE INTO genero (id, nombre, estado) VALUES 
(1, 'Acción', 1),
(2, 'Comedia', 1),
(3, 'Drama', 1),
(4, 'Ciencia Ficción', 1),
(5, 'Terror', 1),
(6, 'Animación', 1),
(7, 'Documental', 1),
(8, 'Romance', 1),
(9, 'Aventura', 1),
(10, 'Fantasía', 1),
(11, 'Suspenso', 1),
(12, 'Musical', 1),
(13, 'Crimen', 1),
(14, 'Bélica', 1),
(15, 'Deportes', 1);

-- Productoras
INSERT IGNORE INTO productora (id, nombre, sede_social, estado) VALUES 
(1, 'Warner Bros', 'Estados Unidos', 1),
(2, 'Universal Pictures', 'Estados Unidos', 1),
(3, 'Paramount Pictures', 'Estados Unidos', 1),
(4, 'Sony Pictures', 'Japón/Estados Unidos', 1),
(6, 'Netflix', 'Estados Unidos', 1),
(7, 'Amazon Studios', 'Estados Unidos', 1),
(8, 'Disney', 'Estados Unidos', 1),
(9, 'Miramax', 'Estados Unidos', 1),
(10, 'Lionsgate', 'Canadá/Estados Unidos', 1),
(11, 'MGM', 'Estados Unidos', 1),
(12, 'DreamWorks', 'Estados Unidos', 1),
(13, 'Columbia Pictures', 'Estados Unidos', 1),
(14, 'New Line Cinema', 'Estados Unidos', 1),
(15, 'HBO', 'Estados Unidos', 1),
(16, 'Apple TV+', 'Estados Unidos', 1),
(17, 'A24', 'Estados Unidos', 1),
(18, 'Focus Features', 'Estados Unidos', 1),
(19, 'Searchlight Pictures', 'Estados Unidos', 1),
(20, 'Studio Ghibli', 'Japón', 1);

-- Tipos
INSERT IGNORE INTO tipo (id, nombre, estado) VALUES 
(1, 'Película', 1),
(2, 'Serie', 1),
(3, 'Documental', 1),
(4, 'Cortometraje', 1),
(5, 'Miniserie', 1),
(6, 'Especial', 1);

-- Media (Películas, Series, Documentales)
INSERT IGNORE INTO media (id, serial, titulo, sinopsis, anio_estreno, id_genero, id_director, id_productora, id_tipo, estado) VALUES 
(1, 'MOV001', 'Inception', 'Dom Cobb es un ladrón con la habilidad de entrar en los sueños de las personas y robar secretos de sus subconscientes. Su nueva misión: plantar una idea en la mente de un CEO.', 2010, 4, 1, 1, 1, 1),
(2, 'MOV002', 'Jurassic Park', 'Un multimillonario crea un parque temático con dinosaurios clonados, pero todo sale mal cuando las criaturas escapan.', 1993, 4, 2, 2, 1, 1),
(3, 'MOV003', 'Pulp Fiction', 'Las vidas de dos asesinos a sueldo, un boxeador, la esposa de un gángster y dos bandidos se entrelazan.', 1994, 13, 3, 9, 1, 1),
(4, 'MOV004', 'Titanic', 'Una historia de amor entre una joven aristócrata y un artista humilde a bordo del desafortunado Titanic.', 1997, 8, 5, 2, 1, 1),
(5, 'MOV005', 'El Padrino', 'El patriarca de una familia mafiosa transfiere el control de su imperio a su hijo reacio.', 1972, 13, 9, 1, 1, 1),
(6, 'MOV006', 'Avatar', 'Un marine parapléjico es enviado a la luna Pandora en una misión especial.', 2009, 4, 5, 1, 1, 1),
(7, 'MOV007', 'El Caballero de la Noche', 'Batman debe detener al Guasón, un criminal que siembra el caos en Gotham.', 2008, 1, 1, 1, 1, 1),
(8, 'MOV008', 'Interestelar', 'Un grupo de exploradores viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.', 2014, 4, 1, 1, 1, 1),
(9, 'MOV009', 'Toro Salvaje', 'La vida del boxeador Jake LaMotta, desde sus éxitos hasta su caída.', 1980, 15, 4, 2, 1, 1),
(10, 'MOV010', 'La Lista de Schindler', 'Un empresario alemán salva a más de mil judíos durante el Holocausto.', 1993, 14, 2, 2, 1, 1),
(11, 'MOV011', 'Forrest Gump', 'Un hombre con discapacidad intelectual cuenta su increíble vida.', 1994, 3, 20, 2, 1, 1),
(12, 'MOV012', 'El Señor de los Anillos: La Comunidad del Anillo', 'Un hobbit emprende un viaje para destruir un anillo maldito.', 2001, 10, 7, 1, 1, 1),
(13, 'MOV013', 'Matrix', 'Un programador descubre que la realidad es una simulación.', 1999, 4, 5, 1, 1, 1),
(14, 'MOV014', 'Gladiador', 'Un general romano busca venganza contra el corrupto emperador.', 2000, 1, 6, 2, 1, 1),
(15, 'MOV015', 'Bastardos sin Gloria', 'Un grupo de soldados judíos planean matar a líderes nazis.', 2009, 14, 3, 1, 1, 1),
(16, 'SER001', 'Stranger Things', 'Cuando un niño desaparece, sus amigos descubren secretos sobrenaturales.', 2016, 4, NULL, 6, 2, 1),
(17, 'SER002', 'The Crown', 'Sigue la vida de la Reina Isabel II desde su juventud.', 2016, 3, NULL, 6, 2, 1),
(18, 'SER003', 'Game of Thrones', 'Nobles familias luchan por el control del Trono de Hierro.', 2011, 10, NULL, 15, 2, 1),
(19, 'SER004', 'Breaking Bad', 'Un profesor de química se convierte en fabricante de metanfetaminas.', 2008, 13, NULL, 3, 2, 1),
(20, 'SER005', 'The Mandalorian', 'Un cazarrecompensas protege a un niño de la misma especie que Yoda.', 2019, 4, NULL, 8, 2, 1),
(21, 'SER006', 'Los Simpsons', 'Las aventuras de una familia disfuncional en Springfield.', 1989, 2, NULL, 8, 2, 1),
(22, 'SER007', 'Friends', 'Seis amigos navegan por la vida y el amor en Nueva York.', 1994, 2, NULL, 1, 2, 1),
(23, 'SER008', 'The Office', 'Documental sobre la vida en una oficina de ventas de papel.', 2005, 2, NULL, 2, 2, 1),
(24, 'SER009', 'Chernobyl', 'Los eventos de la catástrofe nuclear de 1986.', 2019, 3, NULL, 15, 2, 1),
(25, 'SER010', 'Black Mirror', 'Antología sobre los peligros de la tecnología.', 2011, 4, NULL, 6, 2, 1),
(26, 'DOC001', 'Nuestro Planeta', 'Explora los hábitats naturales del mundo.', 2019, 7, NULL, 6, 3, 1),
(27, 'DOC002', 'Cosmos', 'Viaje a través del universo y el tiempo.', 2014, 4, NULL, 8, 3, 1),
(28, 'DOC003', 'The Last Dance', 'La historia de Michael Jordan y los Chicago Bulls.', 2020, 15, NULL, 6, 3, 1),
(29, 'DOC004', 'Tierra', 'Documental sobre la vida en nuestro planeta.', 2007, 7, NULL, 8, 3, 1),
(30, 'DOC005', 'La Marcha de los Pingüinos', 'El viaje de los pingüinos emperador.', 2005, 7, NULL, 1, 3, 1);