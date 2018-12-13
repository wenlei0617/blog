'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {
    async render() {
        console.log(this.ctx.app.config.urlPrefix)
        const html = await this.ctx.renderView('index.html', {
            page: 'index.html',
            data: {
                text: 'hello world'
            }
        });

        this.ctx.body = html;
    }
}

module.exports = TestController;