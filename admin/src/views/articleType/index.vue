<template>
    <div>
        <w-table 
            :isSearch="false"
            :isPage="false"
            api="Article.getType">
            <w-breadcrumb slot="nav" :navigation="navigation"></w-breadcrumb>
            <template slot="search">
                <router-link to="/article-type/add">
                    <el-button type="primary" size="small">新建</el-button>
                </router-link>
            </template>    
            <template slot="table">
                <el-table-column type="index" label="序号" width="50px" align="center"/>
                <el-table-column label="专题名称" prop="name"/>
                <el-table-column label="专题描述" prop="desc"/>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="remove(scope)">删除</el-button>
                        <el-button type="text" @click="update(scope.row.id)">修改</el-button>
                    </template>
                </el-table-column>
            </template>
        </w-table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            navigation: [
                { name: '首页', to: '/' },
                { name: '专题配置' }
            ]
        }
    },
    methods: {
        remove(scope) {
            this.$confirm('确定删除当前专题？', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.$api.Article.removeType(scope.row.id).then(res => {
                    if(res) {
                        scope._self.tableData.splice(scope.$index, 1);
                        this.$notify.success({
                            title: '提示',
                            message: '删除成功'
                        })
                    }
                })
            }).catch(() => {});
        },
        update(id) {
            this.$router.push('/article-type/add/'+id);
        }
    }
}
</script>

