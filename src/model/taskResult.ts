import { Model, DataTypes, Op } from 'sequelize';
import db from '../db/mysql';

class TaskResult extends Model {
    id: number;
    taskId: string;
    name: string;
    imgList: string;
    errorInfo: string;
    isError: boolean;
    url: string;
    operator: string;
    browser: number;
    variableArr: string;
    type: string;
}
TaskResult.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            comment: '任务名称',
        },
        taskId: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            comment: '任务ID',
        },
        imgList: {
            type: DataTypes.STRING(5000),
            defaultValue: '',
            comment: '图片列表',
        },
        errorInfo: {
            type: DataTypes.STRING(5000),
            defaultValue: '',
            comment: '错误信息',
        },
        isError: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: '执行结果',
        },
        url: {
          type: DataTypes.STRING(1000),
          defaultValue: '',
          comment: '检测地址',
        },
        operator: {
          type: DataTypes.STRING(255),
          defaultValue: '',
          comment: '操作人',
        },
        browser: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          comment: '浏览器类型',
        },
        variableArr: {
          type: DataTypes.JSON,
          defaultValue: false,
          comment: '使用变量',
        },
        type: {
          type: DataTypes.STRING(255),
          defaultValue: '',
          comment: '错误类型',
        },
    },
    {
        sequelize: db,
        freezeTableName: true,
        tableName: 't_fronttask_details',
        indexes: [
            {
                unique: true,
                fields: ['id'],
            },
        ],
    }
);

//强制初始化数据库
// TaskResult.sync({ force: true });

export default {
    sync(force = false) {
        return TaskResult.sync({ force });
    },
    insert: function (model: any) {
        return TaskResult.create(model);
    },
    update(data, id) {
        return TaskResult.update(data, { where: { id } });
    },
    get: function (id: number) {
        return TaskResult.findOne({
            where: {
                id,
            },
        });
    },
    del(id) {
        return TaskResult.destroy({ where: { id } });
    },
    getAll() {
        return TaskResult.findAll();
    },
    getList(pageindex = 0, taskId: string, browser: number) {
        let opts: any = {};
        const pageCount = 15;
        if (taskId != undefined) {
            opts.taskId = taskId;
        }
        if (browser) {
          opts.browser = browser;
        }
        return TaskResult.findAndCountAll({
            where: opts,
            offset: pageindex * pageCount,
            limit: pageCount,
            order: [['createdAt', 'DESC']]
        });
    },
    getAllList(pageindex = 0, name: string, checkTime: Array<Date>, browser: number) {
        let opts: any = {};
        const pageCount = 15;
        if (name) {
          opts.name = {
              [Op.like]: '%' + name + '%',
          };
        }
        if (browser) {
          opts.browser = browser;
        }
        if (checkTime) {
          opts.createdAt = {
            [Op.between]: checkTime
          }
        }

        return TaskResult.findAndCountAll({
            where: opts,
            offset: pageindex * pageCount,
            limit: pageCount,
            order: [['createdAt', 'DESC']]
        });
    },
    findByName(name: string) {
        return TaskResult.findOne({ where: { name } });
    },
};
