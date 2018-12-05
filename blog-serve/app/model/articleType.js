'use strict';

module.exports = app => {
    const { INTEGER, DATE, STRING } = app.Sequelize;

    const ArticleType = app.model.define('blog_article_type', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [0, 100]
            }
        },
        desc: {
            type: STRING(100),
            allowNull: true,
            validate: {
                len: [0, 100]
            }
        }
    }, {
        timestamps: false
    });

    return ArticleType
}