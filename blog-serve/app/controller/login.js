'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');
const cache = require('memory-cache');

class LoginController extends Controller {
    /**
     * @api {method} /login/loginIn 后台登陆
     * @apiName loginIn
     * @apiGroup Login
     * @apiVersion  1.0.0
     * 
     * @apiParam  {string} account 账户
     * @apiParam  {string} password 密码
     */
    async loginIn() {
        const { ctx, app } = this;
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
            ctx.body = {
                code: 202,
                data: '',
                message: '验证码输入有误'
            }
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
            ctx.body = {
                code: 200,
                msg: '',
                data: user
            };
            return;
        }
        ctx.body = {
            code: 201,
            msg: '账号或密码错误',
            data: ''
        }
    }
}

module.exports = LoginController;