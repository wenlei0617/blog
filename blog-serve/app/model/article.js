'use strict';

const moment = require('moment');

module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;

    const Article = app.model.define('blog_article', {
        id: { 
            type: INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        name: {
            type: STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        thumbs_up: {
            type: INTEGER,
            isInt: true
        },
        status: {
            type: ENUM(0 ,1 ,2),
            validate: {
                isIn: [[0,1,2,'0','1','2']]
            },
            set(val) {
                this.setDataValue('status', parseInt(val))
            }
        },
        content: {
            type: TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        created_at: {
            type: DATE,
            get() {
                const time = this.getDataValue('created_at');
                const gtime = moment(time).utc().format('YYYY-MM-DD HH:mm:ss');
                return gtime;
            },
        },
        updated_at: {
            type: DATE,
            get() {
                return moment(this.getDataValue('updated_at')).utc().format('YYYY-MM-DD HH:mm:ss')
            }
        }
    }, {
        getterMethods: {
            status_name() {
                const status = this.getDataValue('status');
                let statusName;
                switch (status) {
                    case 0:
                        statusName = '草稿';
                        break;
                    case 1:
                        statusName = '发布';
                        break;
                    case 2:
                        statusName = '下架';
                        break;
                    default:
                        statusName = '';
                        break;
                }
                return statusName;
            }
        }
    });

    return Article;
}