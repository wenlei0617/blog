'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/controller/login.test.js', () => {
    describe('POST /login/loginIn', () => {
        it('返回值200，并返回验证码错误', async () => {
            await app.httpRequest()
                .post('/login/loginIn')
                .type('form')
                .send({
                    account: 'account',
                    password: 'admin',
                    code: '1234',
                    id: '123'
                })
                .expect(200)
                .expect({
                    code: 10002,
                    message: '验证码输入有误',
                    data: ''
                })
        })
    }) 
})