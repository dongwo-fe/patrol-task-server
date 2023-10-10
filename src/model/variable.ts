import { Model, DataTypes, Op } from 'sequelize';
import db from '../db/mysql';

class Variable extends Model {
    id: number;
    name: string;
    type: number;
    operator: string;
    key: string;
    value: string;
    cookieDomain: string;
}
Variable.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            comment: '变量名称',
        },
        type: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '变量类型',
        },
        operator: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            comment: '操作人',
        },
        key: {
            type: DataTypes.STRING(100),
            defaultValue: '',
            comment: 'key',
        },
        scripts: {
            type: DataTypes.TEXT,
            comment: 'scripts',
        },
        isScript: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            comment: '是否脚本',
        },
        value: {
            type: DataTypes.STRING(500),
            defaultValue: '',
            comment: 'value',
        },
        cookieDomain: {
            type: DataTypes.STRING(500),
            defaultValue: '',
            comment: 'cookieDomain',
        },
    },
    {
        sequelize: db,
        freezeTableName: true,
        tableName: 't_fronttask_variable',
        indexes: [
            {
                unique: true,
                fields: ['name'],
            },
        ],
    }
);

//强制初始化数据库
// Variable.sync({ force: true });

export default {
    sync(force = false) {
        return Variable.sync({ force });
    },
    insert: function (model: any) {
        return Variable.create(model);
    },
    update(data, id) {
        return Variable.update(data, { where: { id } });
    },
    get: function (id: number) {
        return Variable.findOne({
            where: {
                id,
            },
        });
    },
    del(id) {
        return Variable.destroy({ where: { id } });
    },
    getAll() {
        return Variable.findAll();
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
        return Variable.findAndCountAll({
            where: opts,
            offset: pageindex * pageCount,
            limit: pageCount,
        });
    },
    findByName(name: string) {
        return Variable.findOne({ where: { name } });
    },
    findById(ids?: Array<number>) {
        let opts: any = {};
        opts.id = {
            [Op.in]: ids,
        };
        return Variable.findAll({
            where: opts,
        });
    },
};
