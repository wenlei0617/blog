<template>
    <div>
        <w-table
            :isSearch="false"
            api="User.getList">
            <w-breadcrumb slot="nav" :navigation="nav"></w-breadcrumb>
            <template slot="search">
                <router-link to="/user/add">
                    <el-button type="primary" size="small">新建</el-button>
                </router-link>
            </template>
            <template slot="table">
                <el-table-column type="index" label="序号" width="50px" align="center"/>
                <el-table-column label="名字" prop="name"/>
                <el-table-column label="账号" prop="account"/>
                <el-table-column label="权限" prop="role"/>
                <el-table-column label="创建时间" prop="created_at"/>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goUrl('/user/add/'+scope.row.id)">详情</el-button>
                        <el-button type="text">删除</el-button>
                        <el-button type="text">禁用</el-button>
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
            nav: [
                { name: '首页', to: '/' },
                { name: '管理员列表' }
            ]
        }
    },
    methods: {
        goUrl(path) {
            this.$router.push(path);
        }
    }
}
</script>