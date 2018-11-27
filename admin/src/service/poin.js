import { http } from '@/utils/axios';

export class PoinApi {
    // 删除点位
    static remove(id) {
        return http.get('/poin/delete/'+id);
    }
    // 点位详情
    static getDetail(id) {
        return http.get('/poin/getDetails/'+id);
    }
    // 点位列表
    static getList(data) {
        return http.get('/poin/getList', {
            params: data
        })
    }
    // 点位下拉列表
    static getSelectList(id) {
        return http.get('/poin/getSelectList/' + id);
    }
    // 新增或修改点位
    static saveOrUpdate(data) {
        return http.post('/poin/saveOrUpdate', data);
    }
}