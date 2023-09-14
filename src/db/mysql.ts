/**
 * 数据库连接类
 */
import { Sequelize } from 'sequelize';
import config from '../env';
import Log from '../util/log';

interface IDBCONF {
    database: string;
    user: string;
    password: string;
    host: string;
    port: number;
    connectionLimit: number;
}

const dbConfig: IDBCONF = config.db;

const mysqlconnection = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port || 3306,
    dialect: 'mysql',
    pool: {
        max: dbConfig.connectionLimit,
        min: 1,
        idle: 10000,
    },
    retry: {},
});
Log.info('Mysql数据库已启动', dbConfig.host, dbConfig.database, dbConfig.user);
export default mysqlconnection;
