// api请求地址
export const BASIC_URL = process.env.NODE_ENV === 'local' ? 'http://localhost:7001' : 'http://101.207.127.95:9001/cdhg-admin';
// api请求超时时间
export const TIMEOUT = 100000;
// 导航配置
export const NAVMENU = [
    {
        name: '文章管理',
        id: '1',
        className: 'el-icon-document',
        children: [
            {
                name: '文章列表',
                path: '/article',
                id: '2'
            }
        ]
    },
    {
        name: '系统管理',
        id: '3',
        className: 'el-icon-setting',
        children: [
            {
                name: '专题配置',
                path: '/article-type',
                id: '4'
            },
            {
                name: '网站配置',
                path: '/webconfig',
                id: '5'
            }
        ]
    }
];