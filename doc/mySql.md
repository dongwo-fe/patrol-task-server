CREATE TABLE
    `t_fronttask` (
        `id` int NOT NULL AUTO_INCREMENT,
        `name` varchar(100) DEFAULT '' COMMENT '任务名称',
        `operator` varchar(100) DEFAULT '' COMMENT '操作人',
        `url` varchar(100) DEFAULT '' COMMENT 'url',
        `token` varchar(500) DEFAULT '' COMMENT 'token',
        `time` varchar(100) DEFAULT '' COMMENT '执行时间',
        `state` tinyint DEFAULT '0' COMMENT '状态',
        `createdAt` datetime NOT NULL,
        `updatedAt` datetime NOT NULL,
        `checkState` int DEFAULT '3' COMMENT '检测状态',
        `failureReason` varchar(500) DEFAULT NULL COMMENT '失败原因',
        `taskId` varchar(255) DEFAULT NULL COMMENT '任务ID',
        PRIMARY KEY (`id`),
        UNIQUE KEY `t_front_task_name` (`name`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci


    CREATE TABLE
    `t_fronttask_details` (
        `id` int NOT NULL AUTO_INCREMENT COMMENT '唯一值',
        `create_time` datetime DEFAULT NULL COMMENT 'Create Time',
        `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '任务名称',
        `imgList` varchar(5000) DEFAULT NULL COMMENT '图片地址',
        `taskId` varchar(255) DEFAULT NULL COMMENT '任务id',
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '前端巡检关联表'