
SET FOREIGN_KEY_CHECKS=0;

USE `common`;

--
-- Fill table for `images`
--

LOCK TABLES `images` WRITE;
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (1, 'yak1', '.jpg', 'https://cab-cs467-images.s3-us-west-1.amazonaws.com/');
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (1, 'yak2', '.jpg', 'https://cab-cs467-images.s3-us-west-1.amazonaws.com/');
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (2, 'moth1', '.jpg', 'https://cab-cs467-images.s3-us-west-1.amazonaws.com/');
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (3, 'frog1', '.jpg', 'https://cab-cs467-images.s3-us-west-1.amazonaws.com/');
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (4, 'deer1', '.jpg', 'https://cab-cs467-images.s3-us-west-1.amazonaws.com/');
INSERT INTO `images` (observation, file_name, file_type, file_path) VALUES (5, 'clownfish1', '.jpg', 'https://cab-cs467-images.s3-us-west-1.amazonaws.com/');
INSERT INTO `images` (project, file_name, file_type, file_path) VALUES (1, 'ecology', '.jpg', 'https://cab-cs467-images.s3-us-west-1.amazonaws.com/banners/');
INSERT INTO `images` (project, file_name, file_type, file_path) VALUES (2, 'biology', '.jpg', 'https://cab-cs467-images.s3-us-west-1.amazonaws.com/banners/');
INSERT INTO `images` (project, file_name, file_type, file_path) VALUES (3, 'climatology', '.jpg', 'https://cab-cs467-images.s3-us-west-1.amazonaws.com/banners/');

UNLOCK TABLES;


--
-- Fill table for `projects`
--

LOCK TABLES `projects` WRITE;
INSERT INTO `projects` (type, title, description) VALUES ('Ecology', 'A Species Survey', 'Ecology is the study of the
distribution and abundance of life on Earth. Ecologists like to know where livings are, and how many of them
 are there! In this project, you will take part in a species survey to help answer those questions. All you need to do
 is find an animal, then record where and when you found it. This will help scientists determine how living things are
 distrubuted across the planet, and how their populations change over time.');
INSERT INTO `projects` (type, title, description) VALUES ('Biology', 'The Chemistry of our Oceans', 'The oceans are some
of our greatest resources, supplying food, recreation, and critical pathways for shipping and travel. Changes in the
chemistry of our oceans can have profound impacts. This project will help scientists track how ocean chemistry changes
over time. Specifically, participants will be helping gather information about the pH of ocean water (pH is a measure
of how acidic or basic a liquid is).');
INSERT INTO `projects` (type, title, description) VALUES ('Climatology', 'Climatology', 'When it snows on Christmas
we call that weather. When it snows every Christmas for thirty years, we call that climate. Climatology is the study of
weather over long periods of time. In this project you will record weather conditions in your area. When all of the
observations are taken together, they can be used to determine the climate of a particular place.');
UNLOCK TABLES;

--
-- Fill table for `observations`
--

LOCK TABLES `observations` WRITE;
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (1, now(), 'Yak', 'Spotted in an open field. Ate a lot of grass and then
went to sleep.', JSON_OBJECT("Genus", "Bos", "Species", "Taurus", "Common Name", "Highland cattle"), 40.2969, -111.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (1, now(), 'Moth', 'A big Atlas moth!', JSON_OBJECT("Genus", "Attacus", "Species", "atlas", "Common Name", "Atlas moth"), 10.2969, -20.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (1, now(), 'Frog', 'Don\'t touch this one.', JSON_OBJECT("Genus", "Dendrobates", "Species", "unknown", "Common Name", "Poison Dart Frog"), 30.2969, -80.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (1, now(), 'Deer', 'Found near the city.', JSON_OBJECT("Genus", "Axis", "Species", "axis", "Common Name", "Chital"), 30.2969, -80.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (1, now(), 'Clownfish', 'Hiding in an anemone.', JSON_OBJECT("Genus", "Amphiprion", "Species", "ocellaris", "Common Name", "Clown fish"), 30.2969, -80.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (2, now(), 'Near Alcatraz', 'Boat trip', JSON_OBJECT("pH", "6.3", "Depth (m)", "2.3", "Water Temperature (F)", "64", "Weather", "Overcast"), 20.2969, -50.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (2, now(), 'Coast of Madagascar', 'Very warm outside', JSON_OBJECT("pH", "8.4", "Depth (m)", "3.1", "Water Temperature (F)", "87", "Weather", "Sunny"), 30.2969, -80.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (2, now(), 'Offshore Mallorca', 'Kind of a stormy', JSON_OBJECT("pH", "5.6", "Depth (m)", "4.0", "Water Temperature (F)", "78", "Weather", "Stormy"), 1.2969, 10.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (3, now(), 'Christmas Snow', 'Snow day!', JSON_OBJECT("Temperature (F)", "24", "Wind Speed (m/s)", "4.5", "Precipitation (mm)", "34.33") , 10.2969, -20.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (3, now(), 'Raining', 'Very rainy day', JSON_OBJECT("Temperature (F)", "56", "Wind Speed (m/s)", "1.2", "Precipitation (mm)", "645.34"), 40.2969, -111.6946);
INSERT INTO `observations` (project_id, date, title, notes, measurements, latitude, longitude) VALUES (3, now(), 'Hail', 'Hail with some rain', JSON_OBJECT("Temperature (F)", "43", "Wind Speed (m/s)", "6.9", "Precipitation (mm)", "234.04"), 20.2969, -50.6946);
UNLOCK TABLES;