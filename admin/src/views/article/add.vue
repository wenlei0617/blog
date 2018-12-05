<template>
    <div>
        <w-breadcrumb :navigation="nav"/>
        <el-form ref="form" label-width="80px" class="common-form-container" :model="data">
            <el-form-item 
                label="文章专题"
                prop="type_id"
                :rules="[
                    { required: true, message: '请选择文章专题', trigger: 'change' }
                ]">
                <el-select v-model="data.type_id">
                    <el-option 
                        v-for="item in list"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"></el-option>
                </el-select>
            </el-form-item>
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
                label="关键字"
                prop="keywords"
                :rules="[
                    { max: 200, message: '关键字最大不超过200个字', trigger: 'blur' }
                ]">
                <el-input placeholder="请输入关键字" v-model.trim="data.keywords"/>    
            </el-form-item>
            <el-form-item
                label="描述"
                prop="description"
                :rules="[
                    { max: 200, message: '描述最大不超过200个字', trigger: 'blur' }
                ]">
                <el-input placeholder="请输入描述" v-model.trim="data.description"/>
            </el-form-item>
            <el-form-item
                label="文章内容"
                prop="content"
                :rules="[
                    { required: true, message: '请输入文章内容', trigger: 'blur' }
                ]">
                <vue-editor :useCustomImageHandler="true" @imageAdded="handleImageAdded" style="line-height:normal;" v-model="data.content"/>
            </el-form-item>
            <el-form-item>
                <el-checkbox :true-label="1" :false-label="0" v-model="data.is_recommend">是否推荐</el-checkbox>
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
                updated_at: '',
                description: '',
                keywords: '',
                type_id: '',
                is_recommend: 0
            },
            list: []
        }
    },
    created: function() {
        this.$api.Article.getType().then(res => {
            if(res) {
                this.list = res.data;
            }
        });
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
                        status: status,
                        keywords: this.data.keywords,
                        description: this.data.description,
                        is_recommend: this.data.is_recommend,
                        type_id: this.data.type_id
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
        },
        handleImageAdded(file, Editor, cursorLocation, resetUploader) {
            this.$api.Article.uploadFile(file).then(res => {
                if(res) {
                    Editor.insertEmbed(cursorLocation, 'image', res.data);
                    resetUploader();
                }
            })
        }
    }
}
</script>

