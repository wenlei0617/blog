import { http } from '@/utils/axios';

export class UserApi {
    // 检测手机号码
    static checkPhone(phone) {
        return http({
            method: 'get',
            url: '/appuser/checkPhone/'+phone,
            isHandle: true
        })
        // return http.get('/appuser/checkPhone/'+phone);
    }
    // 创建用户
    static create(data) {
        return http.post('/appuser/create', data);
    }
    // 停用/启用
    static enabled(id, enabled) {
        return http.get('/appuser/enabled/'+id+'/'+enabled)
    }
    // 用户列表
    static getList(userType, data) {
        return http.get('/appuser/getList/'+userType, {
            params: data
        })
    }
    // 重置密码
    static resetPwd(id) {
        return http.get('/appuser/resetPwd/'+id)
    }
}