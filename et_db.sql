-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 15, 2022 at 08:54 AM
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
  `ID_autre` int(11) NOT NULL,
  `Label_Autre` varchar(50) NOT NULL,
  `cout` double NOT NULL,
  PRIMARY KEY (`ID_autre`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
(1, '2020-2021');

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
  `ID_Droit` int(11) NOT NULL,
  `type` varchar(5) NOT NULL,
  `Label_D` varchar(20) NOT NULL,
  `montant` double(7,2) NOT NULL,
  `Id_AS` int(11) NOT NULL,
  `ID_Niv` int(11) NOT NULL,
  PRIMARY KEY (`ID_Droit`),
  KEY `Id_AS` (`Id_AS`),
  KEY `ID_Niv` (`ID_Niv`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `droit`
--

INSERT INTO `droit` (`ID_Droit`, `type`, `Label_D`, `montant`, `Id_AS`, `ID_Niv`) VALUES
(1, 'false', 'Seconde VAOVAO', 65000.00, 1, 1),
(2, 'true', 'Seconde TRANAINY', 60000.00, 1, 1),
(3, 'false', 'Premiere VAOVAO', 65000.00, 1, 2),
(4, 'true', 'Premiere TRANAINY', 60000.00, 1, 2),
(5, 'false', 'Terminale VAOVAO', 73000.00, 1, 3),
(6, 'true', 'Terminale TRANAINY', 68000.00, 1, 3);

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

-- --------------------------------------------------------

--
-- Table structure for table `inscrire`
--

DROP TABLE IF EXISTS `inscrire`;
CREATE TABLE IF NOT EXISTS `inscrire` (
  `Matr` int(11) NOT NULL,
  `Id_AS` int(11) NOT NULL,
  `ID_Niv` int(11) NOT NULL,
  `Date_insc` date NOT NULL,
  `Ancien` varchar(5) NOT NULL,
  `paye` varchar(5) DEFAULT NULL,
  `peut_inscrire` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`Matr`,`Id_AS`,`ID_Niv`),
  KEY `Id_AS` (`Id_AS`),
  KEY `ID_Niv` (`ID_Niv`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `journal_p`
--

DROP TABLE IF EXISTS `journal_p`;
CREATE TABLE IF NOT EXISTS `journal_p` (
  `ID_Journal` int(11) NOT NULL,
  `Paiement` varchar(100) DEFAULT NULL,
  `Date_P` date DEFAULT NULL,
  `Argent` double DEFAULT NULL,
  `add_by` varchar(50) DEFAULT NULL,
  `Mode_P` varchar(6) DEFAULT NULL,
  `av_Droit` tinyint(1) DEFAULT NULL,
  `Droit_Sco` tinyint(1) DEFAULT NULL,
  `ID_Ecolage` json DEFAULT NULL,
  `ID_Autres` json DEFAULT NULL,
  `Id_AS` int(11) NOT NULL,
  `Matr` int(11) NOT NULL,
  PRIMARY KEY (`ID_Journal`),
  KEY `Id_AS` (`Id_AS`),
  KEY `Matr` (`Matr`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
(3, 'Marsihay', 'marius08@gmail.com', '$2a$10$aKCp.3.7lIFKmDCtOtXFyuoKGMBV2ECEnBmpNXVPDA.OQVcqwFHii', 'Prof Algo', 'User', 'uploads/file-1651495964906.jpg', ''),
(4, 'Marsihay', 'marius02@gmail.com', '$2a$10$UrAxaxvFMWePe0CeQdICvejaR1XJAiCwnUPC6graMglKhCDHeKkBS', 'Directeur', NULL, 'uploads/profile-1653636493663.jpg', 'uploads/uploadcover-1653501031777.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `mois_ecolage`
--

DROP TABLE IF EXISTS `mois_ecolage`;
CREATE TABLE IF NOT EXISTS `mois_ecolage` (
  `ID_Eco` int(11) NOT NULL,
  `Label_Eco` varchar(9) DEFAULT NULL,
  `Id_AS` int(11) NOT NULL,
  PRIMARY KEY (`ID_Eco`),
  KEY `Id_AS` (`Id_AS`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `mois_ecolage`
--

INSERT INTO `mois_ecolage` (`ID_Eco`, `Label_Eco`, `Id_AS`) VALUES
(1, 'Septembre', 1),
(2, 'Octobre', 1),
(3, 'Novembre', 1),
(4, 'Décembre', 1),
(5, 'Janvier', 1),
(6, 'Février', 1),
(7, 'Mars', 1),
(8, 'Avril', 1),
(9, 'Mai', 1),
(10, 'Juin', 1),
(11, 'Juillet', 1);

-- --------------------------------------------------------

--
-- Table structure for table `niveau`
--

DROP TABLE IF EXISTS `niveau`;
CREATE TABLE IF NOT EXISTS `niveau` (
  `ID_Niv` int(11) NOT NULL,
  `Label_Niv` varchar(20) NOT NULL,
  `Frais_Sco` double(7,2) NOT NULL,
  `Nb_mois` int(11) NOT NULL,
  PRIMARY KEY (`ID_Niv`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `niveau`
--

INSERT INTO `niveau` (`ID_Niv`, `Label_Niv`, `Frais_Sco`, `Nb_mois`) VALUES
(1, 'Seconde', 18000.00, 10),
(2, 'Premiere', 19000.00, 10),
(3, 'Terminale', 20000.00, 11);

-- --------------------------------------------------------

--
-- Table structure for table `observatioin`
--

DROP TABLE IF EXISTS `observatioin`;
CREATE TABLE IF NOT EXISTS `observatioin` (
  `ID_Obs` int(11) NOT NULL,
  `Label_Obs` varchar(6) NOT NULL,
  PRIMARY KEY (`ID_Obs`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
  PRIMARY KEY (`ID_P`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `parenté`
--

DROP TABLE IF EXISTS `parenté`;
CREATE TABLE IF NOT EXISTS `parenté` (
  `Matr` int(11) NOT NULL,
  `ID_P` int(11) NOT NULL,
  `role` varchar(5) NOT NULL,
  PRIMARY KEY (`Matr`,`ID_P`),
  KEY `ID_P` (`ID_P`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `payer_autre`
--

DROP TABLE IF EXISTS `payer_autre`;
CREATE TABLE IF NOT EXISTS `payer_autre` (
  `Matr` int(11) NOT NULL,
  `Id_AS` int(11) NOT NULL,
  `ID_autre` int(11) NOT NULL,
  `Date_P` date NOT NULL,
  PRIMARY KEY (`Matr`,`Id_AS`,`ID_autre`),
  KEY `Id_AS` (`Id_AS`),
  KEY `ID_autre` (`ID_autre`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `payer_eco`
--

DROP TABLE IF EXISTS `payer_eco`;
CREATE TABLE IF NOT EXISTS `payer_eco` (
  `Matr` int(11) NOT NULL,
  `ID_Eco` int(11) NOT NULL,
  `Id_AS` int(11) NOT NULL,
  `Date_Paiement` date NOT NULL,
  PRIMARY KEY (`Matr`,`ID_Eco`,`Id_AS`),
  KEY `ID_Eco` (`ID_Eco`),
  KEY `Id_AS` (`Id_AS`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
