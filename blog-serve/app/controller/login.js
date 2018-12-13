'use strict';

const Controller = require('./index');
const jwt = require('jsonwebtoken');
const cache = require('memory-cache');

class LoginController extends Controller {
    /**
     * @api {POST} /login/loginIn 后台登陆
     * @apiName loginIn
     * @apiGroup Login
     * @apiVersion  1.0.0
     * 
     * @apiParam  {string} account 账户
     * @apiParam  {string} password 密码
     */
    async loginIn() {
        const { ctx, app } = this;
        const { Op } = app.Sequelize;
        const { account, password, id, code } = ctx.request.body;
        ctx.validate({
            account: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            },
            id: {
                type: 'string',
                required: true
            },
            code: {
                type: 'string',
                required: true
            }
        })
        //先验证验证码
        const codeCache = cache.get(id);
        if(code.toLocaleLowerCase() !== codeCache) {
            cache.del(id);
            this.serviceError(10002);
            return;
        }

        const user = await app.model.User.findOne({
            where: {
                account,
                password
            }
        });
        if(user) {
            const token = jwt.sign({
                id: user.id,
                name: user.name
            }, this.config.keys, {
                expiresIn: '10h'
            });
            await app.model.User.update({
                token
            }, {
                where: {
                    id: user.id
                }
            })
            user.token = token;
            let role = user.role.split(',');
            role = role.map(Number);
            const rolesList = await app.model.NavFirst.findAll({
                include: [
                    {
                        model: app.model.NavSecond,
                        as: 'children',
                        where: {
                            id: {
                                [Op.in]: role
                            }
                        }
                    }
                ]
            });
            user.role = rolesList;
            this.success(user);
            return;
        }
        this.serviceError(10003);
    }
    /**
     * 
     * @api {POST} /login/loginOut 退出登录
     * @apiName loginOut
     * @apiGroup Login
     * @apiVersion  1.0.0
     * 
     */
    async loginOut() {
        const { app } = this;
        const tokenData = this.getUserInfo();

        await app.model.User.update({
            token: ''
        }, {
            where: {
                id: tokenData.id
            }
        });

        this.success();
    }
    /**
     * 
     * @api {POST} /login/updatePwd 修改密码
     * @apiName updatePwd
     * @apiGroup Login
     * @apiVersion  1.0.0
     * 
     * @apiParam  {String} password 新密码
     */
    async updatePwd() {
        const { app, ctx } = this;
        const { password } = ctx.request.body;
        const tokenData = this.getUserInfo();

        await app.model.User.update({
            password 
        }, {
            where: {
                id: tokenData.id
            }
        });

        this.success();
    }
}

module.exports = LoginController;