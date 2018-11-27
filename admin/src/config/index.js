// api请求地址
export const BASIC_URL = process.env.NODE_ENV === 'local' ? 'localhost:7001' : 'http://101.207.127.95:9001/cdhg-admin';
// api请求超时时间
export const TIMEOUT = 100000;
// 导航配置
export const NAVMENU = [
    {
        name: '文章管理',
        id: '1',
        className: 'icon-renwuguanli',
        children: [
            {
                name: '文章列表',
                path: '/articleyarn',
                id: '1'
            }
        ]
    }
];