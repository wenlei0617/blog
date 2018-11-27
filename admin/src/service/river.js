import { http } from '@/utils/axios';

export class RiverApi {
    static getDetail(id) {
        return http.get('/patrolRiver/getDetails/'+id)
    }
    static getHistoryList(id, data) {
        return http.get('/patrolRiver/getHistoryList/'+id, {
            params: data
        })
    }
    static getList(date, data) {
        return http.get('/patrolRiver/getList/'+date, {
            params: data
        })
    }
}