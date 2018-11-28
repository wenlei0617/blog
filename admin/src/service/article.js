import { http } from '@/utils/axios';

export const Article = {
    getList(data) {
        return http.get('/article/getList', {
            params: data
        })
    },
    create(data) {
        return http.post('/article/createOrUpdate', data)
    },
    remove(id) {
        return http.delete('/article/delete/'+id);
    },
    setStatus(id, status) {
        return http.post('/article/setStatus/'+id, { status })
    },
    getDetail(id) {
        return http.get('/article/getDetail/'+id)
    }
}