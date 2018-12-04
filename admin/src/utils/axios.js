import axios from 'axios';
import { BASIC_URL, TIMEOUT } from '@/config';
import { Notification } from 'element-ui';
import router from '@/route';

const http = axios.create({
    baseURL: BASIC_URL,
    timeout: TIMEOUT
})

http.defaults.headers.common['deviceType'] = 3;

// 请求前拦截器
http.interceptors.request.use(function(config) {
    config.headers.common['authorization'] = sessionStorage.getItem('authorization');
    return config;
}, function(error) {
    return Promise.reject(error);
});

// 返回前拦截器
http.interceptors.response.use(function(response) {
    if (response.config.isHandle) {
        return response;
    }
    if (response.data.code === 200) {
        return response.data;
    } else {
        Notification.error({
            title: '错误信息',
            message: response.data.message
        })
        return false;
    }
    
}, function(error) {
    try {
        if (error.response.status === 401) {
            Notification.error({
                title: '错误信息',
                message: '登陆过期'
            });
            sessionStorage.clear();
            router.replace({ name: 'login'})
        } else {
            Notification.error({
                title: '错误信息',
                message: error.response.data.message
            });
        }
    } catch (err) {

    }
    return Promise.reject(error);
})

export { http };