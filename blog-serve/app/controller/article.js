'use strict';

const Controller = require('./index');

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
		const { page = 1, pageSize = 10, name, status, updated_at, type_id, is_recommend } = ctx.query;
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
		if(type_id) {
			where.type_id = type_id;
		}
		if(is_recommend) {
			where.is_recommend = is_recommend
		}

		const res = await app.model.Article.findAndCountAll({
			include: [
				{
					model: app.model.ArticleType,
					attributes: ['id','name'],
					as: 'article_type'
				},
			],
			where,
			order: [
				['updated_at', 'DESC']
			],
			limit: parseInt(pageSize),
			offset: (parseInt(page) - 1) * pageSize
		});
		this.success(res);
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
		const  { 
			name, 
			status, 
			content, 
			id, 
			keywords, 
			description,
			type_id,
			is_recommend 
		} = ctx.request.body;
		if(id) {
			await app.model.Article.update({
				name,
				status,
				content: encodeURIComponent(content),
				keywords,
				description,
				type_id,
				is_recommend
			}, {
				where: {
					id
				}
			})
			this.success('', '修改成功');
			return;
		}

		const res = await app.model.Article.create({
			name,
			status,
			content: encodeURIComponent(content),
			keywords,
			description,
			type_id,
			is_recommend
		});

		res.content = ctx.helper.shtml(decodeURIComponent(res.content));
		this.success(res);
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
			this.serviceError(10001)
			return;
		}
		await app.model.Article.destroy({
			where: {
				id
			}
		})
		this.success('', '删除成功');
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
		this.success();
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
		this.serviceError(10001);
	}
	/**
	 * 
	 * @api {GET} /article/getType 获取文章专题列表
	 * @apiName getType
	 * @apiGroup Article
	 * @apiVersion  1.0.0
	 */
	async getType() {
		const list = await this.app.model.ArticleType.findAll();
		this.success(list);
	}

	async getTypeById() {
		const id = parseInt(this.ctx.params.id);
		if(id) {
			const result = await this.app.model.ArticleType.findById(id);
			this.success(result);
			return;
		}
		this.serviceError(10001);
	}
	/**
	 * 
	 * @api {POST} /article/setType 设置文章专题
	 * @apiName setType
	 * @apiGroup Article
	 * @apiVersion  1.0.0
	 * 
	 * @apiParam  {String} name 专题名字
	 * @apiParam  {String} desc 专题描述
	 * @apiParam  {Number} id   专题ID
	 */
	async setType() {
		const { ctx, app } = this;
		const { name, desc } = ctx.request.body;
		const id = parseInt(ctx.request.body.id);
		if(id) {
			app.model.ArticleType.update({
				name,
				desc
			},{
				where: {
					id
				}
			});

			this.success();
			return;
		}
		await app.model.ArticleType.create({
			name,
			desc	
		});

		this.success();
	}
	/**
	 * 
	 * @api {GET} /article/removeType 删除专题
	 * @apiName removeType
	 * @apiGroup Article
	 * @apiVersion  1.0.0
	 * 
	 * @apiParam  {String} id 专题ID
	 */
	async removeType() {
		const { ctx, app } = this;
		const id = parseInt(ctx.params.id);

		if(id) {
			await app.model.ArticleType.destroy({
				where: {
					id
				}
			});
			this.success();
			return;
		}

		this.serviceError(10001);
	}
	/**
	 * @api {GET} /article/setRecommend 设置是否推荐
	 * @apiName setRecommend
	 * @apiGroup Article
	 * @apiVersion  1.0.0
	 * 
	 * @apiParam  {String} id 文章ID
	 * @apiParam  {Enum} is_recommend 0不推荐  1推荐
	 */
	async setRecommend() {
		const { ctx, app } = this;
		const id = parseInt(ctx.params.id);
		const is_recommend = ctx.params.is_recommend;
		if(id) {
			await app.model.Article.update({
				is_recommend
			}, {
				where: {
					id
				}
			})
			this.success();
			return;
		}
		this.serviceError(10001);
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