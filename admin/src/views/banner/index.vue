<template>
    <div>
        <w-table
            :isSearch="false"
            api="Banner.getList">
            <w-breadcrumb slot="nav" :navigation="nav"></w-breadcrumb>
            <template slot="search">
                <router-link to="/banner/add">
                    <el-button type="primary" size="small">新建</el-button>
                </router-link>
            </template>
            <template slot="table">
                <el-table-column type="index" label="序号" width="50px" align="center"/>
                <el-table-column label="封面" prop="cover"/>
                <el-table-column label="描述" prop="desc"/>
                <el-table-column label="文章ID" prop="article_id"/>
                <el-table-column label="创建时间" prop="created_at"/>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="remove(scope)">删除</el-button>
                        <el-button type="text" @click="goUrl(`/banner/add/${scope.row.id}`)">详情</el-button>
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
                { name: '轮播图' }
            ]
        }
    },
    methods: {
        goUrl(path) {
            this.$router.push(path);
        },
        remove(scopr) {
            
        }
    }
}
</script>

