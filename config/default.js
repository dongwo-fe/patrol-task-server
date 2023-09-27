/**
 * 默认配置
 */

module.exports = {
    //开发环境数据库
    db: {
        host: '59.110.230.100',
        port: 18001,
        database: 'patchhub',
        user: 'patchhub',
        password: 'K8DmHcEmStytwNzK',
        connectionLimit: 2,
    },
    //登录使用的参数
    login: {
        check: 'https://canary.jrdaimao.com/api/auth/check',
    },
    oss: {
        bucket: 'juranapp-test',
    },
};
