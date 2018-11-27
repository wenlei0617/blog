import { http } from '@/utils/axios';

export class SluiceApi {
    // 删除水闸
    static remove(id) {
        return http.get('/sluice/delete/'+id);
    }
    // 水闸详情
    static getDetail(id) {
        return http.get('/sluice/getDetails/'+id);
    }
    // 水闸列表
    static getList(data) {
        return http.get('/sluice/getList', {
            params: data
        })
    }
    // 水闸下拉列表
    static getSelectList(id) {
        return http.get('/sluice/getSelectList/'+id);
    }
    // 新增或修改水闸
    static saveOrUpdate(data) {
        return http.post('/sluice/saveOrUpdate', data);
    }
}