'use strict';

const Controller = require('egg').Controller;

class ArticleController extends Controller {
	/**
	 * @api {GET} /article/getList 获取文章列表
	 * @apiName getArticle
	 * @apiGroup Article
	 * @apiVersion  1.0.0
	 * 
	 * @apiParam  {String} page 页数
	 * @apiParam  {String} pageSize 条数
	 * @apiParam  {String} name 标题
	 * @apiParam  {Date} time 日期  YYYY-MM-DD
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
			order: [
				['updated_at', 'DESC']
			],
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
	 * @api {POST} /article/create 文章创建
	 * @apiName create
	 * @apiGroup Article
	 * @apiVersion  1.0.0
	 * 
	 * @apiParam  {String} name 文章名称
	 * @apiParam  {Int} status 状态 0草稿 1发布 2下架
	 * @apiParam  {String} content 文章内容
	 */
	async create() {
		const { ctx, app } = this;
		const  { name, status, content } = ctx.request.body;
		try {
			const res = await app.model.Article.create({
				name,
				status,
				content: ctx.helper.escape(content)
			});
			ctx.body = {
				code: 200,
				data: res,
				msg: '操作成功'
			};
		} catch (error) {
			ctx.body = {
				code: 500,
				data: error,
				msg: '内部异常'
			};
		}
	}
	/**
	 * 
	 * @api {DELETE} /article/delete/:id 删除文章
	 * @apiName deleteArticle
	 * @apiGroup Article
	 * @apiVersion  1.0.0
	 * 
	 * @apiParam  {Int} id 文章ID
	 */
	async delete() {
		const { app, ctx } = this;
		const id = parseInt(ctx.params.id);
		if(!id) {
			ctx.body = {
				code: 10001,
				data: '',
				msg: '参数有误'
			}
			return;
		}
		try {
			await app.model.Article.destroy({
				where: {
					id
				}
			})
			ctx.body = {
				code: 200,
				data: '',
				msg: '删除成功'
			}	
		} catch (error) {
			ctx.body = {
				code: 500,
				data: error,
				msg: '内部异常'
			}
		}
	}
	/** 
	 * @api {post} /article/setStatus/:id 修改文章状态
	 * @apiName setStatus
	 * @apiGroup Article
	 * @apiVersion  1.0.0
	 * 
	 * @apiParam  {String} id 文章ID
	 * @apiParam  {Int} status 文章状态 0草稿 1发布 2下架
	 */
	async setStatus() {
		const { ctx, app } = this;
		const id = parseInt(ctx.params.id);
		const status = ctx.request.body.status;
		try {
			await app.model.Article.update({
				status
			},{
				where: {
					id
				}
			});
			ctx.body = {
				code: 200,
				data: '',
				msg: '操作成功'
			};
		} catch (error) {
			ctx.body = {
				code: 500,
				data: error,
				msg: '内部异常'
			};
		}

	}
}

module.exports = ArticleController;