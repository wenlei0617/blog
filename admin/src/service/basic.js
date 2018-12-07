import { http } from '@/utils/axios';

export const Basic = {
    getWebConfig() {
        return http.get('/basics/getWebConfig')
    },
    setWebConfig(data) {
        return http.post('/basics/setWebConfig', data)
    }
}