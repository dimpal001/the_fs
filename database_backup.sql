-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: c2w_fashion
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AboutUs`
--

DROP TABLE IF EXISTS `AboutUs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AboutUs` (
  `id` int NOT NULL DEFAULT '1',
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AboutUs`
--

LOCK TABLES `AboutUs` WRITE;
/*!40000 ALTER TABLE `AboutUs` DISABLE KEYS */;
INSERT INTO `AboutUs` VALUES (1,'<h2><strong>What is Lorem Ipsum?</strong></h2><p>Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p><br></p><h2><strong>Why do we use it?</strong></h2><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p><p><br></p><h2><strong>Where does it come from?</strong></h2><p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \\\\\\\\\\\\\\\"de Finibus Bonorum et Malorum\\\\\\\\\\\\\\\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. </p>','2024-10-14 09:00:26','2024-10-16 05:33:49');
/*!40000 ALTER TABLE `AboutUs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BlogPosts`
--

DROP TABLE IF EXISTS `BlogPosts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BlogPosts` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `title` varchar(255) NOT NULL,
  `content` text,
  `author_id` varchar(36) DEFAULT NULL,
  `category_ids` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('draft','pending','approve','reject','deactivated') DEFAULT 'draft',
  `reject_note` text,
  `tags` json DEFAULT NULL,
  `views` int DEFAULT '0',
  `isHeroPost` tinyint(1) DEFAULT '0',
  `likes` int DEFAULT '0',
  `slug` varchar(255) DEFAULT NULL,
  `replies` int DEFAULT '0',
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `BlogPosts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BlogPosts`
--

LOCK TABLES `BlogPosts` WRITE;
/*!40000 ALTER TABLE `BlogPosts` DISABLE KEYS */;
INSERT INTO `BlogPosts` VALUES ('1a7990b8-8309-11ef-a65f-302432e1fa78','This is the title of my blog post 2','<h2><strong>What is Lorem Ipsum?</strong></h2><p class=\"ql-align-justify\"><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p class=\"ql-align-justify\"><br></p><h2><strong>Why do we use it?</strong></h2><p class=\"ql-align-justify\">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p><p><br></p><h2><strong>Where does it come from?</strong></h2><p class=\"ql-align-justify\">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><br></p>','0ac58122-821b-11ef-a74c-302432e1fa78','[\"059c9919-82d3-11ef-a65f-302432e1fa78\", \"08ae1d63-82cf-11ef-a65f-302432e1fa78\"]','2024-10-05 11:00:59','2024-10-17 17:55:16','approve',NULL,'[]',0,1,0,'this-is-the-title-of-my-blog-post-2',0,NULL),('3cd5a071-83bf-11ef-bb0a-302432e1fa78','This is the title of my blog post 3','<h2><strong>What is Lorem Ipsum?</strong></h2><p class=\"ql-align-justify\"><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p class=\"ql-align-justify\"><br></p><h2><strong>Why do we use it?</strong></h2><p class=\"ql-align-justify\">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p><p><br></p><h2><strong>Where does it come from?</strong></h2><p class=\"ql-align-justify\">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><br></p><p><br></p>','0ac58122-821b-11ef-a74c-302432e1fa78','[\"08ae1d63-82cf-11ef-a65f-302432e1fa78\", \"059c9919-82d3-11ef-a65f-302432e1fa78\"]','2024-10-06 08:44:45','2024-10-18 11:11:31','approve',NULL,'[\"tag1\", \"tag2\", \"tag3\"]',31,1,3,'this-is-the-title-of-my-blog-post-3',0,NULL),('bcd02bf4-830c-11ef-a65f-302432e1fa78','Second post','<p><strong>Lorem Ipsum&nbsp;is simply dummy text </strong>of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p><br></p><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). </p><p><br></p><p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc. </p><p><br></p><p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin <strong>professor at Hampden-Sydney</strong> College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.</p><p><br></p><p> The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham. <br><br></p>','0ac58122-821b-11ef-a74c-302432e1fa78','[]','2024-10-05 11:27:00','2024-10-17 17:55:16','approve',NULL,NULL,0,1,0,'second-post',0,NULL),('d416ac27-82fd-11ef-a65f-302432e1fa78','This is the title of my blog post 5','<h2><strong>What is Lorem Ipsum?</strong></h2><p class=\"ql-align-justify\"><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p class=\"ql-align-justify\"><br></p><h2><strong>Why do we use it?</strong></h2><p class=\"ql-align-justify\">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p><p><br></p><h2><strong>Where does it come from?</strong></h2><p class=\"ql-align-justify\">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><br></p>','0ac58122-821b-11ef-a74c-302432e1fa78','[\"c813db80-82d3-11ef-a65f-302432e1fa78\", \"059c9919-82d3-11ef-a65f-302432e1fa78\", \"08ae1d63-82cf-11ef-a65f-302432e1fa78\"]','2024-10-05 09:40:17','2024-10-18 11:11:48','approve',NULL,'[\"tag1\", \"tag2\", \"tag3\"]',1,0,1,'this-is-the-title-of-my-blog-post-5',0,NULL),('e1955b0c-8a10-11ef-ad1a-302432e1fa78','This is the title of the post 1','<p class=\"ql-align-justify\"><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p class=\"ql-align-justify\"><br></p><h2><strong>Why do we use it?</strong></h2><p class=\"ql-align-justify\">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p><p><br></p>','c5d7b002-8237-11ef-a74c-302432e1fa78','[\"059c9919-82d3-11ef-a65f-302432e1fa78\", \"08ae1d63-82cf-11ef-a65f-302432e1fa78\"]','2024-10-14 09:44:18','2024-10-18 09:15:10','approve',NULL,'[\"tag1\", \"tag2\"]',20,0,0,'this-is-the-title-of-the-post-1',0,NULL),('f1c4ce39-8316-11ef-a65f-302432e1fa78','This is the title of my blog post 1','<h2><strong>What is Lorem Ipsum?</strong></h2><p class=\"ql-align-justify\"><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p class=\"ql-align-justify\"><br></p><h2><strong>Why do we use it?</strong></h2><p class=\"ql-align-justify\">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p><p><br></p><h2><strong>Where does it come from?</strong></h2><p class=\"ql-align-justify\">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><br></p><p><br></p>','c5d7b002-8237-11ef-a74c-302432e1fa78','[\"8c7390d9-82d5-11ef-a65f-302432e1fa78\", \"c813db80-82d3-11ef-a65f-302432e1fa78\"]','2024-10-05 12:40:04','2024-10-18 10:31:32','approve',NULL,'[]',33,1,2,'this-is-the-title-of-my-blog-post-1',0,NULL);
/*!40000 ALTER TABLE `BlogPosts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categories` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES ('059c9919-82d3-11ef-a65f-302432e1fa78','first new','2024-10-05 04:33:51'),('08ae1d63-82cf-11ef-a65f-302432e1fa78','second','2024-10-05 04:05:18'),('8c7390d9-82d5-11ef-a65f-302432e1fa78','first','2024-10-05 04:51:56'),('c813db80-82d3-11ef-a65f-302432e1fa78','third','2024-10-05 04:39:17');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Followers`
--

DROP TABLE IF EXISTS `Followers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Followers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `follower_id` char(36) NOT NULL,
  `following_id` char(36) NOT NULL,
  `followed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `follower_id` (`follower_id`,`following_id`),
  KEY `following_id` (`following_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Followers`
--

LOCK TABLES `Followers` WRITE;
/*!40000 ALTER TABLE `Followers` DISABLE KEYS */;
INSERT INTO `Followers` VALUES (5,'0ac58122-821b-11ef-a74c-302432e1fa78','c5d7b002-8237-11ef-a74c-302432e1fa78','2024-10-18 07:00:45');
/*!40000 ALTER TABLE `Followers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HeroPosts`
--

DROP TABLE IF EXISTS `HeroPosts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HeroPosts` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `blog_post_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `blog_post_id` (`blog_post_id`),
  CONSTRAINT `HeroPosts_ibfk_1` FOREIGN KEY (`blog_post_id`) REFERENCES `BlogPosts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HeroPosts`
--

LOCK TABLES `HeroPosts` WRITE;
/*!40000 ALTER TABLE `HeroPosts` DISABLE KEYS */;
INSERT INTO `HeroPosts` VALUES ('ae98d9e6-8bb8-11ef-82c4-302432e1fa78','3cd5a071-83bf-11ef-bb0a-302432e1fa78'),('1c78c5b2-8bb9-11ef-82c4-302432e1fa78','f1c4ce39-8316-11ef-a65f-302432e1fa78');
/*!40000 ALTER TABLE `HeroPosts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Likes`
--

DROP TABLE IF EXISTS `Likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Likes` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) NOT NULL,
  `blog_post_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`blog_post_id`),
  KEY `blog_post_id` (`blog_post_id`),
  CONSTRAINT `Likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`),
  CONSTRAINT `Likes_ibfk_2` FOREIGN KEY (`blog_post_id`) REFERENCES `BlogPosts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Likes`
--

LOCK TABLES `Likes` WRITE;
/*!40000 ALTER TABLE `Likes` DISABLE KEYS */;
INSERT INTO `Likes` VALUES ('01b8daab-8d30-11ef-ab83-302432e1fa78','0ac58122-821b-11ef-a74c-302432e1fa78','3cd5a071-83bf-11ef-bb0a-302432e1fa78'),('c4b8c6dd-8d41-11ef-ab83-302432e1fa78','0ac58122-821b-11ef-a74c-302432e1fa78','d416ac27-82fd-11ef-a65f-302432e1fa78'),('87d3cb33-8d31-11ef-ab83-302432e1fa78','0ac58122-821b-11ef-a74c-302432e1fa78','f1c4ce39-8316-11ef-a65f-302432e1fa78'),('2aff51b2-8d3d-11ef-ab83-302432e1fa78','b7e0aac8-8ad6-11ef-8090-302432e1fa78','3cd5a071-83bf-11ef-bb0a-302432e1fa78');
/*!40000 ALTER TABLE `Likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PrivacyPolicy`
--

DROP TABLE IF EXISTS `PrivacyPolicy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PrivacyPolicy` (
  `id` int NOT NULL DEFAULT '1',
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PrivacyPolicy`
--

LOCK TABLES `PrivacyPolicy` WRITE;
/*!40000 ALTER TABLE `PrivacyPolicy` DISABLE KEYS */;
INSERT INTO `PrivacyPolicy` VALUES (1,'<p>At&nbsp;<strong>The Fashion Salad</strong>, safeguarding your privacy is paramount to us. We aim to give you an incredible experience with C2W that you would happily want to share with others. Part of our dedication to you includes respecting and protecting the privacy of the personal information you provide to us. The details below are designed to inform you about the information we collect when you visit or make a purchase from www.clothes2wear.in (the “Website”), how we use it, how we keep it secure, and how you can contact us if you have any questions or concerns. We have accepted that you have agreed to use our website\'s services after reading our policies thoroughly and thereby agreeing to adhere with them and proceed further.</p><p>&nbsp;</p><p><strong>1. Data That We Gather</strong></p><p>Your name, phone number, email address, billing and shipping addresses, payment information, account information, and preferences are among the personal details you provide us with. Usually, whether you make an order, register for our newsletter, create an account, or get in touch with customer service, we get this data. Furthermore, by using cookies and other similar technologies, we automatically gather some information about how you use our web services. IP address, operating system, browser type, browsing habits, and past purchases are a few examples of this. This information helps us give you a better shopping experience in addition to helping us understand how you use our website.</p><p>&nbsp;</p><p><strong>2. Information Gathering Methods</strong></p><p><strong>• Directly from You:</strong>&nbsp;When you use our website or customer service, we obtain information from you directly. This covers the data you enter while creating an account, placing an order, and corresponding with us.</p><p><strong>• Automatically:</strong>&nbsp;We gather data about your online activities and browsing habits automatically through the use of cookies and other monitoring technologies. We place small files called cookies on your device so we can monitor your usage patterns and store your preferences.</p><p>&nbsp;<strong>• From Third Parties:</strong>&nbsp;We might get your information from other parties, like payment processors, social media sites, and other partners. By using this data, we can better serve you and modify our options to suit your needs.</p><p>&nbsp;</p><p><strong>3.Utilization of Private</strong></p><p>Data We utilize your personal information for a number of reasons to make sure you get the best experience possible. These purposes include:</p><p>&nbsp;<strong>•&nbsp;Providing and Customizing Our Services:</strong>&nbsp;Order processing, account management, and customized shopping are all done with the use of your information. This includes suggestions made in accordance with your prior purchases and preferences.</p><p>&nbsp;<strong>•&nbsp;Handling Orders and Payments:</strong>&nbsp;To ensure secure transaction processing, we utilize your payment details. In order to stay in touch with you regarding your orders and to send you progress updates, we also use your contact information.</p><p>&nbsp;<strong>• Customer Interaction:</strong>&nbsp;We may reach out using your contact information to discuss orders, answer questions, and assist with customer service.</p><p>&nbsp;<strong>•&nbsp;Marketing and Promotional Activities:</strong>&nbsp;We may send you marketing messages about new products, exclusive deals, and promotions with your consent. Removing yourself from these messages is always free to do.</p><p><strong>•&nbsp;Conducting Market Research and Surveys:</strong>&nbsp;In order to help us improve our goods and services, we can ask you to take part in surveys or offer feedback. We utilize the information you provide for internal analysis and research.</p><p><strong>•&nbsp;Providing Security and Preventing Fraud:</strong>&nbsp;We utilize the information you provide us to safeguard user security and prevent fraudulent activity on our website and services.</p><p><strong>•&nbsp;Adhering to Legal Standards:</strong>&nbsp;We may process your information to meet legal obligations and address lawful requests from government entities.</p><p>&nbsp;</p><p><strong>4. Cookies and Associated:</strong>&nbsp;Technologies to enhance your online experience, store your preferences, and compile anonymous usage data, we employ cookies. On your gadget, little records known as cookies are downloaded when you visit the site. They enable us to better personalize our content to your interests and assist us in understanding how you use our website.</p><p><br></p><p><br></p>','2024-10-14 09:21:38','2024-10-14 09:25:45');
/*!40000 ALTER TABLE `PrivacyPolicy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Replies`
--

DROP TABLE IF EXISTS `Replies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Replies` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `blog_post_id` char(36) NOT NULL,
  `reply_to_id` char(36) DEFAULT NULL,
  `author_id` char(36) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `is_approved` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `likes` int DEFAULT NULL,
  `dislikes` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `blog_post_id` (`blog_post_id`),
  KEY `reply_to_id` (`reply_to_id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `Replies_ibfk_1` FOREIGN KEY (`blog_post_id`) REFERENCES `BlogPosts` (`id`),
  CONSTRAINT `Replies_ibfk_2` FOREIGN KEY (`reply_to_id`) REFERENCES `Replies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Replies_ibfk_3` FOREIGN KEY (`author_id`) REFERENCES `Users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Replies`
--

LOCK TABLES `Replies` WRITE;
/*!40000 ALTER TABLE `Replies` DISABLE KEYS */;
INSERT INTO `Replies` VALUES ('4bba225b-8c84-11ef-ab50-302432e1fa78','f1c4ce39-8316-11ef-a65f-302432e1fa78','fae41588-8c6e-11ef-ab50-302432e1fa78','c5d7b002-8237-11ef-a74c-302432e1fa78',NULL,NULL,'reply to reply',1,'2024-10-17 12:35:30',NULL,NULL),('4dbdf793-8c6e-11ef-ab50-302432e1fa78','f1c4ce39-8316-11ef-a65f-302432e1fa78',NULL,NULL,'Anonymous',NULL,'nskf',0,'2024-10-17 09:58:05',NULL,NULL),('b3446e0d-8c7d-11ef-ab50-302432e1fa78','f1c4ce39-8316-11ef-a65f-302432e1fa78',NULL,'c5d7b002-8237-11ef-a74c-302432e1fa78',NULL,'https://dimpaldas.in','best comment ever',1,'2024-10-17 11:48:17',NULL,NULL),('cc1f74af-8d3b-11ef-ab83-302432e1fa78','f1c4ce39-8316-11ef-a65f-302432e1fa78',NULL,'0ac58122-821b-11ef-a74c-302432e1fa78',NULL,'https://dimpaldas.in','Reply to post',1,'2024-10-18 10:29:03',NULL,NULL),('fae41588-8c6e-11ef-ab50-302432e1fa78','f1c4ce39-8316-11ef-a65f-302432e1fa78',NULL,NULL,'Anonymous','https://dimpaldas.in','second link',1,'2024-10-17 10:02:55',NULL,NULL);
/*!40000 ALTER TABLE `Replies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Subscribers`
--

DROP TABLE IF EXISTS `Subscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Subscribers` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Subscribers`
--

LOCK TABLES `Subscribers` WRITE;
/*!40000 ALTER TABLE `Subscribers` DISABLE KEYS */;
INSERT INTO `Subscribers` VALUES ('33891adf-8af3-11ef-8090-302432e1fa78','dimpaldas519@gmail.com'),('6f8a66f3-8ad4-11ef-8090-302432e1fa78','dimpaldas520@gmail.com'),('a7f0919b-856f-11ef-b451-302432e1fa78','dimpaldas.in@gmail.com'),('ba3e7c1a-856f-11ef-b451-302432e1fa78','ashdf@mail.com'),('ef1287b0-8ac9-11ef-8090-302432e1fa78','dimpaldas518@gmail.com');
/*!40000 ALTER TABLE `Subscribers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TermsAndCondition`
--

DROP TABLE IF EXISTS `TermsAndCondition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TermsAndCondition` (
  `id` int NOT NULL DEFAULT '1',
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TermsAndCondition`
--

LOCK TABLES `TermsAndCondition` WRITE;
/*!40000 ALTER TABLE `TermsAndCondition` DISABLE KEYS */;
INSERT INTO `TermsAndCondition` VALUES (1,'<p>By using this site, the user has unreservedly accepted the terms and conditions indicated below and elsewhere on the site.</p><ul><li>When it comes to the products,&nbsp;<strong>C2W&nbsp;</strong>will do our best to fulfill the buyer\'s criteria as mentioned on the order form. However, in the event of uncontrollable circumstances, the website reserves the right, at its sole discretion, to deliver an alternate product; this move should not be interpreted as a sign of poor service.</li></ul><p><br></p><ul><li><strong>C2W&nbsp;</strong>will make every effort to fulfill the delivery requirements regarding the time and date specified by the customer on the order form. However, the customer is not entitled to reimbursement from us in the event that the delivery date is missed for any reason. Orders are fulfilled in accordance with the product details listed on the website.</li></ul><p><br></p><ul><li>The product will be delivered with the necessary care to the person and address indicated on the order form. But this company won\'t be responsible for any losses, lawsuits, or settlements.</li></ul><p><br></p><ul><li>Before using the service, the client is recommended to email us with any questions or concerns they may have about the terms and conditions listed on this page. We will then provide a written confirmation.</li></ul><p><br></p><ul><li><strong>C2W</strong>&nbsp;is the site\'s owner. As such, no content from this or any other website that is licensed, managed, or owned by&nbsp;<strong>C2W</strong>, its sister companies, or other related companies may be copied, repeated, transmitted, uploaded, downloaded, or used in any way for commercial purposes without&nbsp;<strong>C2W&nbsp;</strong>express written consent. Any violation of the aforementioned terms will be regarded as an infringement on the property and copyrights owned by&nbsp;<strong>C2W</strong>, its affiliates, and sister companies.</li></ul><p><br></p><ul><li><strong>C2W</strong>&nbsp;disclaims all liability for any implied or explicit warranties that may be associated with its products or services. The website doesn\'t guarantee that the products or services are error-free, or that any defects will be fixed; it also doesn\'t vouch for the security of the site or server hosting the materials or that it is free of viruses or other harmful elements.</li></ul><p><br></p><ul><li>Under no circumstances will the website be liable for any lost data or revenue, collateral, special, incidental, or significant damages, or any other losses resulting from using or not using the website\'s services or products.</li></ul><p><br></p><ul><li><strong>C2W&nbsp;</strong>shall not be liable to the customer for any loss or harm, and the customer shall reimburse&nbsp;<strong>C2W&nbsp;</strong>for any costs incurred as a result of actions by the customer, including but not limited to negligence and indifference.</li></ul><p><br></p><ul><li>The Guwahati High Court in Guwahati, India, has jurisdiction over all matters of settlement and administration.</li></ul><p><br></p><ul><li>The cost of the goods includes all packing, shipping, service, and other related costs; taxes and customs duties, if any, are not included in the price and are expressed in the invoice amount.</li></ul><p><br></p><ul><li>You are not allowed to use the site or any of its content, in addition to the other restrictions outlined in the Terms and Conditions.</li></ul><p>1. Encourage others to break laws.</p><p>2. Violate any local, state, or national rules or laws.</p><p>3. Provide false or misleading information.</p><p>4. Upload or spread harmful viruses or malicious software.</p><p>5. Violate intellectual property rights.</p><p>6. Harass, insult, or discriminate against others.</p><p>7. Spam, phishing, or engage in deceptive practices.</p><p>8. Use the site for inappropriate or offensive purposes.</p><p>9. Interfere with or evade the site’s security measures.</p><p>If you do any of these things, we can suspend or end your access to the site.</p><p>10. Engage in illegal activities or disregard regulations.</p><p>11. Obtain or observe others\' private information.</p>','2024-10-14 09:32:33','2024-10-14 09:39:53');
/*!40000 ALTER TABLE `TermsAndCondition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','guest') NOT NULL DEFAULT 'guest',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `name` text,
  `otp` varchar(6) DEFAULT NULL,
  `isVerified` tinyint(1) DEFAULT '0',
  `otp_expiration` datetime DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES ('0ac58122-821b-11ef-a74c-302432e1fa78','dimpal','$2a$10$VTTmRz86bmqJgnq8VxxG8eyIUGcB0ypPRxPw0ORXKRoHxvWrc9n5i','guest','2024-10-04 06:36:52','2024-10-18 04:31:27',1,'Dimpal',NULL,0,NULL,'0ac58122-821b-11ef-a74c-302432e1fa78',NULL),('b7e0aac8-8ad6-11ef-8090-302432e1fa78','dimpaldas519@gmail.com','$2a$10$uxxPTTwld7jhcRtzrQ9n8.upGmX5khzZ6gBaQoFtipGOBxXVN7e2e','guest','2024-10-15 09:20:28','2024-10-18 10:34:39',1,NULL,NULL,1,NULL,'b7e0aac8-8ad6-11ef-8090-302432e1fa78',NULL),('c5d7b002-8237-11ef-a74c-302432e1fa78','admin','$2a$10$R1WN5HymUEacEvm.0whmYObqkzM95vRMmsY0mJZdh1IXa57NNF0BW','admin','2024-10-04 10:02:32','2024-10-18 04:31:27',1,'Admin',NULL,0,NULL,'c5d7b002-8237-11ef-a74c-302432e1fa78',NULL);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-19 10:01:26
