'use strict';

const moment = require('moment');

module.exports = app => {
    const { STRING, DATE, INTEGER } = app.Sequelize;

    const User = app.model.define('blog_users', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: STRING(10),
            allowNull: true,
            validate: {
                len: [0, 10]
            }
        },
        account: {
            type: STRING(11),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [ 5, 11 ]
            }
        },
        password: {
            type: STRING(20),
            allowNull: false,
            validate: {
                notEmpty: false,
                len: [ 6, 12 ]
            }
        },
        token: {
            type: STRING,
            allowNull: true
        },
        created_at: {
            type: DATE,
            get() {
                const time = this.getDataValue('created_at');
                const gtime = moment(time).utc().format('YYYY-MM-DD HH:mm:ss');
                return gtime;
            }
        },
        updated_at: {
            type: DATE,
            get() {
                return moment(this.getDataValue('updated_at')).utc().format('YYYY-MM-DD HH:mm:ss');
            }
        }
    });

    return User;
}