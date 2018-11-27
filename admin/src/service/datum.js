import { http } from '@/utils/axios';

export class DatumApi {
    static createFolder(data) {
        return http.post('/datum/createFolder', data)
    }
    static remove(type, id) {
        return http.get('/datum/delete/'+type+'/'+id)
    }
    static getFolderList(data) {
        return http.get('/datum/getFolderList', {
            params: data
        })
    }
    static getList(data) {
        return http.get('/datum/getList', {
            params: data
        })
    }
    static getType(data) {
        return http.get('/datum/getTypeTj', {
            params: data
        })
    }
    static updateFile(files, data) {
        const formdata = new FormData();
        for(let i=0; i<files.length; i++) {
            formdata.append('multipartFiles', files[i])
        }
        formdata.append('datumDTOInfo', JSON.stringify(data));
        return http.post('/datum/updateFiles', formdata);
    }
}