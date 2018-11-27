'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/article/getList', controller.article.index);
  router.post('/article/create', controller.article.create);
  router.delete('/article/delete/:id', controller.article.delete);
  router.post('/article/setStatus/:id', controller.article.setStatus);
};
