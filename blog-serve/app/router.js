'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/article/getList', app.middleware.jwt(), controller.article.index);
  router.post('/article/createOrUpdate', app.middleware.jwt(), controller.article.create);
  router.delete('/article/delete/:id', app.middleware.jwt(), controller.article.delete);
  router.post('/article/setStatus/:id', app.middleware.jwt(), controller.article.setStatus);
  router.get('/article/getDetail/:id', app.middleware.jwt(), controller.article.getDetail);

  // 基础接口
  router.post('/basics/uploadFiles', app.middleware.jwt(), controller.basics.uploadFiles);
  router.get('/basic/getCaptcha', controller.basics.createCaptcha);

  // 后台登陆接口
  router.post('/login/loginIn', controller.login.loginIn);

  // 博客前端页面
  router.get('/', controller.article.render);
  router.get('/:id', controller.article.renderDetail);

  router.get('/test', controller.test.render);
};
