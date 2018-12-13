'use strict';

const Service = require('egg').Service;

class ConfService extends Service {
    async getNav(role = '') {
        const { app } = this;
        const { Op } = app.Sequelize;
        let where = {};
        if(role) {
            where.id = {
                [Op.in]: role
            }
        }
        const roleList = await app.model.NavFirst.findAll({
            include: [
                {
                    model: app.model.NavSecond,
                    as: 'children',
                    where
                }
            ]
        })

        return roleList;
    }
}

module.exports = ConfService;