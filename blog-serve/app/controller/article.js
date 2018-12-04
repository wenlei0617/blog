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
		const { page = 1, pageSize = 10, name, status, updated_at } = ctx.query;
		let where = {};
		if(name) {
			where.name = {
				[Op.like]: `%${name}`
			}
		}
		if(status) {
			where.status = status;
		}
		if(updated_at) {
			where.updated_at = {
				[Op.between]: [`${updated_at.trim()} 00:00:00`, `${updated_at.trim()} 23:59:59`]
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
	 * @api {POST} /article/createOrUpdate 文章创建或更新
	 * @apiName createOrUpdate
	 * @apiGroup Article
	 * @apiVersion  1.0.0
	 * 
	 * @apiParam  {String} name 文章名称
	 * @apiParam  {Int} status 状态 0草稿 1发布 2下架
	 * @apiParam  {String} content 文章内容
	 * @apiParam  {Int} id 文章id 有ID则更新，无ID则创建
	 */
	async create() {
		const { ctx, app } = this;
		const  { name, status, content, id } = ctx.request.body;
		if(id) {
			await app.model.Article.update({
				name,
				status,
				content: encodeURIComponent(content)
			}, {
				where: {
					id
				}
			})
			ctx.body = {
				code: 200,
				data: '',
				msg: '修改成功'
			}
			return;
		}

		const res = await app.model.Article.create({
			name,
			status,
			content: encodeURIComponent(content)
		});


		res.content = ctx.helper.shtml(decodeURIComponent(res.content));
		ctx.body = {
			code: 200,
			data: res,
			msg: '操作成功'
		};
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
	}
	/**
	 * @api {GET} /article/getDetail/:id 获取文章详情
	 * @apiName getDetail
	 * @apiGroup Article
	 * @apiVersion  1.0.0
	 * 
	 * @apiParam  {String} id 文章ID
	 */
	async getDetail() {
		const { ctx, app } = this;
		const id = parseInt(ctx.params.id);
		if(id) {
			const result = await app.model.Article.findById(id);
			result.content = decodeURIComponent(result.content);
			ctx.body = {
				code: 200,
				data: result,
				msg: ''
			}
			return;
		}
		ctx.body = {
			code: 10001,
			data: '',
			msg: '参数异常'
		}
	}
	/**
	 * 博客首页
	 */
	async render() {
		const { ctx, app } = this;
		const list = await app.model.Article.findAll();
		await ctx.render('basic/index.html', {
			data: list
		})
	}
	/**
	 * 文章详情
	 */
	async renderDetail() {
		const { ctx, app } = this;
		const article = await app.model.Article.findById(ctx.params.id);
		article.content = decodeURIComponent(article.content);
		await ctx.render('basic/article.html', {
			data: article
		})
	}
}

module.exports = ArticleController;