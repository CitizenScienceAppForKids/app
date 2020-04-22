
SET FOREIGN_KEY_CHECKS=0;

--
--  Create Database
--

CREATE DATABASE IF NOT EXISTS `common`;
USE `common`;

--
-- Create table for `images`
--

DROP TABLE IF EXISTS `images`;

CREATE TABLE `images` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `observation` int,
  `project` int,
  `file_name` tinytext NOT NULL,
  `file_type` tinytext NOT NULL,
  `file_path` text NOT NULL,
  PRIMARY KEY (`iid`),
  CONSTRAINT `img_fk1` FOREIGN KEY (`observation`) REFERENCES `observations` (`oid`) ON DELETE CASCADE, 
  CONSTRAINT `img_fk2` FOREIGN KEY (`project`) REFERENCES `projects` (`pid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Create table for `projects`
--

DROP TABLE IF EXISTS `projects`;

CREATE TABLE `projects` (
  `pid` int NOT NULL AUTO_INCREMENT,
  `type` text NOT NULL,
  `title` tinytext NOT NULL,
  `description` mediumtext NOT NULL,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Create table for `observations`
--

DROP TABLE IF EXISTS `observations`;

CREATE TABLE `observations` (
  `oid` int NOT NULL AUTO_INCREMENT,
  `project_id` int,
  `date` datetime NOT NULL,
  `title` tinytext NOT NULL,
  `notes` text NOT NULL,
  `measurements` text,
  `latitude` float(7, 4),
  `longitude` float(7, 4),
  PRIMARY KEY (`oid`),
  CONSTRAINT `obs_fk1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`pid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
