define({ "api": [
  {
    "type": "POST",
    "url": "/article/createOrUpdate",
    "title": "文章创建或更新",
    "name": "createOrUpdate",
    "group": "Article",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>文章名称</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "status",
            "description": "<p>状态 0草稿 1发布 2下架</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>文章内容</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "id",
            "description": "<p>文章id 有ID则更新，无ID则创建</p>"
          }
        ]
      }
    },
    "filename": "app/controller/article.js",
    "groupTitle": "Article"
  },
  {
    "type": "DELETE",
    "url": "/article/delete/:id",
    "title": "删除文章",
    "name": "deleteArticle",
    "group": "Article",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "id",
            "description": "<p>文章ID</p>"
          }
        ]
      }
    },
    "filename": "app/controller/article.js",
    "groupTitle": "Article"
  },
  {
    "type": "GET",
    "url": "/article/getList",
    "title": "获取文章列表",
    "name": "getArticle",
    "group": "Article",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "page",
            "description": "<p>页数</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pageSize",
            "description": "<p>条数</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>标题</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "time",
            "description": "<p>日期  YYYY-MM-DD</p>"
          }
        ]
      }
    },
    "filename": "app/controller/article.js",
    "groupTitle": "Article"
  },
  {
    "type": "GET",
    "url": "/article/getDetail/:id",
    "title": "获取文章详情",
    "name": "getDetail",
    "group": "Article",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>文章ID</p>"
          }
        ]
      }
    },
    "filename": "app/controller/article.js",
    "groupTitle": "Article"
  },
  {
    "type": "GET",
    "url": "/article/getType",
    "title": "获取文章专题列表",
    "name": "getType",
    "group": "Article",
    "version": "1.0.0",
    "filename": "app/controller/article.js",
    "groupTitle": "Article"
  },
  {
    "type": "GET",
    "url": "/article/removeType",
    "title": "删除专题",
    "name": "removeType",
    "group": "Article",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>专题ID</p>"
          }
        ]
      }
    },
    "filename": "app/controller/article.js",
    "groupTitle": "Article"
  },
  {
    "type": "GET",
    "url": "/article/setRecommend",
    "title": "设置是否推荐",
    "name": "setRecommend",
    "group": "Article",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>文章ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Enum",
            "optional": false,
            "field": "is_recommend",
            "description": "<p>0不推荐  1推荐</p>"
          }
        ]
      }
    },
    "filename": "app/controller/article.js",
    "groupTitle": "Article"
  },
  {
    "type": "post",
    "url": "/article/setStatus/:id",
    "title": "修改文章状态",
    "name": "setStatus",
    "group": "Article",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>文章ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "status",
            "description": "<p>文章状态 0草稿 1发布 2下架</p>"
          }
        ]
      }
    },
    "filename": "app/controller/article.js",
    "groupTitle": "Article"
  },
  {
    "type": "POST",
    "url": "/article/setType",
    "title": "设置文章专题",
    "name": "setType",
    "group": "Article",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>专题名字</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "desc",
            "description": "<p>专题描述</p>"
          }
        ]
      }
    },
    "filename": "app/controller/article.js",
    "groupTitle": "Article"
  },
  {
    "type": "POST",
    "url": "/basics/uploadFiles",
    "title": "上传文件",
    "name": "uploadFiles",
    "group": "Basics",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Files",
            "optional": false,
            "field": "files",
            "description": "<p>文件</p>"
          }
        ]
      }
    },
    "filename": "app/controller/basics.js",
    "groupTitle": "Basics"
  },
  {
    "type": "method",
    "url": "/login/loginIn",
    "title": "后台登陆",
    "name": "loginIn",
    "group": "Login",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "account",
            "description": "<p>账户</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p>"
          }
        ]
      }
    },
    "filename": "app/controller/login.js",
    "groupTitle": "Login"
  }
] });
