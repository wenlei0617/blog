'use strict';

module.exports = app => {
    const { STRING, INTEGER } = app.Sequelize;

    const WebConfig = app.model.define('blog_config', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        key: {
            type: STRING
        },
        value: {
            type: STRING
        }
    }, {
        timestamps: false
    })

    return WebConfig;
}