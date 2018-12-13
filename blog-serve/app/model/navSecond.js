'use strict';

module.exports = app => {
    const { INTEGER, STRING } = app.Sequelize;

    const NavSecond = app.model.define('blog_nav_second', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: STRING(10),
            allowNull: false,
            validate: {
                noEmpty: true,
                len: [0, 10]
            }
        },
        path: {
            type: STRING(20),
            allowNull: false,
            validate: {
                noEmpty: true,
                len: [0, 20]
            }
        },
        pid: {
            type: INTEGER,
            allowNull: false,
            validate: {
                noEmpty: true
            }
        }
    }, {
        timestamps: false
    })

    return NavSecond;
}