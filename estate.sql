/*
Navicat MySQL Data Transfer

Source Server         : mysql
Source Server Version : 50634
Source Host           : 127.0.0.1:3306
Source Database       : estate

Target Server Type    : MYSQL
Target Server Version : 50634
File Encoding         : 65001

Date: 2018-06-11 10:32:32
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for buildings
-- ----------------------------
DROP TABLE IF EXISTS `buildings`;
CREATE TABLE `buildings` (
  `buildingId` int(11) NOT NULL AUTO_INCREMENT COMMENT '楼宇ID',
  `buildingName` varchar(20) NOT NULL COMMENT '楼宇名称',
  `zoneId` int(11) NOT NULL COMMENT '小区ID',
  `layerCount` int(11) DEFAULT NULL COMMENT '层数',
  `height` decimal(10,0) DEFAULT NULL COMMENT '高度',
  `area` decimal(10,0) DEFAULT NULL COMMENT '建筑面积',
  `buildTime` datetime DEFAULT NULL COMMENT '建成日期',
  `type` varchar(255) DEFAULT NULL COMMENT '楼宇类型',
  `direction` varchar(20) NOT NULL COMMENT '朝向',
  `status` tinyint(4) NOT NULL COMMENT '状态，0正常，1禁用',
  `comment` varchar(255) DEFAULT NULL COMMENT '备注',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `createUser` int(11) NOT NULL COMMENT '创建人员',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `updateUser` int(11) DEFAULT NULL COMMENT '更新人员',
  PRIMARY KEY (`buildingId`),
  KEY `PK_BUILD_ZONE` (`zoneId`),
  KEY `PK_BUILD_USER1` (`createUser`),
  KEY `PK_BUILD_USER2` (`updateUser`),
  CONSTRAINT `PK_BUILD_USER1` FOREIGN KEY (`createUser`) REFERENCES `users` (`userId`) ON UPDATE NO ACTION,
  CONSTRAINT `PK_BUILD_USER2` FOREIGN KEY (`updateUser`) REFERENCES `users` (`userId`) ON UPDATE NO ACTION,
  CONSTRAINT `PK_BUILD_ZONE` FOREIGN KEY (`zoneId`) REFERENCES `zones` (`zoneId`) ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='楼宇表';

-- ----------------------------
-- Records of buildings
-- ----------------------------

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `categoryId` int(11) NOT NULL AUTO_INCREMENT COMMENT '收费类型ID',
  `categoryName` varchar(20) NOT NULL COMMENT '收费类型名称',
  `status` tinyint(4) NOT NULL COMMENT '状态，0正常，1禁用',
  `comment` varchar(255) DEFAULT NULL COMMENT '备注',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `createUser` int(11) NOT NULL COMMENT '创建人员',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `updateUser` int(11) DEFAULT NULL COMMENT '更新人员',
  PRIMARY KEY (`categoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='收费类型表';

-- ----------------------------
-- Records of categories
-- ----------------------------

-- ----------------------------
-- Table structure for companies
-- ----------------------------
DROP TABLE IF EXISTS `companies`;
CREATE TABLE `companies` (
  `companyId` int(11) NOT NULL AUTO_INCREMENT COMMENT '公司ID',
  `companyName` varchar(50) NOT NULL COMMENT '公司名称',
  `contact` varchar(50) DEFAULT NULL COMMENT '联系方式',
  `address` varchar(100) DEFAULT NULL COMMENT '公司地址',
  `email` varchar(30) DEFAULT NULL COMMENT '公司邮箱',
  `legalPerson` varchar(10) DEFAULT NULL COMMENT '公司法人',
  `principal` varchar(10) DEFAULT NULL COMMENT '负责人',
  `status` tinyint(4) NOT NULL COMMENT '状态，0正常，1禁用',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `createUser` int(11) NOT NULL COMMENT '创建人员',
  `updateTime` datetime DEFAULT NULL COMMENT '修改时间',
  `updateUser` int(11) DEFAULT NULL COMMENT '修改人员',
  PRIMARY KEY (`companyId`),
  KEY `PK_COM_USER1` (`createUser`),
  KEY `PK_COM_USER2` (`updateUser`),
  CONSTRAINT `PK_COM_USER1` FOREIGN KEY (`createUser`) REFERENCES `users` (`userId`) ON UPDATE NO ACTION,
  CONSTRAINT `PK_COM_USER2` FOREIGN KEY (`updateUser`) REFERENCES `users` (`userId`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='公司表';

-- ----------------------------
-- Records of companies
-- ----------------------------
INSERT INTO `companies` VALUES ('1', '祥和物业管理有限公司', '0371-123456', '河南省郑州市航海路200号', 'xxx@63.com', '李四', '张三', '0', '2018-06-04 16:35:55', '1', null, null);

-- ----------------------------
-- Table structure for houses
-- ----------------------------
DROP TABLE IF EXISTS `houses`;
CREATE TABLE `houses` (
  `houseId` int(11) NOT NULL AUTO_INCREMENT COMMENT '房间ID',
  `houseName` varchar(20) NOT NULL COMMENT '房间名称',
  `buildingId` int(11) NOT NULL COMMENT '楼宇ID',
  `order` tinyint(11) NOT NULL COMMENT '单元',
  `layer` tinyint(11) NOT NULL COMMENT '楼层',
  `sno` tinyint(11) NOT NULL COMMENT '房号',
  `direction` varchar(20) NOT NULL COMMENT '朝向',
  `area` decimal(10,0) DEFAULT NULL COMMENT '房屋面积',
  `owner` varchar(255) DEFAULT NULL COMMENT '业主姓名',
  `ownerCard` varchar(255) DEFAULT NULL COMMENT '业主身份证',
  `contact` varchar(255) DEFAULT NULL COMMENT '业主联系电话',
  `giveTime` datetime DEFAULT NULL COMMENT '交房时间',
  `status` tinyint(4) NOT NULL COMMENT '状态，0正常，1禁用',
  `comment` varchar(255) DEFAULT NULL COMMENT '备注',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `createUser` int(11) NOT NULL COMMENT '创建人员',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `updateUser` int(11) DEFAULT NULL COMMENT '更新人员',
  PRIMARY KEY (`houseId`),
  KEY `PK_HOUSE_BUILD` (`buildingId`),
  KEY `PK_HOUSE_USER1` (`createUser`),
  KEY `PK_HOUSE_USER2` (`updateUser`),
  CONSTRAINT `PK_HOUSE_BUILD` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`buildingId`) ON UPDATE NO ACTION,
  CONSTRAINT `PK_HOUSE_USER1` FOREIGN KEY (`createUser`) REFERENCES `users` (`userId`) ON UPDATE NO ACTION,
  CONSTRAINT `PK_HOUSE_USER2` FOREIGN KEY (`updateUser`) REFERENCES `users` (`userId`) ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='房间信息表';

-- ----------------------------
-- Records of houses
-- ----------------------------

-- ----------------------------
-- Table structure for peripherals
-- ----------------------------
DROP TABLE IF EXISTS `peripherals`;
CREATE TABLE `peripherals` (
  `peripheralId` int(11) NOT NULL AUTO_INCREMENT COMMENT '周边设施ID',
  `peripheralName` varchar(255) NOT NULL COMMENT '设施名称',
  `zoneId` int(11) NOT NULL COMMENT '小区Id',
  `principal` varchar(255) DEFAULT NULL COMMENT '联系人',
  `contact` varchar(255) DEFAULT NULL COMMENT '联系人电话',
  `comment` varchar(255) DEFAULT NULL,
  `status` tinyint(4) NOT NULL COMMENT '状态，0正常，1禁用',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `createUser` int(11) NOT NULL COMMENT '创建人员',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `updateUser` int(11) DEFAULT NULL COMMENT '更新人员',
  PRIMARY KEY (`peripheralId`),
  KEY `PK_PER_USER1` (`createUser`),
  KEY `PK_PER_USER2` (`updateUser`),
  KEY `PK_PER_ZONE` (`zoneId`),
  CONSTRAINT `PK_PER_USER1` FOREIGN KEY (`createUser`) REFERENCES `users` (`userId`) ON UPDATE NO ACTION,
  CONSTRAINT `PK_PER_USER2` FOREIGN KEY (`updateUser`) REFERENCES `users` (`userId`) ON UPDATE NO ACTION,
  CONSTRAINT `PK_PER_ZONE` FOREIGN KEY (`zoneId`) REFERENCES `zones` (`zoneId`) ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='周边设施表';

-- ----------------------------
-- Records of peripherals
-- ----------------------------

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `sid` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `session` text COLLATE utf8_unicode_ci NOT NULL,
  `expires` int(11) DEFAULT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sessions
-- ----------------------------
INSERT INTO `sessions` VALUES ('_b2AuhBL2hxjIYM17DarU3T0ltChh_0Z', '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"loginInfo\":{\"userId\":1,\"loginName\":\"admin\",\"email\":null,\"phone\":null,\"userName\":\"管理员\"}}', '0');
INSERT INTO `sessions` VALUES ('-fHWi2iv0skKhQKHotx80GeU-wJc9R97', '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"loginInfo\":{\"userId\":1,\"loginName\":\"admin\",\"email\":null,\"phone\":null,\"userName\":\"管理员\"}}', '0');
INSERT INTO `sessions` VALUES ('2JW6S2lO1HYp51R_uQSHMVu46Lr792F-', '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"loginInfo\":{\"userId\":1,\"loginName\":\"admin\",\"email\":null,\"phone\":null,\"userName\":\"管理员\"}}', '0');
INSERT INTO `sessions` VALUES ('FR3XuX72sCoLuFB_uZIRT8WzpZdeIhI2', '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"loginInfo\":{\"userId\":1,\"loginName\":\"dsh\",\"email\":\"ddy_dhj@163.com\",\"phone\":\"13526878993\",\"userName\":\"管理员\",\"companyId\":1,\"status\":0,\"createTime\":\"2018-05-26T01:13:13.000Z\",\"createUser\":1,\"updateTime\":null,\"updateUser\":null}}', '0');
INSERT INTO `sessions` VALUES ('J-G7Sz6eCb9bZOTkf7XDIfaFhZiGDDRa', '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"loginInfo\":{\"userId\":1,\"loginName\":\"admin\",\"email\":null,\"phone\":null,\"userName\":\"管理员\",\"companyId\":1,\"status\":1,\"createTime\":\"2018-05-26T01:13:13.000Z\",\"createUser\":1,\"updateTime\":null,\"updateUser\":null}}', '0');
INSERT INTO `sessions` VALUES ('JQheaQQoSnul0TwWfJjPsSadr4hGJRWg', '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"loginInfo\":{\"userId\":1,\"loginName\":\"admin\",\"email\":null,\"phone\":null,\"userName\":\"管理员\"}}', '0');
INSERT INTO `sessions` VALUES ('LGsDlz4NC8MvT7fOjtOVCglOP0gBzLFW', '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"loginInfo\":{\"userId\":1,\"loginName\":\"admin\",\"email\":null,\"phone\":null,\"userName\":\"管理员\"}}', '0');
INSERT INTO `sessions` VALUES ('t3EGUnSqTfWF3fYUGB-zTD3XBOp0FFPP', '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"loginInfo\":{\"userId\":1,\"loginName\":\"admin\",\"email\":null,\"phone\":null,\"userName\":\"管理员\"}}', '0');
INSERT INTO `sessions` VALUES ('UFEvGVV93HxwcTxC6zC_jAZ5XSak6fSq', '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"loginInfo\":{\"userId\":1,\"loginName\":\"admin\",\"email\":null,\"phone\":null,\"userName\":\"管理员\"}}', '0');

-- ----------------------------
-- Table structure for tenements
-- ----------------------------
DROP TABLE IF EXISTS `tenements`;
CREATE TABLE `tenements` (
  `tenementId` int(11) NOT NULL AUTO_INCREMENT COMMENT '住户ID',
  `tenementName` varchar(10) NOT NULL COMMENT '住户姓名',
  `houseId` int(11) NOT NULL COMMENT '房间ID',
  `sex` varchar(10) DEFAULT NULL COMMENT '性别',
  `work` varchar(100) DEFAULT NULL COMMENT '单位',
  `card` varchar(20) DEFAULT NULL COMMENT '身份证',
  `status` tinyint(4) NOT NULL COMMENT '状态，0正常，1禁用',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `createUser` int(11) NOT NULL COMMENT '创建人员',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `updateUser` int(11) DEFAULT NULL COMMENT '更新人员',
  PRIMARY KEY (`tenementId`),
  KEY `PK_TENE_HOUSE` (`houseId`),
  KEY `PK_TENE_USER1` (`createUser`),
  KEY `PK_TENE_USER2` (`updateUser`),
  CONSTRAINT `PK_TENE_HOUSE` FOREIGN KEY (`houseId`) REFERENCES `houses` (`houseId`) ON UPDATE NO ACTION,
  CONSTRAINT `PK_TENE_USER1` FOREIGN KEY (`createUser`) REFERENCES `users` (`userId`) ON UPDATE NO ACTION,
  CONSTRAINT `PK_TENE_USER2` FOREIGN KEY (`updateUser`) REFERENCES `users` (`userId`) ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='住户信息表';

-- ----------------------------
-- Records of tenements
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `loginName` varchar(20) NOT NULL COMMENT '用户名',
  `email` varchar(20) DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(15) DEFAULT NULL COMMENT '手机',
  `password` varchar(50) NOT NULL COMMENT '密码',
  `userName` varchar(15) DEFAULT NULL COMMENT '真实姓名',
  `companyId` int(11) NOT NULL COMMENT '公司ID',
  `status` tinyint(4) NOT NULL COMMENT '状态，0正常，1禁用',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `createUser` int(11) NOT NULL COMMENT '创建人员',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `updateUser` int(11) DEFAULT NULL COMMENT '更新人员',
  PRIMARY KEY (`userId`),
  KEY `PK_USER_COM` (`companyId`),
  KEY `PK_USER_USER1` (`createUser`),
  KEY `PK_USER_USER2` (`updateUser`),
  CONSTRAINT `PK_USER_COM` FOREIGN KEY (`companyId`) REFERENCES `companies` (`companyId`) ON UPDATE NO ACTION,
  CONSTRAINT `PK_USER_USER1` FOREIGN KEY (`createUser`) REFERENCES `users` (`userId`) ON UPDATE NO ACTION,
  CONSTRAINT `PK_USER_USER2` FOREIGN KEY (`updateUser`) REFERENCES `users` (`userId`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'dsh', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '0', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('6', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('8', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('9', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('10', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('11', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('12', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('13', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('14', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('15', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('16', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('17', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('18', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('19', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('20', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('21', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('22', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('23', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('24', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('25', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('26', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('27', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('28', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('29', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('30', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '1', '1', '2018-05-26 09:13:13', '1', null, null);
INSERT INTO `users` VALUES ('31', 'admin', 'ddy_dhj@163.com', '13526878993', 'e10adc3949ba59abbe56e057f20f883e', '管理员31', '1', '1', '2018-05-26 09:13:13', '1', null, null);

-- ----------------------------
-- Table structure for zones
-- ----------------------------
DROP TABLE IF EXISTS `zones`;
CREATE TABLE `zones` (
  `zoneId` int(11) NOT NULL AUTO_INCREMENT COMMENT '小区ID',
  `zoneName` varchar(30) NOT NULL COMMENT '小区名称',
  `companyId` int(11) NOT NULL COMMENT '公司ID',
  `principal` varchar(10) DEFAULT NULL COMMENT '小区负责人',
  `contact` varchar(20) DEFAULT NULL COMMENT '负责人电话',
  `address` varchar(100) DEFAULT NULL COMMENT '小区位置',
  `buildTime` datetime DEFAULT NULL COMMENT '建成时间',
  `area` decimal(11,2) DEFAULT NULL COMMENT '小区占地面积',
  `areaStructure` decimal(11,2) DEFAULT NULL COMMENT '建筑面积',
  `areaRoad` decimal(11,2) DEFAULT NULL COMMENT '道路面积',
  `houseCount` tinyint(4) DEFAULT NULL COMMENT '高层楼宇数量',
  `houseCount2` tinyint(4) DEFAULT NULL COMMENT '多层楼宇数量',
  `carCount` tinyint(4) DEFAULT NULL COMMENT '车位数量',
  `areaCar` decimal(11,2) DEFAULT NULL COMMENT '车库面积',
  `areaPublic` decimal(11,2) DEFAULT NULL COMMENT '公共场所面积',
  `areaGreen` decimal(11,2) DEFAULT NULL COMMENT '绿化面积',
  `status` tinyint(4) NOT NULL COMMENT '状态，0正常，1禁用',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `createUser` int(11) NOT NULL COMMENT '创建人员',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `updateUser` int(11) DEFAULT NULL COMMENT '更新人员',
  PRIMARY KEY (`zoneId`),
  KEY `PK_ZONE_COM` (`companyId`),
  KEY `PK_ZONE_USER1` (`createUser`),
  KEY `PK_ZONE_USER2` (`updateUser`),
  CONSTRAINT `PK_ZONE_COM` FOREIGN KEY (`companyId`) REFERENCES `companies` (`companyId`) ON UPDATE NO ACTION,
  CONSTRAINT `PK_ZONE_USER1` FOREIGN KEY (`createUser`) REFERENCES `users` (`userId`) ON UPDATE NO ACTION,
  CONSTRAINT `PK_ZONE_USER2` FOREIGN KEY (`updateUser`) REFERENCES `users` (`userId`) ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='小区表';

-- ----------------------------
-- Records of zones
-- ----------------------------

-- ----------------------------
-- Event structure for sess_cleanup
-- ----------------------------
DROP EVENT IF EXISTS `sess_cleanup`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` EVENT `sess_cleanup` ON SCHEDULE EVERY 15 MINUTE STARTS '2018-06-03 19:56:47' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM `sessions` WHERE id IN (SELECT temp.id FROM (SELECT `id` FROM `sessions` WHERE `expires` > 0 AND `expires` < UNIX_TIMESTAMP()) AS temp)
;;
DELIMITER ;
