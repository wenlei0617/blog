'use strict';

const Controller = require('egg').Controller;

class ArticleController extends Controller {
	/**
	 * 列表
	 */
	async index() {
		const { ctx, app } = this;
		const { Op } = this.app.Sequelize;
		const { page = 1, pageSize = 10, name, status, created_at } = ctx.query;
		let where = {};
		if(name) {
			where.name = {
				[Op.like]: `%${name}`
			}
		}
		if(status) {
			where.status = status;
		}
		if(created_at) {
			where.created_at = {
				[Op.between]: [`${created_at.trim()} 00:00:00`, `${created_at.trim()} 23:59:59`]
			}
		}
		const res = await app.model.Article.findAndCountAll({
			where,
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