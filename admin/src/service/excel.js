import { http } from '../utils/axios';

function getExcel(url, data) {
    return http({
        method: 'POST',
        isHandle: true,
        url,
        data,
        responseType: 'blob'
    })
}

export class ExcelApi {
    // 导出巡查任务
    static inspectionTask(data) {
        return getExcel('/patrolTask/export', data);
    }
    // 导出维修任务
    static maintenanceTask(data) {
        return getExcel('/repairTask/export', data);
    }
    // 问题上报
    static problem(data) {
        return getExcel('/problem/export', data);
    }
    // 投诉建议
    static complaint(data) {
        return getExcel('/proposal/export', data);
    }
    // 签到管理
    static sign(data) {
        return http({
            method: 'GET',
            isHandle: true,
            url: '/sign/export',
            params: {
                searchDate: data
            },
            responseType: 'blob'
        })
    }
    // 水位管理
    static water(data) {
        return http({
            method: 'GET',
            isHandle: true,
            url: '/waterRecord/export',
            params: data,
            responseType: 'blob'
        })
    }
    // 巡河
    static patrolRiver(data) {
        return http({
            method: 'GET',
            isHandle: true,
            url: '/patrolRiver/export/'+data,
            responseType: 'blob'
        })
    }
}