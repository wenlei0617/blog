'use strict';

const Controller = require('./index');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const captcha = require('svg-captcha');
const cache = require('memory-cache');
const uuid = require('node-uuid');

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
        const filepath = `/public/static/images/${name}.${fileType}`;
        const webpath = `/static/images/${name}.${fileType}`;
        const url = this.config.urlPrefix
        try {
            const readStream = fs.createReadStream(file.filepath);
            const writeStream = fs.createWriteStream(path.join(this.config.baseDir, '/app/', filepath));
            readStream.pipe(writeStream);
            this.success(url+webpath);
        } catch(error) {
            new Error(error);
        } finally {
            await fs.unlink(file.filepath);
        }
    }

    async createCaptcha() {
        let svg = captcha.create({
            height: 40,
            width: 130,
            size: 4,
            noise: 4
        });
        const id = uuid.v1();
        cache.put(id, svg.text.toLocaleLowerCase(), 1000 * 60 * 60 * 1);
        this.success({
            svg: svg.data,
            id
        })
    }
}

module.exports = BasicsController;