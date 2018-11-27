'use strict';

const Controller = require('egg').Controller;

class ArticleController extends Controller {
	/**
	 * 列表
	 */
	async index() {
		const { ctx } = this;
		const { Op } = this.app.Sequelize;
		const { page = 1, pageSize = 20, keyword = '' } = ctx.query;
		const res = await this.ctx.model.Article.findAndCountAll({
			where: {
				name: {
					[Op.like]: `%${keyword}`
				}
			},
			limit: parseInt(pageSize),
			offset: (parseInt(page) - 1) * pageSize
		});
		this.ctx.body = {
			code: 200,
			data: res,
			msg: '操作成功'
		};
	}
	/**
	 * 创建文章
	 */
	async create() {
		const { ctx } = this;
		const  { name, status, content } = ctx.request.body;
		try {
			const res = await this.ctx.model.Article.create({
				name,
				status,
				content: ctx.helper.escape(content)
			});
			this.ctx.body = {
				code: 200,
				data: res,
				msg: '操作成功'
			};
		} catch (error) {
			this.ctx.body = {
				code: 500,
				data: error,
				msg: '内部异常'
			};
		}
	}
}

module.exports = ArticleController;