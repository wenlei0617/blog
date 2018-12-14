<template>
    <div class="login">
        <h1>后台管理系统</h1>
        <el-form :model="data" ref="form">
            <el-form-item prop="account" :rules="[
                { required: true, message: '请输入账户', trigger: 'blur' }
            ]">
                <el-input placeholder="请输入账户" v-model="data.account" @keyup.native.enter="onSubmit"/>
            </el-form-item>
            <el-form-item prop="password" :rules="[
                { required: true, message: '请输入密码', trigger: 'blur' }
            ]">
                <el-input placeholder="请输入密码" v-model="data.password" type="password" @keyup.native.enter="onSubmit"/>
            </el-form-item>
            <el-form-item prop="code" :rules="[
                { required: true, message: '请输入验证码', trigger: 'blur' }
            ]">
                <el-input placeholder="请输入验证码" class="login-code" v-model="data.code" @keyup.native.enter="onSubmit"/>
                <div @click="getCaptcha" class="login-code-image" v-html="src"></div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" class="login-btn">登陆</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            src: '',
            data: {
                id: '',
                code: '',
                account: '',
                password: ''
            }
        }
    },
    created: function() {
        this.getCaptcha();
    },
    methods: {
        onSubmit() {
            this.$refs.form.validate(validate => {
                if(validate) {
                    this.$api.Login.loginIn(this.data).then(res => {
                        if(res) {
                            sessionStorage.setItem('authorization', res.data.token);
                            this.$store.commit('setNav', res.data.role);
                            this.$router.push('/');
                            return;
                        }
                        setTimeout(() => {
                            this.getCaptcha();
                        }, 0);
                    })
                }else{
                    return false;
                }
            })
        },
        getCaptcha() {
            this.$api.Login.getCaptcha().then(res => {
                if(res) {
                    this.src = res.data.svg;
                    this.data.id = res.data.id;
                }
            })
        }
    }
}
</script>

<style lang="scss">
.login{
    width: 280px;
    margin: 150px auto;
    h1{
        text-align: center;
        margin-bottom: 20px;
        font-weight: normal;
        font-size: 28px;

    }
    &-btn{
        width: 100%;
    }
    &-code{
        width: 50%;
    }
    &-code-image{
        float: right;
        width: 45%;
        height: 40px;
    }
}
</style>
