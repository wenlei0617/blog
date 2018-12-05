<template>
    <div>
        <w-breadcrumb :navigation="nav"/>
        <el-form ref="form" label-width="80px" class="common-form-container" :model="data">
            <el-form-item
                label="专题名称"
                prop="name"
                :rules="[
                    { required: true, message: '请输入专题名称', trigger: 'blur' },
                    { max: 10, message: '名称不能超过10个字符', trigger: 'blur' }
                ]">
                <el-input placeholder="请输入专题名称" v-model="data.name"/>    
            </el-form-item>
            <el-form-item
                label="专题描述"
                prop="desc"
                :rules="[
                    { max: 50, message: '专题描述不能超过50个字符', trigger: 'blur' }
                ]">
                <el-input placeholder="请输入专题描述" v-model="data.desc"/>
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
                { name: '专题配置', to: '/article-type' },
                { name: this.$route.params.id?'专题详情':'新建专题'}
            ],
            data: {
                id: '',
                name: '',
                desc: ''
            }
        }
    },
    created: function() {
        if(this.$route.params.id) {
            this.$api.Article.getTypeById(this.$route.params.id).then(res => {
                if(res) {
                    this.data = res.data;
                }
            })
        }
    },
    methods: {
        onSubmit() {
            this.$refs.form.validate(validate => {
                if(validate) {
                    this.$api.Article.setType(this.data).then(res => {
                        if(res) {
                            this.$notify.success({
                                title: '操作提示',
                                message: this.data.id?'修改成功':'新建成功'
                            });
                            this.$router.go(-1);
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

