'use strict';

const Controller = require('./index');

class BannerController extends Controller {
    /**
     * 
     * @api {GET} /banner/getList 获取轮播图列表
     * @apiName getList
     * @apiGroup Banner
     * @apiVersion  1.0.0
     * 
     * @apiParam  {String} pageSize 
     * @apiParam  {String} page
     */
    async index() {
        const { ctx, service } = this;
        const { pageSize = 10, page = 1 } = ctx.request.query;

        const list = await service.banner.index(pageSize, page);

        this.success(list)
    }
    /**
     * 
     * @api {GET} /banner/getDetail/:id 获取轮播图详情
     * @apiName getDetail
     * @apiGroup Banner
     * @apiVersion  1.0.0
     * 
     */
    async show() {
        const { ctx, service } = this;
        const { id } = ctx.params;

        const result = await service.banner.show(id);

        this.success(result);
    }
    /**
     * 
     * @api {POST} /banner/createOrUpdate 创建或更新
     * @apiName createOrUpdate
     * @apiGroup Banner
     * @apiVersion  1.0.0
     * 
     * @apiParam  {String} desc 描述
     * @apiParam  {Int} id
     * @apiParam  {String} article_id
     * @apiParam  {String} cover  封面图地址
     * 
     */
    async createOrUpdate() {
        const { ctx, service } = this;
        const { id, desc, article_id, cover } = ctx.request.body;
        
        if(id) {
            await service.banner.update({id, desc, article_id, cover});
            this.success();
            return;
        }

        const result = await service.banner.create({desc, article_id, cover});

        this.success(result);
    }
    /**
     * 
     * @api {DELETE} /banner/delete/:id 删除轮播图
     * @apiName delete
     * @apiGroup Banner
     * @apiVersion  1.0.0
     * 
     */
    async destroy() {
        const { ctx, service } = this;
        const { id } = ctx.params.id;

        await service.banner.destroy(id);

        this.success();
    }
}

module.exports = BannerController;