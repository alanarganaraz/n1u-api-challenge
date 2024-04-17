-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 16, 2024 at 06:41 PM
-- Server version: 8.0.36-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `n1u_challenge_dev`
--

CREATE TABLE `address` (
  `id` varchar(255) NOT NULL,
  `id_restaurant` varchar(255) DEFAULT NULL,
  `street_name` varchar(255) DEFAULT NULL,
  `street_number` int DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `category` (
  `id` varchar(255) NOT NULL,
  `category_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `category` (`id`, `category_name`) VALUES
('1', 'Pastas'),
('2', 'Carnes'),
('3', 'Ensaladas'),
('4', 'Sopas y Cremas'),
('5', 'Platos vegetarianos/veganos');


CREATE TABLE `hour_of_day` (
  `id` int NOT NULL,
  `hour` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `hour_of_day` (`id`, `hour`) VALUES
(1, '00:00'),
(2, '00:15'),
(3, '00:30'),
(4, '00:45'),
(5, '01:00'),
(6, '01:15'),
(7, '01:30'),
(8, '01:45'),
(9, '02:00'),
(10, '02:15'),
(11, '02:30'),
(12, '02:45'),
(13, '03:00'),
(14, '03:15'),
(15, '03:30'),
(16, '03:45'),
(17, '04:00'),
(18, '04:15'),
(19, '04:30'),
(20, '04:45'),
(21, '05:00'),
(22, '05:15'),
(23, '05:30'),
(24, '05:45'),
(25, '06:00'),
(26, '06:15'),
(27, '06:30'),
(28, '06:45'),
(29, '07:00'),
(30, '07:15'),
(31, '07:30'),
(32, '07:45'),
(33, '08:00'),
(34, '08:15'),
(35, '08:30'),
(36, '08:45'),
(37, '09:00'),
(38, '09:15'),
(39, '09:30'),
(40, '09:45'),
(41, '10:00'),
(42, '10:15'),
(43, '10:30'),
(44, '10:45'),
(45, '11:00'),
(46, '11:15'),
(47, '11:30'),
(48, '11:45'),
(49, '12:00'),
(50, '12:15'),
(51, '12:30'),
(52, '12:45'),
(53, '13:00'),
(54, '13:15'),
(55, '13:30'),
(56, '13:45'),
(57, '14:00'),
(58, '14:15'),
(59, '14:30'),
(60, '14:45'),
(61, '15:00'),
(62, '15:15'),
(63, '15:30'),
(64, '15:45'),
(65, '16:00'),
(66, '16:15'),
(67, '16:30'),
(68, '16:45'),
(69, '17:00'),
(70, '17:15'),
(71, '17:30'),
(72, '17:45'),
(73, '18:00'),
(74, '18:15'),
(75, '18:30'),
(76, '18:45'),
(77, '19:00'),
(78, '19:15'),
(79, '19:30'),
(80, '19:45'),
(81, '20:00'),
(82, '20:15'),
(83, '20:30'),
(84, '20:45'),
(85, '21:00'),
(86, '21:15'),
(87, '21:30'),
(88, '21:45'),
(89, '22:00'),
(90, '22:15'),
(91, '22:30'),
(92, '22:45'),
(93, '23:00'),
(94, '23:15'),
(95, '23:30'),
(96, '23:45'),
(97, 'Cerrado');


CREATE TABLE `product` (
  `id` varchar(255) NOT NULL,
  `id_restaurant` varchar(255) DEFAULT NULL,
  `id_category` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `product` (`id`, `id_restaurant`, `id_category`, `image`, `name`, `price`) VALUES
('1', '2', '3', '123.jpg', 'hola producto', '4.00'),
('2', '2', '3', '123.jpg', 'hola producto 2', '5.00');


CREATE TABLE `promotion` (
  `id` varchar(255) NOT NULL,
  `id_product` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `promotion_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `promotion_schedule` (
  `id` varchar(255) NOT NULL,
  `id_promotion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `weekday_promotion` int DEFAULT NULL,
  `opening_promotion_hour` int DEFAULT NULL,
  `closing_promotion_hour` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `restaurant` (
  `id` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `number` varchar(20) DEFAULT NULL,
  `rating` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `restaurant` (`id`, `image`, `name`, `number`, `rating`) VALUES
('2', 'jpg.jpg', 'hola', '123', 4);


CREATE TABLE `restaurant_schedule` (
  `id` varchar(255) NOT NULL,
  `id_restaurant` varchar(255) DEFAULT NULL,
  `weekday_id` int DEFAULT NULL,
  `opening_hour` int DEFAULT NULL,
  `closing_hour` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `weekday` (
  `id` int NOT NULL,
  `name` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



INSERT INTO `weekday` (`id`, `name`) VALUES
(7, 'Domingo'),
(4, 'Jueves'),
(1, 'Lunes'),
(2, 'Martes'),
(3, 'Miércoles'),
(6, 'Sábado'),
(5, 'Viernes');


ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `address_ibfk_1` (`id_restaurant`);


ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `hour_of_day`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `hour` (`hour`);

ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_category` (`id_category`),
  ADD KEY `fk_product_restaurant` (`id_restaurant`);


ALTER TABLE `promotion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_promotion_product` (`id_product`);


ALTER TABLE `promotion_schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_promotion_schedule_weekday` (`weekday_promotion`),
  ADD KEY `fk_promotion_schedule_opening_hour` (`opening_promotion_hour`),
  ADD KEY `fk_promotion_schedule_closing_hour` (`closing_promotion_hour`),
  ADD KEY `fk_promotion_schedule_promotion` (`id_promotion`);


ALTER TABLE `restaurant`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `restaurant_schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `weekday_id` (`weekday_id`),
  ADD KEY `opening_hour` (`opening_hour`),
  ADD KEY `closing_hour` (`closing_hour`),
  ADD KEY `fk_restaurant_schedule_restaurant` (`id_restaurant`);

ALTER TABLE `weekday`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

ALTER TABLE `hour_of_day`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;


ALTER TABLE `weekday`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;


ALTER TABLE `address`
  ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`id_restaurant`) REFERENCES `restaurant` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_address_restaurant` FOREIGN KEY (`id_restaurant`) REFERENCES `restaurant` (`id`) ON DELETE CASCADE;

ALTER TABLE `product`
  ADD CONSTRAINT `fk_product_restaurant` FOREIGN KEY (`id_restaurant`) REFERENCES `restaurant` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`id_restaurant`) REFERENCES `restaurant` (`id`),
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`id_category`) REFERENCES `category` (`id`);


ALTER TABLE `promotion`
  ADD CONSTRAINT `fk_promotion_product` FOREIGN KEY (`id_product`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `promotion_ibfk_1` FOREIGN KEY (`id_product`) REFERENCES `product` (`id`);


ALTER TABLE `promotion_schedule`
  ADD CONSTRAINT `fk_promotion_schedule_closing_hour` FOREIGN KEY (`closing_promotion_hour`) REFERENCES `hour_of_day` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_promotion_schedule_opening_hour` FOREIGN KEY (`opening_promotion_hour`) REFERENCES `hour_of_day` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_promotion_schedule_promotion` FOREIGN KEY (`id_promotion`) REFERENCES `promotion` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_promotion_schedule_weekday` FOREIGN KEY (`weekday_promotion`) REFERENCES `weekday` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `promotion_schedule_ibfk_1` FOREIGN KEY (`id_promotion`) REFERENCES `promotion` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `promotion_schedule_ibfk_2` FOREIGN KEY (`weekday_promotion`) REFERENCES `weekday` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `promotion_schedule_ibfk_3` FOREIGN KEY (`opening_promotion_hour`) REFERENCES `hour_of_day` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `promotion_schedule_ibfk_4` FOREIGN KEY (`closing_promotion_hour`) REFERENCES `hour_of_day` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;


ALTER TABLE `restaurant_schedule`
  ADD CONSTRAINT `fk_restaurant_schedule_restaurant` FOREIGN KEY (`id_restaurant`) REFERENCES `restaurant` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `restaurant_schedule_ibfk_1` FOREIGN KEY (`id_restaurant`) REFERENCES `restaurant` (`id`),
  ADD CONSTRAINT `restaurant_schedule_ibfk_2` FOREIGN KEY (`weekday_id`) REFERENCES `weekday` (`id`),
  ADD CONSTRAINT `restaurant_schedule_ibfk_3` FOREIGN KEY (`opening_hour`) REFERENCES `hour_of_day` (`id`),
  ADD CONSTRAINT `restaurant_schedule_ibfk_4` FOREIGN KEY (`closing_hour`) REFERENCES `hour_of_day` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
