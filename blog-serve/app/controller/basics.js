'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class BasicsController extends Controller {
    /**
     * @api {POST} /basics/uploadFiles 上传文件
     * @apiName uploadFiles
     * @apiGroup Basics
     * @apiVersion  1.0.0
     * 
     * @apiParam  {Files} files 文件
     */
    async uploadFiles() {
        const file = this.ctx.request.files[0];
        const name = crypto.createHmac('sha256',this.config.keys)
                            .update(file.filename+Date.now()+Math.random()*1000)
                            .digest('hex');
        const fileArr = file.mime.split('/');
        const fileType = fileArr[fileArr.length-1];
        const filepath = `/public/static/${name}.${fileType}`;
        const url = this.config.urlPrefix
        try {
            const readStream = fs.createReadStream(file.filepath);
            const writeStream = fs.createWriteStream(path.join(this.config.baseDir, '/app/', filepath));
            readStream.pipe(writeStream);
            this.ctx.body = {
                code: 200,
                data: url + filepath,
                msg: ''
            }
        } catch(error) {
            this.ctx.body = {
                code: 500,
                data: error,
                msg: '内部异常'
            }
        } finally {
            await fs.unlink(file.filepath);
        }
    }
}

module.exports = BasicsController;