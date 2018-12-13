'use strict';

module.exports = app => {
    const { INTEGER, STRING } = app.Sequelize;

    const NavFirst = app.model.define('blog_nav_first', {
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
        className: {
            field: 'class_name',
            type: STRING(20),
            allowNull: false,
            validate: {
                noEmpty: true,
                len: [0, 20]
            }
        }
    }, {
        timestamps: false
    })

    NavFirst.associate = function() {
        app.model.NavFirst.hasMany(app.model.NavSecond, { foreignKey: 'pid', targetKey: 'id', as: 'children'})
    }

    return NavFirst;
}