import { Model, DataTypes, Op } from 'sequelize';
import db from '../db/mysql';

class TaskResult extends Model {
    id: number;
    taskId: string;
    name: string;
    imgList: string;
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
    getList(pageindex = 0, taskId?: string) {
        let opts: any = {};
        const pageCount = 15;
        if (taskId != undefined) {
            opts.taskId = taskId;
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
