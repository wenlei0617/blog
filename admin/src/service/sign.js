import { http } from '@/utils/axios';

export class SignApi {
    static getList(date) {
        return http.get('/sign/getList', {
            params: {
                searchDate: date
            }
        })
    }
    static deleteItem(id) {
        return http.delete('/sign/delete/'+id);
    }
    static create(data) {
        return http.post('/sign/create', data)
    }
}