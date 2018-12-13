'use strict';

const Service = require('egg').Service;

class BannerService extends Service {
    async index(limit, page) {
        const { app } = this;
        const list = await app.model.Banner.findAndCountAll({
            offset: (page - 1) * limit,
            limit
        });

        return list;
    }

    async show(id) {
        const { app } = this;
        const result = await app.model.Banner.findById(id);

        return result;
    }

    async create({desc, article_id, cover}) {
        const { app } = this;
        const result = await app.model.Banner.create({
            desc,
            article_id,
            cover
        });

        return result;
    }

    async update({id, desc, article_id, cover}) {
        const { app } = this;
        const result = await app.model.Banner.update({
            desc,
            article_id,
            cover
        }, {
            where: {
                id
            }
        });

        return result;
    } 

    async destroy(id) {
        const { app } = this;
        const result = await app.model.Banner.destroy({
            where: {
                id
            }
        });

        return result;
    }
}

module.exports = BannerService;