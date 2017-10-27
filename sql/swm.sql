/*
Navicat MySQL Data Transfer

Source Server         : admin
Source Server Version : 50711
Source Host           : localhost:3306
Source Database       : swm

Target Server Type    : MYSQL
Target Server Version : 50711
File Encoding         : 65001

Date: 2017-10-27 12:01:49
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for integraltransaction
-- ----------------------------
DROP TABLE IF EXISTS `integraltransaction`;
CREATE TABLE `integraltransaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transaccount` varchar(30) DEFAULT NULL,
  `transtime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `transintegral` int(11) DEFAULT NULL,
  `balance` int(11) DEFAULT NULL,
  `transkind` int(11) DEFAULT NULL,
  `remarks` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of integraltransaction
-- ----------------------------

-- ----------------------------
-- Table structure for moneytransaction
-- ----------------------------
DROP TABLE IF EXISTS `moneytransaction`;
CREATE TABLE `moneytransaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transaccount` varchar(30) DEFAULT NULL,
  `transtime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `transamount` decimal(20,2) DEFAULT NULL,
  `balance` decimal(20,2) DEFAULT NULL,
  `transkind` int(11) DEFAULT NULL,
  `remarks` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of moneytransaction
-- ----------------------------

-- ----------------------------
-- Table structure for queue
-- ----------------------------
DROP TABLE IF EXISTS `queue`;
CREATE TABLE `queue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `machineid` int(11) DEFAULT NULL,
  `account` varchar(30) DEFAULT NULL,
  `starttime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `endtime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of queue
-- ----------------------------

-- ----------------------------
-- Table structure for stuinfo
-- ----------------------------
DROP TABLE IF EXISTS `stuinfo`;
CREATE TABLE `stuinfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentnumber` varchar(30) DEFAULT NULL,
  `name` varchar(30) DEFAULT NULL,
  `gender` int(11) DEFAULT NULL,
  `mphone` varchar(15) DEFAULT NULL,
  `dormid` int(11) DEFAULT NULL,
  `balance` decimal(20,2) NOT NULL DEFAULT '0.00',
  `credit` int(11) NOT NULL DEFAULT '100',
  `integral` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of stuinfo
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(30) NOT NULL,
  `password` varchar(50) NOT NULL,
  `salt` varchar(50) NOT NULL,
  `avatar` varchar(60) NOT NULL,
  `category` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------

-- ----------------------------
-- Table structure for washmachine
-- ----------------------------
DROP TABLE IF EXISTS `washmachine`;
CREATE TABLE `washmachine` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `machineid` int(11) NOT NULL,
  `dormid` int(11) NOT NULL,
  `state` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of washmachine
-- ----------------------------
