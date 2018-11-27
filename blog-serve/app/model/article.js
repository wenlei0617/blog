'use strict';

module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;

    const Article = app.model.define('blog_article', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: {
            type: STRING(50),
            allowNull: false,
            validate: {
                customFun(val) {
                    if(val.length >= 50) {
                        throw new Error('name字段长度过长')
                    }
                }
            }
        },
        thumbs_up: {
            type: INTEGER,
            isInt: true
        },
        status: {
            type: ENUM(0 ,1 ,2),
            get() {
                const status = this.getDataValue('status');
                switch (status) {
                    case 0:
                        return '草稿';
                    case 1:
                        return '发布';
                    case 2:
                        return '下架';
                    default:
                        return '';
                }
            }
        },
        content: {
            type: TEXT,
            allowNull: false
        },
        created_at: DATE,
        updated_at: DATE
    });

    return Article;
}