import { http } from '@/utils/axios';

export class WaterApi {
    static remove(id) {
        return http.get('/waterRecord/delete/'+id);
    }
    static getHsitoryList(date, id) {
        return http.get('/waterRecord/getHistoryList/'+ date + '/' +id)
    }
    static getList(data) {
        return http.get('/waterRecord/getList', {
            params: data
        });
    }
}