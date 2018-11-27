import { http } from '@/utils/axios';

export class InformationApi {
    static deleteItem(id) {
        return http.delete('/information/delete/'+id);
    }
    static getDetail(id) {
        return http.get('/information/getDetails/'+id);
    }
    static getList(data) {
        return http.get('/information/getList', {
            params: data
        })
    }
    static saveOrUpdate(data) {
        return http.post('/information/saveOrUpdate', data)
    }
}