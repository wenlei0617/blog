<template>
    <div>
        <w-breadcrumb :navigation="nav"/>
        <el-form ref="form" label-width="80px" class="common-form-container" :model="data">
            <el-form-item 
                label="文章标题" 
                prop="name" 
                :rules="[
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { max: 50, message: '标题不能超过50个字符', trigger: 'blur' }
                ]">
                <el-input placeholder="请输入文章标题" v-model.trim="data.name"/>
            </el-form-item>
            <el-form-item
                label="文章内容"
                prop="content"
                :rules="[
                    { required: true, message: '请输入文章内容', trigger: 'blur' }
                ]">
                <vue-editor style="line-height:normal;" v-model="data.content"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit(0)">保存为草稿</el-button>
                <el-button v-if="data.status===1 || !data.id" type="success" @click="onSubmit(1)">发布</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { VueEditor } from 'vue2-editor';
export default {
    components: { VueEditor },
    data() {
        return {
            nav: [{name:'首页'},{name: '文章列表', to: '/article'}, {name: this.$route.params.id?'文章详情':'新建文章'}],
            data: {
                content: '',
                id: '',
                name: '',
                statusName: '',
                status: '',
                thumbs_up: '',
                created_at: '',
                updated_at: ''
            }
        }
    },
    created: function() {
        if(this.$route.params.id) {
            this.$api.Article.getDetail(this.$route.params.id).then(res => {
                if(res) {
                    this.data = res.data;
                }
            })
        }
    },
    methods: {
        onSubmit(status) {
            this.$refs.form.validate(validate => {
                if(validate) {
                    this.$api.Article.create({
                        name: this.data.name,
                        content: this.data.content,
                        id: this.data.id,
                        status: status
                    }).then(res => {
                        if(res) {
                            this.$confirm(`${status===0?'保存':'发布'}成功，是否继续编辑或返回上一页`, '提示', {
                                confirmButtonText: '继续编辑',
                                cancelButtonText: '返回',
                                type: 'success'
                            }).then(() => {
                                if(!this.data.id) {
                                    this.data = res.data;
                                }
                            }).catch(() => {
                                this.$router.go(-1);
                            })
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

