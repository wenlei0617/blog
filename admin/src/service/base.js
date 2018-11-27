import { http } from '../utils/axios';

export class BaseApi {
    // 登陆
    static loginIn(data) {
        return http.get('/ca/login', {
            params: data
        });
    }
    // 获取用户信息
    static getInfo() {
        return http.get('/ca/getInfo');
    }
    // 退出登录
    static loginOut() {
        return 
    }
    // 修改用户信息
    static updateInfo(data) {
        return http.post('/ca/updateInfo', data);
    }
    // 实时视频列表
    static getVideoList(data={}) {
        return http.get('/video/getList', {
            params: data
        })
    }
    // 上传文件
    static updateFile(file) {
        let formdata = new FormData();
        formdata.append('multipartFile', file);
        return http.post('/updateFile', formdata);
    }
    // 获取下拉配置
    static getConfig(no) {
        return http.post('/getLbList/'+no);
    }
    // 人员筛选
    static selectPerson(data) {
        return http.post('/appuser/searchUser/', data)
    }
    // 维修人员列表
    static getWxUser() {
        return http.post('/appuser/getWxUser')
    }
    // 统计报表
    static getReport(data) {
        return http.get('/report/getReport', {
            params: data
        })
    }
    // 总计统揽
    static getTotal() {
        return http.get('/report/getTotal')
    }
    // 系统配置列表
    static getSysConfig() {
        return http.post('/sysConf');
    }
    // 系统配置修改
    static setConfig(id, val) {
        return http.post('/updateSysVal/'+id+'/'+val)
    }
}