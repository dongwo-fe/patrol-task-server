/**
 * 默认配置
 */

module.exports = {
    //开发环境数据库
    db: {
        host: 'rm-2zewax4p34o76e96pjo.mysql.rds.aliyuncs.com',
        port: 3306,
        database: 'auto_config',
        user: 'auto_config',
        password: 'vlW0#rycxoy3eOdBNMwD',
        connectionLimit: 2,
    },
    //开发环境，普通redis配置
    // redis: "redis://127.0.0.1:6379",
    redis: {
        host: 'r-2zehsgru1dykflm58fpd.redis.rds.aliyuncs.com',
        password: 'chaojiap!121213@##!!@a',
    },
    //rabbitmq
    mq: {
        hostname: 'amqp-cn-tl32jcnk0008.mq-amqp.cn-beijing-327844-a.aliyuncs.com',
        username: 'MjphbXFwLWNuLXRsMzJqY25rMDAwODpMVEFJNEdId252SmpBdXRxWU1lemhlRFg=',
        password: 'MTMyMkMyNzVEMDhBQUNBNDBCM0QxRUYxQkQ5RTIyRTA3RjYyQzFFMjoxNjQyOTQzNTcxMTgx',
        vhost: 'auto_config_sit',
    },
    //登录使用的参数
    login: {
        host: 'https://gatewaydev.jrdaimao.com',
        check: 'https://canary.jrdaimao.com/api/auth/check',
    },
    oss: {
        bucket: 'juranapp-test',
    },
};
