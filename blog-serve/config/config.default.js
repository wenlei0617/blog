'use strict';

const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1543216502739_8075';
  config.urlPrefix = 'http://localhost:7001'
  // add your config here
  config.middleware = [ 'errorHandler' ];
  
  config.multipart = {
    mode: 'file'
  }

  config.static = {
    prefix: '/',
    dir: path.join(appInfo.baseDir, 'app/public/')
  }

  config.view = {
    defaultViewEngine: 'ejs',
    root: path.join(appInfo.baseDir, 'app/view'),
    mapping: {
      '.html': 'ejs'
    }
  }

  config.security = {
    domainWhiteList: [ 'http://localhost:7001', 'http://localhost:8080' ],
    csrf: {
      enable: false
    }
  }

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,DELETE,PATCH,POST'
  }

  config.sequelize = {
    dialect: 'mysql',     //数据库类型
    host: '127.0.0.1',    
    port: '3306',
    database: 'blog',
    username: 'root',
    password: 'root',
    // pool: {    //连接池设置
    //   max: 5,
    //   min: 0,
    //   acquire: 30000,
    //   idle: 10000
    // },
    define: {             
      // timestamps: false,     // 去除createAt, updateAt
      freezeTableName: true,   //  使用自定义表名
      underscored: true         // 驼峰
    }
  }
  return config;
};
