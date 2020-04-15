
SET FOREIGN_KEY_CHECKS=0;


USE `citizen`;

--
-- fill table for `locations`
--

LOCK TABLES `locations` WRITE;
INSERT INTO `locations` (latitude, longitude) VALUES (40.2969, -111.6946);
INSERT INTO `locations` (latitude, longitude) VALUES (30.2969, -80.6946);
INSERT INTO `locations` (latitude, longitude) VALUES (20.2969, -50.6946);
INSERT INTO `locations` (latitude, longitude) VALUES (10.2969, -20.6946);
INSERT INTO `locations` (latitude, longitude) VALUES (1.2969, 10.6946);
INSERT INTO `locations` (latitude, longitude) VALUES (-10.2969, 40.6946);
INSERT INTO `locations` (latitude, longitude) VALUES (-40.2969, 70.6946);

UNLOCK TABLES;

--
-- Fill table for `images`
--

LOCK TABLES `images` WRITE;
INSERT INTO `images` (file_name, file_type, file_path) VALUES ('img1', 'png', '/project_images');
INSERT INTO `images` (file_name, file_type, file_path) VALUES ('img2', 'jpg', '/project_images');
INSERT INTO `images` (file_name, file_type, file_path) VALUES ('img3', 'bmp', '/project_images');
INSERT INTO `images` (file_name, file_type, file_path) VALUES ('img4', 'png', '/project_images');
INSERT INTO `images` (file_name, file_type, file_path) VALUES ('img5', 'jpg', '/project_images');
INSERT INTO `images` (file_name, file_type, file_path) VALUES ('img6', 'png', '/project_images');
INSERT INTO `images` (file_name, file_type, file_path) VALUES ('img7', 'jpg', '/project_images');
INSERT INTO `images` (file_name, file_type, file_path) VALUES ('img8', 'png', '/project_images');
INSERT INTO `images` (file_name, file_type, file_path) VALUES ('img9', 'jpg', '/project_images');
INSERT INTO `images` (file_name, file_type, file_path) VALUES ('img10', 'png', '/project_images');
INSERT INTO `images` (file_name, file_type, file_path) VALUES ('img11', 'png', '/banners');
INSERT INTO `images` (file_name, file_type, file_path) VALUES ('img12', 'png', '/banners');
INSERT INTO `images` (file_name, file_type, file_path) VALUES ('img13', 'png', '/banners');

UNLOCK TABLES;


--
-- Fill table for `projects`
--

LOCK TABLES `projects` WRITE;
INSERT INTO `projects` (type, title, description, banner) VALUES ('Biology', 'Test Project: Ecology', 'What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' , 11);
INSERT INTO `projects` (type, title, description, banner) VALUES ('Ecology', 'Test Project: Biology', 'What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' , 12);
INSERT INTO `projects` (type, title, description, banner) VALUES ('Biology', 'Test Project: Climatology', 'What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' , 13);
UNLOCK TABLES;

--
-- Fill table for `observations`
--

LOCK TABLES `observations` WRITE;
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude, images) VALUES (1, now(), 'Jumpsuit', 'lorem ipsum and such', 'windspeed: 10', 40.2969, -111.6946, 1);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude, images) VALUES (2, now(), 'Levitate', 'lorem ipsum and such', 'windspeed: 10', 30.2969, -80.6946, 2);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude, images) VALUES (3, now(), 'Morph', 'lorem ipsum and such', 'windspeed: 10', 20.2969, -50.6946, 3);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude, images) VALUES (1, now(), 'Chlorine', 'lorem ipsum and such', 'windspeed: 10', 10.2969, -20.6946, 4);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude, images) VALUES (2, now(), 'The Hype', 'lorem ipsum and such', 'windspeed: 10', 1.2969, 10.6946, 5);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude, images) VALUES (3, now(), 'My Blood', 'lorem ipsum and such', 'windspeed: 10', 40.2969, -111.6946, 6);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude, images) VALUES (1, now(), 'Nico and the Niners', 'lorem ipsum and such', 'windspeed: 10', 30.2969, -80.6946, 7);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude, images) VALUES (2, now(), 'Bandito', 'lorem ipsum and such', 'windspeed: 10', 20.2969, -50.6946, 8);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude, images) VALUES (3, now(), 'Leave the City', 'lorem ipsum and such', 'windspeed: 10', 10.2969, -20.6946, 9);
UNLOCK TABLES;