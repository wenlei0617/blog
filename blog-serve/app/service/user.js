'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    async getList(limit, page) {
        const { app } = this;
        const roleList = await app.model.NavSecond.findAll();

        let list = await app.model.User.findAndCountAll({
            offset: (page-1) * limit,
            limit: limit,
            attributes: { exclude: ['token', 'password'] }
        });

        for(let i=0; i<list.rows.length; i++) {
            let role = roleList.filter((item) => {
                return list.rows[i].role.indexOf(item.id) > -1
            });
            role = role.map(i => i.name);
            role = role.toString();
            list.rows[i].role = role;
        }

        return list;
    }

    async getDetail(id) {
        const { app } = this;
        const roleList = await app.model.NavSecond.findAll();
        const user = await app.model.User.findById(id, {
            attributes: { exclude: ['token', 'password'] }
        });
        let role = roleList.filter(item => {
            return user.role.indexOf(item.id) > -1;
        });
        role = role.map(i => i.id);
        role = role.toString();
        user.role = role;

        return user;
    }

    async create({name, account, role}) {
        const { app } = this;
        const isExist = await app.model.User.findOne({
            where: {
                account
            }
        });

        if(isExist) {
            throw({message: '账号已存在', code: 10001, status: 200});
        }

        const user = await app.model.User.create({
            name,
            account,
            role,
            password: '111111'
        });

        return user;
    }

    async update({id, name, account, role}) {
        const { app } = this;
        const { Op } = app.Sequelize;

        const isExist = await app.model.User.findOne({
            where: {
                account,
                id: {
                    [Op.ne]: id
                }
            }
        });

        if(isExist) {
            throw({message: '账号已存在', code: 10001, status: 200})
        }

        const user = await app.model.User.update({
            name,
            account,
            role
        }, {
            where: {
                id
            }
        });

        return user;
    }

    async destroy(id) {
        const { app } = this;
        const result = await app.model.User.destroy({
            where: {
                id
            }
        });

        return result;
    }
}

module.exports = UserService;