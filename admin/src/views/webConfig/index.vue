<template>
    <div>
        <w-breadcrumb :navigation="nav"/>
        <el-form ref="form" label-width="100px" class="common-form-container" :model="data">
            <el-form-item
                label="网站名称"
                prop="web_name"
                :rules="[
                    { max: 30, message: '网站名称不能超过30个字符', trigger: 'blur' }
                ]">
                <el-input placeholder="请输入网站名称" v-model="data.web_name"/>    
            </el-form-item>
            <el-form-item
                label="网站关键词"
                prop="web_keywords"
                :rules="[
                    { max: 100, message: '网站关键词不能超过100个字符', trigger: 'blur' }
                ]">
                <el-input placeholder="请输入网站关键词" v-model="data.web_keywords"/>
            </el-form-item>
            <el-form-item
                label="网站描述"
                prop="web_desc"
                :rules="[
                    { max: 500, message: '网站描述不能超过500个字符', trigger: 'blur' }
                ]">
                <el-input placeholder="请输入网站描述" v-model="data.web_desc"/>    
            </el-form-item>
            <el-form-item
                label="公众号二维码"
                prop="web_wechat_image">
                <el-upload action="" class="avatar-uploader" :http-request="uploadImage">
                    <img v-if="data.web_wechat_image" :src="data.web_wechat_image" class="avatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item
                label="公司名称"
                prop="company_name"
                :rules="[
                    { max: 100, message: '公司名称不能超过100个字符', trigger: 'blur' }
                ]">
                <el-input placeholder="请输入公司名称" v-model="data.company_name"/>
            </el-form-item>
            <el-form-item
                label="公司电话"
                prop="company_tel"
                :rules="[
                    { max: 100, message: '公司电话长度不能超过100个字符', trigger: 'blur' }
                ]">
                <el-input placeholder="请输入公司电话，多个号码用,号隔开" v-model="data.company_tel"/>
            </el-form-item>
            <el-form-item
                label="公司地址"
                prop="company_address"
                :rules="[
                    { max: 200, message: '公司地址长度不能超过200个字符', trigger: 'blur' }
                ]">
                <el-input placeholder="请输入公司地址" v-model="data.company_address"/>    
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            nav: [
                { name: '首页', to: '/' },
                { name: '网站配置' }
            ],
            data: {
                web_name: '',
                web_keywords: '',
                web_desc: '',
                web_wechat_image: '',
                company_tel: '',
                company_address: '',
                company_name: ''
            }
        }
    },
    created: function() {
        this.$api.Basic.getWebConfig().then(res => {
            if(res) {
                this.data = res.data;
            }
        })
    },
    methods: {
        uploadImage(file) {
            this.$api.Article.uploadFile(file.file).then(res => {
                if(res) {
                    this.data.web_wechat_image = res.data;
                }
            })
        },
        onSubmit() {
            this.$refs.form.validate((validate) => {
                if(validate) {
                    this.$api.Basic.setWebConfig(this.data).then(res => {
                        if(res) {
                            this.$notify.success({
                                title: '操作提示',
                                message: '操作成功'
                            });
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
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
