'use strict';

const moment = require('moment');

module.exports = app => {
    const { DATE, INTEGER, STRING } = app.Sequelize;

    const Banner = app.model.define('blog_banner', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        desc: {
            type: STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [ 0, 100 ]
            }
        },
        article_id: {
            type: INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        cover: {
            type: STRING(200),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [ 0, 200 ]
            }
        },
        created_at: {
            type: DATE,
            get() {
                return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        updated_at: {
            type: DATE,
            get() {
                return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss')
            }
        }
    })

    return Banner;
}