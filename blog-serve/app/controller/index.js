'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');

class IndexController extends Controller {
    // 成功  200
    success(data = '', message = '操作成功') {
        this.ctx.status = 200;
        this.ctx.body = {
            code: 200,
            message,
            data
        }
    }
    /**
     * 
     * @param {number} code 10001 参数错误 10002 验证码输入有误 10003 账号或密码错误
     * @param {string} msg 
     * @param {any} data 
     */
    serviceError(code, data = '', message) {
        this.ctx.status = 200;
        switch (code) {
            case 10001:
                message = '参数错误';
                break;
            case 10002:
                message = '验证码输入有误';
                break;
            case 10003:
                message = '账号或密码错误';
            default:
                break;
        }
        this.ctx.body = {
            code,
            message,
            data
        }
    }

    // 根据TOKEN获取用户ID
    getUserInfo() {
        const token = this.ctx.request.headers['authorization'];
        const tokenData = jwt.decode(token);

        return tokenData;
    }
}

module.exports = IndexController;