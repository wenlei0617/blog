'use strict';

const Controller = require('./index');

class UserController extends Controller {
    /**
     * 
     * @api {GET} /user/getList 获取管理员列表
     * @apiName getList
     * @apiGroup User
     * @apiVersion  1.0.0
     * 
     * @apiParam  {String} pageSize 一页多少条 默认10条
     * @apiParam  {String} page     第几页
     */
    async index() {
        const { ctx, service } = this;
        let { pageSize = 10, page = 1 } = ctx.request.query;

        const list = await service.user.getList(parseInt(pageSize), parseInt(page));

        this.success(list);
    }
    /**
     * 
     * @api {GET} /user/getDetail/:id 获取管理员详情
     * @apiName getDetail
     * @apiGroup User
     * @apiVersion  1.0.0
     * 
     * @apiParam  {String} id 用户ID
     */
    async show() {
        const { ctx, service } = this;
        const id = parseInt(ctx.params.id);

        const user = await service.user.getDetail(id);

        this.success(user);
    }
    /**
     * 
     * @api {POST} /user/createOrUpdate 修改或创建管理员
     * @apiName createOrUpdate
     * @apiGroup User
     * @apiVersion  1.0.0
     * 
     * @apiParam  {Int} id 管理员ID
     * @apiParam  {String} name 管理员姓名
     * @apiParam  {String} account 管理员账号
     * @apiParam  {String} role 管理员权限
     */
    async create() {
        const { ctx, service } = this;
        const { id, name, account, role } = ctx.request.body;
        let user;
        if(id) {
            user = await service.user.update({id, name, account, role});
        }else{
            user = await service.user.create({name, account, role});
        }

        this.success(user);
    }
    /**
     * 
     * @api {GET} /user/delete/:id 
     * @apiName delete
     * @apiGroup User
     * @apiVersion  1.0.0
     * 
     */
    async destroy() {
        const { ctx, service } = this;
        const id = parseInt(ctx.request.query.id);
        if(!id) {
            this.serviceError(10001);
            return;
        }
        await service.user.destroy(id);

        this.success();
    }
}

module.exports = UserController;