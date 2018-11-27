import { http } from '@/utils/axios';

export class SiteApi {
    // 删除站点
    static removeSite(id) {
        return http.get('/site/delete/'+id);
    }
    // 站点详情
    static getDetail(id) {
        return http.get('/site/getDetails/'+id);
    }
    // 站点列表
    static getList(data) {
        return http.get('/site/getList', {
            params: data
        })
    }
    // 站点下拉列表
    static getSelectList() {
        return http.get('/site/getSelectList');
    }
    // 新增或修改站点
    static saveOrUpdate(data) {
        return http.post('/site/saveOrUpdate', data);
    }
}