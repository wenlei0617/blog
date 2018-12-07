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
  router.get('/article/getType', app.middleware.jwt(), controller.article.getType);
  router.post('/article/setType', app.middleware.jwt(), controller.article.setType);
  router.delete('/article/removeType/:id', app.middleware.jwt(), controller.article.removeType);
  router.get('/article/getTypeById/:id', app.middleware.jwt(), controller.article.getTypeById)
  router.get('/article/setRecommend/:id/:is_recommend', app.middleware.jwt(), controller.article.setRecommend);

  // 基础接口
  router.post('/basics/uploadFiles', app.middleware.jwt(), controller.basics.uploadFiles);
  router.get('/basics/getCaptcha', controller.basics.createCaptcha);
  router.get('/basics/getWebConfig', app.middleware.jwt(), controller.basics.getWebConfig);
  router.post('/basics/setWebConfig', app.middleware.jwt(), controller.basics.setWebConfig);

  // 后台登陆接口
  router.post('/login/loginIn', controller.login.loginIn);
  router.post('/login/loginOut', app.middleware.jwt(), controller.login.loginOut);
  router.post('/login/updatePwd', app.middleware.jwt(), controller.login.updatePwd)

  // 博客前端页面
  router.get('/', controller.article.render);
  router.get('/:id', controller.article.renderDetail);
};
