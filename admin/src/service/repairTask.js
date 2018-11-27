import { http } from '@/utils/axios';

export class RepairTaskApi {
    // 同意  
    static agree(id) {
        return http.get('/repairTask/adopt/'+id);
    }
    // 不同意
    static noAgree(id) {
        return http.get('/repairTask/unAdopt/'+id)
    }
    // 指派人员
    static assignUser(id, data) {
        return http.post('/repairTask/assignUser/'+id, data)
    }
    // 创建维修任务
    static create(data) {
        return http.post('/repairTask/create', data)
    }
    // 删除任务
    static remove(id) {
        return http.delete('/repairTask/delete/'+id);
    }
    // 详情
    static getDetail(id) {
        return http.get('/repairTask/getDetails/'+id)
    }
    // 附件
    static getFiles(id) {
        return http.get('/repairTask/getFiles/'+id)
    }
    // 列表
    static getList(data) {
        return http.get('/repairTask/getList', {
            params: data
        })
    }
}