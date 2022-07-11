-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 10, 2022 at 01:24 PM
-- Server version: 5.7.31
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `et_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `active`
--

DROP TABLE IF EXISTS `active`;
CREATE TABLE IF NOT EXISTS `active` (
  `A_S` int(11) NOT NULL,
  PRIMARY KEY (`A_S`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `active`
--

INSERT INTO `active` (`A_S`) VALUES
(2);

-- --------------------------------------------------------

--
-- Table structure for table `appartenir`
--

DROP TABLE IF EXISTS `appartenir`;
CREATE TABLE IF NOT EXISTS `appartenir` (
  `Matr` int(11) NOT NULL,
  `Id_AS` int(11) NOT NULL,
  `ID_C` int(11) NOT NULL,
  `Num` int(11) NOT NULL,
  PRIMARY KEY (`Matr`,`Id_AS`,`ID_C`),
  KEY `Id_AS` (`Id_AS`),
  KEY `ID_C` (`ID_C`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `autres_fs`
--

DROP TABLE IF EXISTS `autres_fs`;
CREATE TABLE IF NOT EXISTS `autres_fs` (
  `id` int(10) NOT NULL,
  `ID_autre` int(11) NOT NULL,
  `Label_Autre` varchar(50) NOT NULL,
  `cout` double(7,2) NOT NULL,
  `Id_AS` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `autres_fs`
--

INSERT INTO `autres_fs` (`id`, `ID_autre`, `Label_Autre`, `cout`, `Id_AS`) VALUES
(1, 1, 'Cons', 10000.00, 1),
(0, 2, 'Subv', 10000.00, 1),
(2, 1, 'Construction', 25000.00, 2),
(3, 2, 'Subvention', 10000.00, 2);

-- --------------------------------------------------------

--
-- Table structure for table `a_s`
--

DROP TABLE IF EXISTS `a_s`;
CREATE TABLE IF NOT EXISTS `a_s` (
  `Id_AS` int(11) NOT NULL,
  `Label_AS` varchar(9) NOT NULL,
  PRIMARY KEY (`Id_AS`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `a_s`
--

INSERT INTO `a_s` (`Id_AS`, `Label_AS`) VALUES
(1, '2020-2021'),
(2, '2021-2022');

-- --------------------------------------------------------

--
-- Table structure for table `classe`
--

DROP TABLE IF EXISTS `classe`;
CREATE TABLE IF NOT EXISTS `classe` (
  `ID_C` int(11) NOT NULL,
  `Label_C` varchar(30) DEFAULT NULL,
  `ID_Niv` int(11) NOT NULL,
  PRIMARY KEY (`ID_C`),
  KEY `ID_Niv` (`ID_Niv`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `classe`
--

INSERT INTO `classe` (`ID_C`, `Label_C`, `ID_Niv`) VALUES
(2, 'Seconde 2', 1),
(1, 'Seconde 1', 1),
(3, 'Seconde 3', 1),
(4, 'PS 1', 2),
(5, 'PS 2', 2),
(6, 'PL', 2);

-- --------------------------------------------------------

--
-- Table structure for table `droit`
--

DROP TABLE IF EXISTS `droit`;
CREATE TABLE IF NOT EXISTS `droit` (
  `id` int(10) NOT NULL,
  `ID_Droit` int(11) NOT NULL,
  `type` varchar(5) NOT NULL,
  `Label_D` varchar(20) NOT NULL,
  `montant` double(7,2) NOT NULL,
  `Id_AS` int(11) NOT NULL,
  `ID_Niv` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Id_AS` (`Id_AS`),
  KEY `ID_Niv` (`ID_Niv`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `droit`
--

INSERT INTO `droit` (`id`, `ID_Droit`, `type`, `Label_D`, `montant`, `Id_AS`, `ID_Niv`) VALUES
(0, 1, 'false', 'Seconde VAOVAO', 65000.00, 1, 1),
(1, 2, 'true', 'Seconde TRANAINY', 60000.00, 1, 1),
(2, 3, 'false', 'Premiere VAOVAO', 65000.00, 1, 2),
(3, 4, 'true', 'Premiere TRANAINY', 60000.00, 1, 2),
(11, 6, 'true', 'Terminale TRANAINY', 68000.00, 1, 3),
(10, 5, 'false', 'Terminale VAOVAO', 73000.00, 1, 3),
(17, 6, 'true', 'Seconde TRANAINY', 58000.00, 2, 1),
(16, 5, 'false', 'Seconde VAOVAO', 62000.00, 2, 1),
(15, 4, 'true', 'Premiere TRANAINY', 60000.00, 2, 2),
(13, 2, 'true', 'Terminale TRANAINY', 68000.00, 2, 3),
(14, 3, 'false', 'Premiere VAOVAO', 64000.00, 2, 2),
(12, 1, 'false', 'Terminale VAOVAO', 73000.00, 2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `etudiant`
--

DROP TABLE IF EXISTS `etudiant`;
CREATE TABLE IF NOT EXISTS `etudiant` (
  `Matr` int(11) NOT NULL,
  `ID_Et` int(11) NOT NULL,
  `Nom` varchar(30) NOT NULL,
  `Prenom` varchar(30) NOT NULL,
  `Adresse` varchar(30) DEFAULT NULL,
  `ImgPath` varchar(60) DEFAULT NULL,
  `ID_Obs` int(11) NOT NULL,
  PRIMARY KEY (`Matr`),
  UNIQUE KEY `ID_Et` (`ID_Et`),
  KEY `ID_Obs` (`ID_Obs`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `etudiant`
--

INSERT INTO `etudiant` (`Matr`, `ID_Et`, `Nom`, `Prenom`, `Adresse`, `ImgPath`, `ID_Obs`) VALUES
(1, 1, 'Marius', 'Hamelien', 'Tanambao', '', 1),
(2, 2, 'Marius', 'test', 'Tanambao', '', 1),
(3, 3, 'Marius', 'test', 'Tanambao', '', 2),
(4, 4, 'Marius', 'Hamelien', 'Tanambao', '', 3),
(5, 5, 'Marius', 'test', 'Tanambao', '', 1),
(6, 6, 'Marius', 'Hamelien', 'Tanambao', '', 2),
(7, 7, 'Andry', 'Lala', 'Tanà', '', 3),
(8, 8, 'Tsarandro', 'Paul', 'Soanierana', '', 1),
(9, 9, 'Aina', 'Safidy', 'Imandry', '', 2),
(10, 10, 'Marius', 'Andry', 'Toliara', '', 1),
(11, 11, 'Olivia', 'Sandra', 'Ampitakely', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `inscrire`
--

DROP TABLE IF EXISTS `inscrire`;
CREATE TABLE IF NOT EXISTS `inscrire` (
  `Matr` int(11) NOT NULL,
  `Id_AS` int(11) NOT NULL,
  `ID_Niv` int(11) NOT NULL,
  `Date_insc` varchar(10) NOT NULL,
  `Ancien` varchar(5) NOT NULL,
  `paye` varchar(5) DEFAULT NULL,
  `peut_inscrire` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`Matr`,`Id_AS`,`ID_Niv`),
  KEY `Id_AS` (`Id_AS`),
  KEY `ID_Niv` (`ID_Niv`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inscrire`
--

INSERT INTO `inscrire` (`Matr`, `Id_AS`, `ID_Niv`, `Date_insc`, `Ancien`, `paye`, `peut_inscrire`) VALUES
(1, 2, 1, '29-06-2022', 'false', 'true', NULL),
(2, 2, 2, '29-06-2022', 'false', 'true', NULL),
(3, 2, 2, '29-06-2022', 'false', 'false', NULL),
(4, 2, 1, '29-06-2022', 'false', 'false', NULL),
(5, 2, 3, '30-06-2022', 'false', 'true', NULL),
(6, 2, 3, '29-06-2022', 'false', 'false', NULL),
(7, 2, 1, '29-06-2022', 'false', 'true', NULL),
(8, 2, 1, '01-07-2022', 'false', 'true', NULL),
(9, 2, 2, '01-07-2022', 'false', 'true', NULL),
(10, 2, 2, '01-07-2022', 'false', 'true', NULL),
(11, 2, 3, '07-07-2022', 'false', 'true', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `journal_p`
--

DROP TABLE IF EXISTS `journal_p`;
CREATE TABLE IF NOT EXISTS `journal_p` (
  `ID_Journal` int(11) NOT NULL,
  `Paiement` varchar(100) DEFAULT NULL,
  `Date_P` varchar(10) DEFAULT NULL,
  `Argent` double DEFAULT NULL,
  `add_by` varchar(50) DEFAULT NULL,
  `Mode_P` varchar(6) DEFAULT NULL,
  `av_Droit` varchar(5) DEFAULT NULL,
  `Droit_Sco` varchar(5) DEFAULT NULL,
  `ID_Ecolage` varchar(255) DEFAULT NULL,
  `ID_Autres` varchar(10) DEFAULT NULL,
  `Id_AS` int(11) NOT NULL,
  `Matr` int(11) NOT NULL,
  `type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID_Journal`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `journal_p`
--

INSERT INTO `journal_p` (`ID_Journal`, `Paiement`, `Date_P`, `Argent`, `add_by`, `Mode_P`, `av_Droit`, `Droit_Sco`, `ID_Ecolage`, `ID_Autres`, `Id_AS`, `Matr`, `type`) VALUES
(1, 'Droit  + oct', '29-06-2022', 40000, 'Marius Hamelien', 'Direct', 'false', 'true', '1', NULL, 2, 1, 'INSCRIPTION'),
(2, 'Droit  + oct + Novembre', '29-06-2022', 40000, 'Marius Hamelien', 'Online', 'false', 'true', '1,2', NULL, 2, 2, 'ECOLAGE'),
(3, 'Avance Droit ', '29-06-2022', 240, 'Marius Hamelien', 'Direct', 'true', 'true', '', NULL, 2, 3, 'AutreFrais'),
(4, 'Avance Droit ', '29-06-2022', 30000, 'Marius Hamelien', 'Direct', 'true', 'true', '', NULL, 2, 4, 'INSCRIPTION'),
(5, 'Droit  + oct', '29-06-2022', 40000, 'Marius Hamelien', 'Direct', 'false', 'true', '1', NULL, 2, 5, 'INSCRIPTION'),
(6, 'Avance Droit ', '29-06-2022', 26000, 'Marius Hamelien', 'Direct', 'true', 'true', '', NULL, 2, 6, 'INSCRIPTION'),
(7, 'Droit  + oct', '29-06-2022', 26000, 'Marius Hamelien', 'Direct', 'false', 'true', '1', NULL, 2, 7, 'INSCRIPTION'),
(8, 'Droit  + oct', '01-07-2022', 80000, 'Marius Hamelien', 'Direct', 'false', 'true', '1', NULL, 2, 8, 'INSCRIPTION'),
(9, 'Droit  + oct + Novembre + Dec', '01-07-2022', 92500, 'Marius Hamelien', 'Direct', 'false', 'true', '1,2,3', NULL, 2, 9, 'INSCRIPTION'),
(10, 'Droit ', '01-07-2022', 64000, 'Marius Hamelien', 'Direct', 'false', 'true', '', NULL, 2, 10, 'INSCRIPTION'),
(11, 'Novembre', '06-07-2022', 18000, 'Marius Hamelien', 'Direct', NULL, 'false', '2', NULL, 2, 8, 'ECOLAGE'),
(12, 'Novembre + Dec + janv', '06-07-2022', 54000, 'Marius Hamelien', 'Direct', NULL, 'false', '2,3,4', NULL, 2, 1, 'ECOLAGE'),
(13, 'Construction', '07-07-2022', 25000, 'Marius Hamelien', 'Direct', NULL, 'false', NULL, '1', 2, 8, 'AutreFrais'),
(14, 'Subvention', '07-07-2022', 10000, 'Marius Hamelien', 'Direct', NULL, 'false', NULL, '2', 2, 3, 'AutreFrais'),
(15, 'Construction + Subvention', '07-07-2022', 35000, 'Marius Hamelien', 'Direct', NULL, 'false', NULL, '1,2', 2, 1, 'AutreFrais'),
(16, 'Construction + Subvention', '07-07-2022', 35000, 'Marius Hamelien', 'Direct', NULL, 'false', NULL, '1,2', 2, 4, 'AutreFrais'),
(17, 'Construction + Subvention', '07-07-2022', 35000, 'Marius Hamelien', 'Direct', NULL, 'false', NULL, '1,2', 2, 5, 'AutreFrais'),
(18, 'Construction + Subvention', '07-07-2022', 35000, 'Marius Hamelien', 'Direct', NULL, 'false', NULL, '1,2', 2, 6, 'AutreFrais'),
(19, 'Construction', '07-07-2022', 25000, 'Marius Hamelien', 'Direct', NULL, 'false', NULL, '1', 2, 3, 'AutreFrais'),
(20, 'Subvention', '07-07-2022', 10000, 'Marius Hamelien', 'Direct', NULL, 'false', NULL, '2', 2, 2, 'AutreFrais'),
(21, 'Droit  + oct', '07-07-2022', 93000, 'Marius Hamelien', 'Direct', 'false', 'true', '1', NULL, 2, 11, 'INSCRIPTION'),
(22, 'Reste du droit', '08-07-2022', 3760, 'Marius Hamelien', 'Direct', 'true', 'true', NULL, NULL, 2, 3, 'INSCRIPTION'),
(23, 'Reste du droit', '08-07-2022', 60000, 'Marius Hamelien', 'Direct', 'true', 'true', NULL, NULL, 2, 3, 'INSCRIPTION'),
(24, 'Reste du droit', '10-07-2022', 47000, 'Marius Hamelien', 'Direct', 'true', 'true', NULL, NULL, 2, 6, 'INSCRIPTION');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
CREATE TABLE IF NOT EXISTS `login` (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fonction` varchar(30) DEFAULT NULL,
  `type` enum('Admin','User') DEFAULT NULL,
  `Path` varchar(255) DEFAULT NULL,
  `CoverPhoto` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`id`, `username`, `email`, `password`, `fonction`, `type`, `Path`, `CoverPhoto`) VALUES
(1, 'Marsihay', 'marius@gmail.com', '$2a$10$qA4bmVYQVNUsmaS8GxaaPOv21osx42hpUmVb2MeQnr/Rms7rQC9oG', 'Prof Algo test', 'Admin', 'uploads/file-1651494137876.jpg', ''),
(2, 'Marius Hamelien', 'marius01@gmail.com', '$2a$10$60Mn.2Bxfo3FsdZvuZksBeJAi8hwBHM4i54U4WJ0ibdSqUNm/wE26', 'Developpeur FullStack', 'Admin', 'uploads/profile-1654063648626.jpg', 'uploads/uploadcover-1654063648603.jpg'),
(3, 'Marsihay', 'marius08@gmail.com', '$2a$10$aKCp.3.7lIFKmDCtOtXFyuoKGMBV2ECEnBmpNXVPDA.OQVcqwFHii', 'Prof Algo', 'Admin', 'uploads/file-1651495964906.jpg', '');

-- --------------------------------------------------------

--
-- Table structure for table `mois_ecolage`
--

DROP TABLE IF EXISTS `mois_ecolage`;
CREATE TABLE IF NOT EXISTS `mois_ecolage` (
  `id` int(11) NOT NULL,
  `ID_Eco` int(11) NOT NULL,
  `Label_Eco` varchar(9) DEFAULT NULL,
  `Id_AS` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Id_AS` (`Id_AS`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `mois_ecolage`
--

INSERT INTO `mois_ecolage` (`id`, `ID_Eco`, `Label_Eco`, `Id_AS`) VALUES
(0, 1, 'Septembre', 1),
(1, 2, 'Octobre', 1),
(2, 3, 'Novembre', 1),
(3, 4, 'Décembre', 1),
(4, 5, 'Janvier', 1),
(5, 6, 'Février', 1),
(6, 7, 'Mars', 1),
(7, 8, 'Avril', 1),
(8, 9, 'Mai', 1),
(9, 10, 'Juin', 1),
(10, 11, 'Juillet', 1),
(11, 1, 'oct', 2),
(12, 2, 'Novembre', 2),
(13, 3, 'Dec', 2),
(14, 4, 'janv', 2),
(15, 5, 'Fev', 2),
(16, 6, 'Mars', 2),
(17, 7, 'Avril', 2),
(18, 8, 'Mai', 2),
(19, 9, 'Juin', 2),
(20, 10, 'Juillet', 2),
(21, 11, 'Aout', 2);

-- --------------------------------------------------------

--
-- Table structure for table `niveau`
--

DROP TABLE IF EXISTS `niveau`;
CREATE TABLE IF NOT EXISTS `niveau` (
  `id` int(10) NOT NULL,
  `ID_Niv` int(11) NOT NULL,
  `Label_Niv` varchar(20) NOT NULL,
  `Frais_Sco` double(7,2) NOT NULL,
  `Nb_mois` int(11) NOT NULL,
  `Id_AS` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `niveau`
--

INSERT INTO `niveau` (`id`, `ID_Niv`, `Label_Niv`, `Frais_Sco`, `Nb_mois`, `Id_AS`) VALUES
(1, 2, 'Premiere', 19000.00, 10, 1),
(6, 3, 'Terminale', 20000.00, 11, 1),
(3, 1, 'Seconde', 15500.00, 10, 1),
(9, 3, 'Terminale', 20000.00, 11, 2),
(8, 2, 'Premiere', 19000.00, 10, 2),
(7, 1, 'Seconde', 18000.00, 10, 2);

-- --------------------------------------------------------

--
-- Table structure for table `observation`
--

DROP TABLE IF EXISTS `observation`;
CREATE TABLE IF NOT EXISTS `observation` (
  `ID_Obs` int(11) NOT NULL,
  `Label_Obs` varchar(6) NOT NULL,
  PRIMARY KEY (`ID_Obs`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `observation`
--

INSERT INTO `observation` (`ID_Obs`, `Label_Obs`) VALUES
(1, 'Tsotra'),
(2, 'Z. Kat'),
(3, 'Z. Mp');

-- --------------------------------------------------------

--
-- Table structure for table `parent`
--

DROP TABLE IF EXISTS `parent`;
CREATE TABLE IF NOT EXISTS `parent` (
  `ID_P` int(11) NOT NULL,
  `Nom_P` varchar(30) NOT NULL,
  `Prenom_P` varchar(30) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `Tel_1` varchar(13) DEFAULT NULL,
  `Tel_2` varchar(13) DEFAULT NULL,
  `Tel_3` varchar(13) DEFAULT NULL,
  `mdp` varchar(250) NOT NULL,
  PRIMARY KEY (`ID_P`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `parent`
--

INSERT INTO `parent` (`ID_P`, `Nom_P`, `Prenom_P`, `email`, `Tel_1`, `Tel_2`, `Tel_3`, `mdp`) VALUES
(1, 'Andry', 'Lala', 'lala@gmil.com', '0349660928', '0349660930', '0349660945', '$2a$10$Q8XL3Asz4lpVtNl4Y85heuo6Obr8jfVGTuLI2/oQy4JwFp79Pc69u'),
(2, 'Lalao', 'Mandine', 'lala@gmail.com', '0349660900', '0349660925', '0349660989', '$2a$10$fbKxRIuyR9hJJJWEPo9U7.ZJtISndcOH.oO9I.TKImj.EzG7wurly'),
(3, 'Koto', 'Vao', 'vao@gmail.com', '0349660978', '0349660974', '0349660936', '$2a$10$i.UT2Inp3jiw/yhCOuCzu.lHUzHRD6YBcczbPIbTybKB0pcXmhy.y'),
(4, 'Andry', 'Lala', 'dVdv@gmil.com', '0349660928', '0349660930', '0349660945', '$2a$10$kUmze55rIGQDCrXQgLys3OjtPs/LKFXt9XsTUVHx0qTo7ci2zSoX.'),
(5, 'Lalao', 'Mandine', 'lala@gmail.com', '0349660900', '0349660925', '0349660989', '$2a$10$s6JgLu3cRzQbG7Nryy2mqu3w8PfOy585ny.iQdliYm8w4cX5tNhNe'),
(6, 'Orea', 'Roros', 'Orea@gmail.com', '0349660928', '', '', '$2a$10$F0ZZyGNxsa3faKR9S8BnauoOQ5ACfPE7GjeDDfcLEKik6R7UtT3jO');

-- --------------------------------------------------------

--
-- Table structure for table `parenté`
--

DROP TABLE IF EXISTS `parenté`;
CREATE TABLE IF NOT EXISTS `parenté` (
  `Matr` int(11) NOT NULL,
  `ID_P` int(11) NOT NULL,
  `role` varchar(6) NOT NULL,
  PRIMARY KEY (`Matr`,`ID_P`),
  KEY `ID_P` (`ID_P`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `parenté`
--

INSERT INTO `parenté` (`Matr`, `ID_P`, `role`) VALUES
(1, 1, 'Pere'),
(1, 2, 'Mere'),
(1, 3, 'Tuteur'),
(2, 4, 'Pere'),
(4, 5, 'Mere'),
(8, 6, 'Pere');

-- --------------------------------------------------------

--
-- Table structure for table `payer_autre`
--

DROP TABLE IF EXISTS `payer_autre`;
CREATE TABLE IF NOT EXISTS `payer_autre` (
  `Matr` int(11) NOT NULL,
  `Id_AS` int(11) NOT NULL,
  `ID_autre` int(11) NOT NULL,
  `Date_P` varchar(10) NOT NULL,
  PRIMARY KEY (`Matr`,`Id_AS`,`ID_autre`),
  KEY `Id_AS` (`Id_AS`),
  KEY `ID_autre` (`ID_autre`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `payer_autre`
--

INSERT INTO `payer_autre` (`Matr`, `Id_AS`, `ID_autre`, `Date_P`) VALUES
(8, 2, 1, '07-07-2022'),
(3, 2, 2, '07-07-2022'),
(1, 2, 1, '07-07-2022'),
(1, 2, 2, '07-07-2022'),
(4, 2, 1, '07-07-2022'),
(4, 2, 2, '07-07-2022'),
(5, 2, 1, '07-07-2022'),
(5, 2, 2, '07-07-2022'),
(6, 2, 1, '07-07-2022'),
(6, 2, 2, '07-07-2022'),
(3, 2, 1, '07-07-2022'),
(2, 2, 2, '07-07-2022');

-- --------------------------------------------------------

--
-- Table structure for table `payer_eco`
--

DROP TABLE IF EXISTS `payer_eco`;
CREATE TABLE IF NOT EXISTS `payer_eco` (
  `Matr` int(11) NOT NULL,
  `ID_Eco` int(11) NOT NULL,
  `Id_AS` int(11) NOT NULL,
  `Date_Paiement` varchar(10) NOT NULL,
  PRIMARY KEY (`Matr`,`ID_Eco`,`Id_AS`),
  KEY `ID_Eco` (`ID_Eco`),
  KEY `Id_AS` (`Id_AS`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `payer_eco`
--

INSERT INTO `payer_eco` (`Matr`, `ID_Eco`, `Id_AS`, `Date_Paiement`) VALUES
(1, 1, 2, '29-06-2022'),
(2, 1, 2, '29-06-2022'),
(2, 2, 2, '29-06-2022'),
(5, 1, 2, '30-06-2022'),
(7, 1, 2, '29-06-2022'),
(8, 1, 2, '01-07-2022'),
(9, 1, 2, '01-07-2022'),
(9, 2, 2, '01-07-2022'),
(9, 3, 2, '01-07-2022'),
(1, 2, 2, '06-07-2022'),
(8, 2, 2, '06-07-2022'),
(1, 3, 2, '06-07-2022'),
(1, 4, 2, '06-07-2022'),
(11, 1, 2, '07-07-2022');

-- --------------------------------------------------------

--
-- Table structure for table `peut_inscrire`
--

DROP TABLE IF EXISTS `peut_inscrire`;
CREATE TABLE IF NOT EXISTS `peut_inscrire` (
  `Matr` int(11) NOT NULL,
  `Id_AS` int(11) NOT NULL,
  `ID_Niv` int(11) NOT NULL,
  PRIMARY KEY (`Matr`,`Id_AS`,`ID_Niv`),
  KEY `Id_AS` (`Id_AS`),
  KEY `ID_Niv` (`ID_Niv`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `posseder`
--

DROP TABLE IF EXISTS `posseder`;
CREATE TABLE IF NOT EXISTS `posseder` (
  `Matr_Zandry` int(11) NOT NULL,
  `Matr_Zoky` int(11) NOT NULL,
  PRIMARY KEY (`Matr_Zandry`,`Matr_Zoky`),
  KEY `Matr_Zoky` (`Matr_Zoky`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
