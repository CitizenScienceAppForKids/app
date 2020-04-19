
SET FOREIGN_KEY_CHECKS=0;

USE `common`;

--
-- Fill table for `images`
--

LOCK TABLES `images` WRITE;
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (1, 'img1', 'png', '/project_images');
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (2, 'img2', 'jpg', '/project_images');
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (3, 'img3', 'bmp', '/project_images');
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (4, 'img4', 'png', '/project_images');
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (5, 'img5', 'jpg', '/project_images');
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (6, 'img6', 'png', '/project_images');
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (7, 'img7', 'jpg', '/project_images');
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (8, 'img8', 'png', '/project_images');
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (9, 'img9', 'jpg', '/project_images');
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (1, 'img10', 'png', '/project_images');
INSERT INTO `images` (project, file_name, file_type, file_path) VALUES (1, 'img11', 'png', '/banners');
INSERT INTO `images` (project, file_name, file_type, file_path) VALUES (2, 'img12', 'png', '/banners');
INSERT INTO `images` (project, file_name, file_type, file_path) VALUES (3, 'img13', 'png', '/banners');

UNLOCK TABLES;


--
-- Fill table for `projects`
--

LOCK TABLES `projects` WRITE;
INSERT INTO `projects` (type, title, description) VALUES ('Biology', 'Test Project: Ecology', 'What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
INSERT INTO `projects` (type, title, description) VALUES ('Ecology', 'Test Project: Biology', 'What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
INSERT INTO `projects` (type, title, description) VALUES ('Biology', 'Test Project: Climatology', 'What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
UNLOCK TABLES;

--
-- Fill table for `observations`
--

LOCK TABLES `observations` WRITE;
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (1, now(), 'Jumpsuit', 'lorem ipsum and such', 'windspeed: 10', 40.2969, -111.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (2, now(), 'Levitate', 'lorem ipsum and such', 'windspeed: 10', 30.2969, -80.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (3, now(), 'Morph', 'lorem ipsum and such', 'windspeed: 10', 20.2969, -50.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (1, now(), 'Chlorine', 'lorem ipsum and such', 'windspeed: 10', 10.2969, -20.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (2, now(), 'The Hype', 'lorem ipsum and such', 'windspeed: 10', 1.2969, 10.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (3, now(), 'My Blood', 'lorem ipsum and such', 'windspeed: 10', 40.2969, -111.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (1, now(), 'Nico and the Niners', 'lorem ipsum and such', 'windspeed: 10', 30.2969, -80.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (2, now(), 'Bandito', 'lorem ipsum and such', 'windspeed: 10', 20.2969, -50.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (3, now(), 'Leave the City', 'lorem ipsum and such', 'windspeed: 10', 10.2969, -20.6946);
UNLOCK TABLES;