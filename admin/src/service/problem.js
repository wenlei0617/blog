import { http } from '@/utils/axios';

export class ProblemApi {
    static remove(id) {
        return http.delete('/problem/delete/'+id);
    }
    static getDetail(id) {
        return http.get('/problem/getDetails/'+id)
    }
    static getFiles(id) {
        return http.get('/problem/getFiles/'+id)
    }
    static getList(data) {
        return http.get('/problem/getList', {
            params: data
        })
    }
    static finish(id, data) {
        return http.get('/problem/finish/'+id, {
            params: {
                remark: data
            }
        })
    }
}