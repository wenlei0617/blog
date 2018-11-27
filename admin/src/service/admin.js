import { http } from '@/utils/axios';

export class AdminApi {
    // 检测手机号码
    static checkPhone(phone) {
        return http.get('/admin/checkPhone/'+phone);
    }
    // 创建用户
    static create(data) {
        return http.post('/admin/create', data);
    }
    // 停用/启用
    static enabled(id, enabled) {
        return http.get('/admin/enabled/'+id+'/'+enabled)
    }
    // 用户列表
    static getList(data) {
        return http.get('/admin/getList', {
            params: data
        })
    }
    // 重置密码
    static resetPwd(id) {
        return http.get('/admin/resetPwd/'+id)
    }
    // 删除用户
    static remove(id) {
        return http.delete('/admin/delete/'+id)
    }
    // 人事科管理列表
    static getRskList(data) {
        return http.get('/admin/getRskList', {
            params: data
        })
    }
}