import { http } from '../utils/axios';

export class PatrolTaskApi {
    // 同意
    static agree(id) {
        return http.get('/patrolTask/adopt/'+id);
    }
    // 不同意
    static noAgree(id) {
        return http.get('/patrolTask/unAdopt/'+id);
    }
    // 指派人员
    static assignUser(id, userIds) {
        return http.post('/patrolTask/assignUser/'+id, userIds);
    }
    // 创建任务
    static create(data) {
        return http.post('/patrolTask/create', data)
    }
    // 删除任务
    static remove(id) {
        return http.delete('/patrolTask/delete/'+id);
    }
    // 详情
    static getDetail(id) {
        return http.get('/patrolTask/getDetails/'+id)
    }
    // 附件
    static getFiles(id) {
        return http.get('/patrolTask/getFiles/'+id)
    }
    // 列表
    static getList(data) {
        return http.get('/patrolTask/getList', {
            params: data
        })
    }
}