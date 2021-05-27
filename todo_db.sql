-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Värd: 127.0.0.1
-- Tid vid skapande: 21 maj 2021 kl 13:40
-- Serverversion: 10.4.17-MariaDB
-- PHP-version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `todo_db`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `task`
--

CREATE TABLE `task` (
  `task_id` int(11) NOT NULL,
  `task_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumpning av Data i tabell `task`
--

INSERT INTO `task` (`task_id`, `task_user_id`) VALUES
(56, 10),
(57, 10),
(58, 12),
(59, 12);

-- --------------------------------------------------------

--
-- Tabellstruktur `task_info`
--

CREATE TABLE `task_info` (
  `info_id` int(11) NOT NULL,
  `ti_task_id` int(11) NOT NULL,
  `task_creation_date` date NOT NULL,
  `task_latest_update_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur `task_setting`
--

CREATE TABLE `task_setting` (
  `setting_id` int(11) NOT NULL,
  `ts_task_id` int(11) NOT NULL,
  `task_title` text NOT NULL,
  `background_color` text NOT NULL,
  `title_color` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumpning av Data i tabell `task_setting`
--

INSERT INTO `task_setting` (`setting_id`, `ts_task_id`, `task_title`, `background_color`, `title_color`) VALUES
(38, 56, 'Yes', '#ff0055', '#00f1ff'),
(39, 57, 'Haha', 'white', 'black'),
(40, 58, 'Newcaed', '#002eff', '#e1ff00'),
(41, 59, 'Ha', '#9fff00', '#ff00da');

-- --------------------------------------------------------

--
-- Tabellstruktur `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `user_firstname` text NOT NULL,
  `user_lastname` text NOT NULL,
  `user_email` text NOT NULL,
  `user_username` text NOT NULL,
  `user_password` varchar(500) NOT NULL,
  `user_auth` varchar(128) NOT NULL,
  `user_auth_2` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumpning av Data i tabell `user`
--

INSERT INTO `user` (`user_id`, `user_firstname`, `user_lastname`, `user_email`, `user_username`, `user_password`, `user_auth`, `user_auth_2`) VALUES
(10, 'Yes', 'Yes', 'Hey@mail.com', 'Yes', '77a7a0821df25f26326b9e40192556670f6679e9148e89c69e7d662715ca03f4', 'XzC7dEvvNrIPZ8Vvdr8wszkTXTQLmqXGqCQe4Oc0tWIB9ZR3aaBEXIIwlPIQqPEf', 'dRMoR1FDGpmlceXfwzyVpQ8bhKMd8vSDanSNC0oGuJGvLIfTNqyltGs2QE4xHyTk'),
(11, 'Haha', 'Hahaha', 'Ha@mail.com', 'Hha', '20500347201f2cb46ee17f8bbbb301e12c7bcf5368973427f7fcb38c275e64c2', '3ps7GPDh7cx8WmAFKxctNTD5Q7EtQKXlAv1FpvJMud2JEONL7UckgvOAJ12tyRI9', 'g1CUidD8wntTOXaC8JzwdS3zS5lXGnA1gReINkzXs5pVzTd6WJJ7c1TsJxOLRPTE'),
(12, 'Yes', 'Ha', 'Haha@mail.com', 'Ha', 'c84e4195c20f99d3fccf0250b2f3bd86b0981dbf0cffc39ef04b8cc3b3adcbd1', '88ZDd88koPiohTq8iu4v6E3QF2VHomtGZoF6bDqTyQXthGp0whdNCTtoOWQsxgKq', 'bVMMMDpe7f6Pb5JGCoB6C6hZ6zLMOxayOv9CfLXE3RmWFkFwtbe5F0w0VbVNLiZ2');

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `task_user_id` (`task_user_id`);

--
-- Index för tabell `task_info`
--
ALTER TABLE `task_info`
  ADD PRIMARY KEY (`info_id`),
  ADD KEY `ti_task_id` (`ti_task_id`);

--
-- Index för tabell `task_setting`
--
ALTER TABLE `task_setting`
  ADD PRIMARY KEY (`setting_id`),
  ADD KEY `task_id` (`ts_task_id`);

--
-- Index för tabell `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `task`
--
ALTER TABLE `task`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT för tabell `task_info`
--
ALTER TABLE `task_info`
  MODIFY `info_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT för tabell `task_setting`
--
ALTER TABLE `task_setting`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT för tabell `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restriktioner för dumpade tabeller
--

--
-- Restriktioner för tabell `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`task_user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Restriktioner för tabell `task_setting`
--
ALTER TABLE `task_setting`
  ADD CONSTRAINT `task_setting_ibfk_1` FOREIGN KEY (`ts_task_id`) REFERENCES `task` (`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
