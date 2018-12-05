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
    },
    uploadFile(file) {
        let form = new FormData();
        form.append('files', file);
        return http.post('/basics/uploadFiles', form)
    },
    getType() {
        return http.get('/article/getType');
    },
    getTypeById(id) {
        return http.get('/article/getTypeById/'+id);
    },
    setType(data) {
        return http.post('/article/setType', data)
    },
    removeType(id) {
        return http.delete('/article/removeType/'+id)
    },
    setRecommend(id, type) {
        return http.get('/article/setRecommend/'+id+'/'+type)
    }
}