import { Model, DataTypes, Op } from 'sequelize';
import db from '../db/mysql';

class CodeManger extends Model {
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
CodeManger.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        code: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            comment: 'code码',
        },
        name: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            comment: '展示文案',
        },
        remark: {
            type: DataTypes.TEXT,
            defaultValue: '',
            comment: '备注',
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            comment: '状态',
        },
        state: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            comment: '紧急程度',
        },
        username: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            comment: '修改人',
        },
    },
    {
        sequelize: db,
        freezeTableName: true,
        tableName: 't_code_manger',
        indexes: [
            {
                unique: true,
                fields: ['id', 'status'],
            },
        ],
    }
);

//强制初始化数据库
// CodeManger.sync({ force: true });

export default {
    sync(force = false) {
        return CodeManger.sync({ force });
    },
    insert: function (model: any) {
        return CodeManger.create(model);
    },
    update(data, id) {
        return CodeManger.update(data, { where: { id } });
    },
    get: function (code: string) {
        return CodeManger.findOne({
            where: {
                code,
            },
        });
    },
    del(id) {
        return CodeManger.destroy({ where: { id } });
    },
    getAll() {
        return CodeManger.findAll({ where: { status: 1 }, attributes: ['code', 'name', 'remark', 'state'] });
    },
    getList(pageindex = 0, code?: string, status?: number) {
        let opts: any = {};
        const pageCount = 15;
        if (code) {
            opts.code = {
                [Op.like]: '%' + code + '%',
            };
        }
        if (status != undefined) {
            opts.status = status;
        }
        return CodeManger.findAndCountAll({
            where: opts,
            offset: pageindex * pageCount,
            limit: pageCount,
            order: [['id', 'desc']],
        });
    },
};
