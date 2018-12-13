import { http } from '@/utils/axios';

export const User = {
    getList(params) {
        return http.get('/user/getList', {
            params
        })
    },
    getDetail(id) {
        return http.get('/user/getDetail/'+id)
    },
    createOrUpdate(data) {
        return http.post('/user/createOrUpdate', data)
    }
}