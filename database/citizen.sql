
SET FOREIGN_KEY_CHECKS=0;

--
--  Create Database
--

CREATE DATABASE IF NOT EXISTS `citizen`;
USE `citizen`;

--
-- Create table for `images`
--

DROP TABLE IF EXISTS `images`;

CREATE TABLE `images` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `file_name` tinytext NOT NULL,
  `file_type` tinytext NOT NULL,
  `file_path` text NOT NULL,
  PRIMARY KEY (`iid`)
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
  `banner` int,
  PRIMARY KEY (`pid`),
  CONSTRAINT `project_fk1` FOREIGN KEY (`banner`) REFERENCES `images` (`iid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Create table for `observations`
--

DROP TABLE IF EXISTS `observations`;

CREATE TABLE `observations` (
  `oid` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `date` datetime NOT NULL,
  `title` tinytext NOT NULL,
  `notes` text NOT NULL,
  `measurements` text,
  `latitude` float(7, 4) NOT NULL,
  `longitude` float(7, 4) NOT NULL,
  `images` int DEFAULT NULL,
  PRIMARY KEY (`oid`),
  CONSTRAINT `obs_fk1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`pid`),
  CONSTRAINT `obs_fk3` FOREIGN KEY (`images`) REFERENCES `images` (`iid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
