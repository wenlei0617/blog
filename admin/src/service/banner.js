import { http } from '@/utils/axios';

export const Banner = {
    getList(params) {
        return http.get('/banner/getList', {
            params
        })
    },
    getDetail(id) {
        return http.get('/banner/getDetail/'+id)
    },
    remove(id) {
        return http.delete('/banner/delete/'+id)
    },
    createOrUpdate(data) {
        return http.post('/banner/createOrUpdate', data)
    }
}