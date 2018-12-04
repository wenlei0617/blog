'use strict';

const Controller = require('egg').Controller;

const fs = require('fs');
const path = require('path');

class TestController extends Controller {
    async render() {
        const html = await this.ctx.renderView('basic/article.html', {
            data: {
                name: 'sdfs',
                updated_at: 'sdfsd',
                thumbs_up: 123,
                content: '<div>sdfsd</div><script>alter(1)</script>'
            }
        });

        this.ctx.body = html;

        // await fs.writeFileSync(path.join(this.app.config.baseDir, '/app/public/view/index.html'), html);
    }
}

module.exports = TestController;