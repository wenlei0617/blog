'use strict';

module.exports = () => {
    return async function errorHandler(ctx, next) {
        try {
            await next();
        } catch (err) {
            // 所有的异常都触发一个error事件，记录一条错误日志
            ctx.app.emit('error', err, ctx);

            const status = err.status || 500;

            const error = status === 500 && ctx.app.config.env === 'prod'
            ? 'Interval Server Error'
            : err.message;

            ctx.body = { 
                message: error
            };
            // 422是 egg-validate的错误码
            if(status === 422) {
                ctx.body.data = err.errors;
            }
            ctx.body.code = err.code || 500;
            ctx.status = status;
        }
    }
}