import { http } from '@/utils/axios';

export const Login = {
    getCaptcha() {
        return http.get('/basics/getCaptcha');
    },
    loginIn(data) {
        return http.post('/login/loginIn', data);
    }
}