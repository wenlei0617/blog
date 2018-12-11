<template>
    <div class="layout">
        <header class="layout-header">
            <!-- <img class="layout-header_logo" src="~@/assets/logo@2x.png" alt=""> -->
            <!-- <img class="layout-header_title" src="~@/assets/name-green.png" alt=""> -->
            <div class="layout-header_btns">
                <el-button class="layout-header_btns--margin" type="text" @click="showDialog">修改密码</el-button>
                <el-button class="layout-header_btns--margin" type="text" @click="loginOut">退出登录</el-button>
                <span class="layout-header_btns--text">admin</span>
                <img class="layout-header_btns--head" src="~@/assets/logo@2x.png" alt="">
            </div>
        </header>
        <section class="layout-container">
            <div class="layout-left">
                <layout-nav></layout-nav>
            </div>
            <div class="layout-right">      
                <transition name="el-fade-in-linear">
                    <router-view></router-view>
                </transition> 
            </div>
        </section>
        <el-dialog title="修改密码" :visible.sync="dialogVisible">
            <el-form ref="changePwd" label-width="80px" class="dialog-form--style" :model="form">
                <el-form-item 
                    label="新密码" 
                    prop="password"
                    :rules="[
                        { required: true, message: '请输入新密码', trigger: 'blur' }
                    ]">
                    <el-input type="password" v-model="form.password"/>
                </el-form-item>
                <el-form-item 
                    label="确认密码" 
                    prop="checkPassword"
                    :rules="[
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { validator: validatePwd, trigger: 'blur'}
                    ]">
                    <el-input type="password" v-model="form.checkPassword"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">确定修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import LayoutNav from './layout-nav';
// import md5 from 'js-md5';
// import { BaseApi } from '../../service';
export default {
    components: {
        LayoutNav
    },
    data() {
        return {
            transitionName: '',
            dialogVisible: false,
            form: {
                password: '',
                checkPassword: ''
            }
        }
    },
    methods: {
        loginOut() {
            this.$api.Login.loginOut().then(res => {
                if(res) {
                    sessionStorage.clear();
                    this.$notify.success({
                        title: '提示',
                        message: '操作成功'
                    });
                    this.$router.push('/login');
                }
            })
        },
        validatePwd(rule, value, callback) {
            if(value !== this.form.password) {
                callback(new Error('两次密码输入有误'))
            }else{
                callback();
            }
        },
        showDialog() {
            this.dialogVisible = true;
        },
        onSubmit() {
            this.$refs.changePwd.validate(validate => {
                if(validate) {
                    this.$api.Login.updatePwd(this.form.password).then(res => {
                        if(res) {
                            this.$notify.success({
                                title: '提示',
                                message: '修改密码成功'
                            })
                            this.dialogVisible = false;
                        }
                    })
                }else{
                    return false;
                }
            })
        }
    }
}
</script>
<style lang="scss">
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 1000ms;
  position: absolute;
  width: 100%;
  z-index: 1;
}
.slide-right-enter {
//   opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-right-leave-active {
//   opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-left-enter {
//   opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-left-leave-active {
//   opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.dialog-form--style{
    width: 70%;
}
.layout{
    width: 100%;
    height: 100%;
    overflow: hidden;
    &-header{
        height: 80px;
        background: #fff;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
        box-sizing: border-box;
        width: 100%;
        position: fixed;
        top: 0;
        z-index: 99;
        background: #fff;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: 0 40px;
        &_logo{
            width: 60px;
        }
        &_title{
            height: 40px;
            margin-left: 20px;
        }
        &_btns{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            &--head{
                width: 50px;
                height: 50px;
                border-radius: 25px;
            }
            &--text{
                color: #000;
                font-size: 18px;
                margin: 0 20px 0 40px;
            }
            &--margin{
                width: 60px;
            }
        }
    }
    &-container{
        display: flex;
        padding-top: 80px;
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
    }
    &-left{
        width: 200px;
        box-sizing: border-box;
        z-index: 9;
    }
    &-right{
        flex: 1;
        overflow: auto;
        padding: 20px;
        box-sizing: border-box;
        background: #f2f2f2;
        >div{
            padding: 20px;
            background: #fff;
            box-sizing: border-box;
            min-height: 100%;
        }
    }
}
</style>


