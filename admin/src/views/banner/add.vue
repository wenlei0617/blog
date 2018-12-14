<template>
    <div>
        <w-breadcrumb :navigation="nav"/>
        <el-form ref="form" label-width="80px" class="common-form-container" :model="data">
            <el-form-item
                label="封面图片"
                prop="cover"
                :rules="[
                    { required: true, message: '请上传封面图片', trigger: 'change' }
                ]">
                <el-upload 
                    action=""
                    :http-request="uploadImage">
                    <img v-if="data.cover" :src="data.cover" alt="">
                    <i v-else class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item
                label="描述"
                prop="desc"
                :rules="[
                    { max: 20, message: '描述不能超过20个字符', trigger: 'blur' }
                ]">
                <el-input placeholder="请输入描述" v-model="data.desc"/>
            </el-form-item>
            <el-form-item
                label="文章"
                prop="article_id"
                :rules="[
                    { required: true, message: '请选择文章', trigger: 'blur' }
                ]">
                <el-cascader
                    :options="options"
                    :props="props"
                    @change="handleChange"
                    @active-item-change="handleItemChange"></el-cascader>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            options: [],
            props: {
                value: 'label',
                children: 'children'
            },
            nav: [
                { name: '首页', to: '/' },
                { name: '轮播图', to: '/banner' },
                { name: this.$route.params.id?'轮播图详情':'新增轮播图'}
            ],
            data: {
                cover: '',
                desc: '',
                article_id: '',
                id: ''
            },
            pos: ''
        }
    },
    created: function() {
        if(this.$route.params.id) {
            this.$api.Banner.getDetail(this.$route.params.id).then(res => {
                if(res) {
                    this.data = res.data;
                }
            })
        }
        this.$api.Article.getType().then(res => {
            if(res) {
                res.data.forEach(item => {
                    item.label = item.name;
                    item.children = [];
                })
                this.options = res.data;
            }
        })
    },
    methods: {
        onSubmit() {
            this.$refs.form.validate(validate => {
                if(validate) {  
                    this.$api.Banner.createOrUpdate(this.data).then(res => {
                        if(res) {
                            this.$notify.success({
                                title: '提示',
                                message: '操作成功'
                            });
                            this.$router.go(-1);
                        }
                    })
                }else{
                    return false;
                }
            })
        },
        uploadImage(file) {
            this.$api.Article.uploadFile(file.file).then(res => {
                if(res) {
                    this.data.cover = res.data;
                }
            })
        },
        handleChange(val) {
            let pos = this.options[this.pos].children.findIndex(item => {
                return item.name === val[1]
            });
            this.data.article_id = this.options[this.pos].children[pos].id;
        },
        handleItemChange(val) {
            let pos = this.options.findIndex(item => {
                return item.name === val[0]
            });
            this.pos = pos;
            if(this.options[pos].children.length === 0) {
                this.$api.Article.getList({
                    type_id: this.options[pos].id
                }).then(res => {
                    if(res) {
                        res.data.rows.forEach(item => {
                            item.label = item.name;
                        })
                        this.options[pos].children = res.data.rows;
                    }
                })
            }
        }
    }
}
</script>

