<template>
    <div>
        <w-breadcrumb :navigation="nav"/>
        <el-form ref="form" label-width="80px" class="common-form-container user-add-container" :model="data">
            <el-form-item
                label="姓名"
                :rules="[
                    { required: true, message: '请输入管理员姓名', trigger: 'blur' }
                ]">
                <el-input placeholder="请输入管理员姓名" v-model="data.name"/>    
            </el-form-item>
            <el-form-item
                label="账号"
                :rules="[
                    { required: true, message: '请输入管理员账号', trigger: 'blur' },
                    { min: 5, message: '账号必须大于5个字符', trigger: 'blur'}
                ]">
                <el-input placeholder="请输入管理员账号" v-model="data.account"/>    
            </el-form-item>
            <el-form-item
                label="权限">
                <el-tree 
                    ref="tree"
                    style="margin-top: 7px;"
                    default-expand-all
                    node-key="id"
                    :default-checked-keys="data.role.split(',')"
                    show-checkbox
                    :data="checkbox"
                    :props="propsData"></el-tree>
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
            nav: [
                { name: '首页', to: '/' },
                { name: '管理员', to: '/user' },
                { name: this.$route.params.id?'管理员详情':'新增管理员'}
            ],
            checkbox: [],
            propsData: {
                label: 'name',
                children: 'children'
            },
            data: {
                account: '',
                id: '',
                name: '',
                role: ''
            }
        }
    },
    created: function() {
        if(this.$route.params.id) {
            this.$api.User.getDetail(this.$route.params.id).then(res => {
                if(res) {
                    this.data = res.data;
                }
            })
        }

        this.$api.Basic.getNavList().then(res => {
            if(res) {
                for(let i=0; i<res.data.length; i++) {
                    res.data[i].id = -(i+1);
                }
                this.checkbox = res.data;
            }
        })
    },
    methods: {
        onSubmit() {
            this.$refs.form.validate(validate => {
                if(validate) {
                    let role = this.$refs.tree.getCheckedKeys();
                    role = role.filter(i => i>0);
                    this.data.role = role.toString();
                    this.$api.User.createOrUpdate(this.data).then(res => {
                        if(res) {
                            this.$notify.success({
                                title: '提示',
                                message: this.$route.params.id?'修改成功':'创建成功'
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
<style lang="scss">
.user-add-container{
    width: 400px;
}
</style>
