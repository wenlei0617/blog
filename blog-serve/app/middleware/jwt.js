'use strict';

module.exports = () => {
    const jwt = require('jsonwebtoken');
    return async (ctx, next) => {
        const token = ctx.request.header['authorization'];
        try {
            const tokenData = await jwt.verify(token, ctx.app.config.keys);
            const user = await ctx.app.model.User.findOne({
                where: {
                    id: tokenData.id,
                    token
                }
            });
            if(!user) {
                ctx.status = 401;
                ctx.body = {
                    data: '',
                    message: '登陆过期',
                    code: 401
                }                  
                return;
            }
            await next();
        } catch (error) {
            ctx.status = 401;
            ctx.body = {
                data: '',
                message: '登陆过期',
                code: 401
            }    
            return;
        }
    }
}