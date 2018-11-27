import { http } from '@/utils/axios';

export const Article = {
    getList(data) {
        return http.get('', {
            params: data
        })
    }
}