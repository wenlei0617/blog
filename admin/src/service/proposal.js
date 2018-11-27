import { http } from '../utils/axios';

export class ProposalApi {
    // 删除
    static remove(id) {
        return http.delete('/proposal/delete/'+id)
    }
    // 完成
    static finish(id, data) {
        return http.get('/proposal/finish/' +id, {
            params: {
                remark: data
            }
        });
    }
    // 详情
    static getDetails(id) {
        return http.get('/proposal/getDetails/'+id);
    }
    // 附件列表
    static getFiles(id) {
        return http.get('/proposal/getFiles/'+id)
    }
    // 列表
    static getList(data) {
        return http.get('/proposal/getList', {
            params: data
        })
    }
}