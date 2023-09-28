import { Model, DataTypes, Op } from 'sequelize';
import db from '../db/mysql';

class Task extends Model {
    id: number;
    taskId: string;
    name: string;
    state: number;
    title: string;
    url: string;
    time: string;
    operator: string;
    checkState: number;
    browser: number;
    failureReason: string;
    groupingId: string;
    variableArr: string;
    variable: string;
}
Task.init(
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
        operator: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            comment: '操作人',
        },
        url: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            comment: 'url',
        },
        time: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            comment: '执行时间',
        },
        failureReason: {
            type: DataTypes.STRING(500),
            defaultValue: '',
            comment: '失败原因',
        },
        state: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            comment: '状态',
        },
        checkState: {
            type: DataTypes.TINYINT,
            defaultValue: 3,
            comment: '执行状态',
        },
        browser: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            comment: '浏览器类型',
        },
        groupingId: {
            type: DataTypes.STRING(20),
            defaultValue: '',
            comment: '分组ID',
        },
        variableArr: {
            type: DataTypes.JSON,
            defaultValue: false,
            comment: '使用变量',
        },
        variable: {
            type: DataTypes.JSON,
            defaultValue: false,
            comment: '使用变量id',
        },
    },
    {
        sequelize: db,
        freezeTableName: true,
        tableName: 't_frontTask',
        indexes: [
            {
                unique: true,
                fields: ['id', 'taskId'],
            },
        ],
    }
);

//强制初始化数据库
// Task.sync({ force: true });

export default {
    sync(force = false) {
        return Task.sync({ force });
    },
    insert: function (model: any) {
        return Task.create(model);
    },
    bulkCreate: function (model: any) {
        return Task.bulkCreate(model);
    },
    update(data, id) {
        return Task.update(data, { where: { id } });
    },
    get: function (id: number) {
        return Task.findOne({
            where: {
                id,
            },
        });
    },
    del(id) {
        return Task.destroy({ where: { id } });
    },
    getAll() {
        return Task.findAll();
    },
    getList(pageindex = 0, name?: string, state?: number) {
        let opts: any = {};
        const pageCount = 15;
        if (name) {
            opts.name = {
                [Op.like]: '%' + name + '%',
            };
        }
        if (state != undefined) {
            opts.state = state;
        }
        return Task.findAndCountAll({
            where: opts,
            offset: pageindex * pageCount,
            limit: pageCount,
        });
    },
    findByName(name: string) {
        return Task.findOne({ where: { name } });
    },
    findByTaskId(taskId: string) {
        return Task.findOne({ where: { taskId } });
    },
};
