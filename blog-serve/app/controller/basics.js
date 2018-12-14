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
    /**
     * 
     * @api {GET} /basics/getCaptcha 获取验证码
     * @apiName getCaptcha
     * @apiGroup Basics
     * @apiVersion  1.0.0
     * 
     */
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
    /**
     * 
     * @api {GET} /basics/getWebConfig 获取网站配置
     * @apiName getWebConfig
     * @apiGroup Basics
     * @apiVersion  1.0.0
     * 
     * @apiParams {String} config 配置Key 可空则是全部配置
     */
    async getWebConfig() {
        const { Op } = this.app.Sequelize;
        let params = this.ctx.query.config;
        let condition = [];
        if(params) {
            condition = params.split(',');
        }
        const result = await this.app.model.WebConfig.findAll({
            where: {
                key: {
                    [Op.or]: condition
                }
            }
        });
        let list = {};
        result.forEach(item => {
            list[item.key] = item.value;
        })
        this.success(list);
    }
    /**
     * 
     * @api {Post} /basics/setWebConfig 设置网站配置
     * @apiName setWebConfig
     * @apiGroup Basics
     * @apiVersion  1.0.0
     * 
     * @apiParam  {String} web_name 网站名称
     * @apiParam  {String} web_keywords 网站关键字
     * @apiParam  {String} web_desc 网站描述
     * @apiParam  {String} web_wechat_image 公众号微信二维码
     * @apiParam  {String} company_tel 公司电话
     * @apiParam  {String} company_address 公司地址
     * @apiParam  {String} company_name 公司名称
     */
    async setWebConfig() {
        const { ctx, app } = this;
        const {
            web_name = '',
            web_keywords = '',
            web_desc = '',
            web_wechat_image = '',
            company_tel = '',
            company_address = '',
            company_name = ''
        } = ctx.request.body;

        await app.model.WebConfig.update({ value: web_name }, {
            where: {
                key: 'web_name'
            }
        })
        await app.model.WebConfig.update({ value: web_keywords }, {
            where: {
                key: 'web_keywords'
            }
        })
        await app.model.WebConfig.update({ value: web_desc }, {
            where: {
                key: 'web_desc'
            }
        })
        await app.model.WebConfig.update({ value: web_wechat_image }, {
            where: {
                key: 'web_wechat_image'
            }
        })
        await app.model.WebConfig.update({ value: company_tel }, {
            where: {
                key: 'company_tel'
            }
        })
        await app.model.WebConfig.update({ value: company_address }, {
            where: {
                key: 'company_address'
            }
        })
        await app.model.WebConfig.update({ value: company_name }, {
            where: {
                key: 'company_name'
            }
        });

        this.success();
    }
    /**
     * 
     * @api {GET} /basics/getNavList 获取菜单配置
     * @apiName getNavList
     * @apiGroup Basics
     * @apiVersion  1.0.0
     */
    async getNavList() {
        const { service } = this;

        const roleList = await service.conf.getNav();

        this.success(roleList);
    }
    /**
     * 
     * @api {GET} /basics/getSelfNav 获取用户菜单
     * @apiName getSelfNav
     * @apiGroup Basics
     * @apiVersion  1.0.0
     * 
     */
    async getSelfNav() {
        const { service } = this;
        const userInfo = this.getUserInfo();
        
        const roleList = await service.conf.getNav(userInfo.role.split(','));

        this.success(roleList);
    }
}

module.exports = BasicsController;