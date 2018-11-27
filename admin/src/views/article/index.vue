<template>
    <div>
        <w-table
            :isExcel="true"
            :searchData="search"
            api="Article.getList">
            <w-breadcrumb slot="nav" :navigation="navigation"></w-breadcrumb>
            <template slot="search">
                <el-form-item label="日期">
                    <el-date-picker
                        v-model="search.updated_at"
                        type="date"
                        placeholder="请选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input placeholder="请输入标题" v-model="search.name"/>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="search.status">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="草稿" value="0"></el-option>
                        <el-option label="发布" value="1"></el-option>
                        <el-option label="下架" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template slot="table">
                <el-table-column prop="name" label="标题"></el-table-column>
                <el-table-column prop="status" label="状态"></el-table-column>
                <el-table-column prop="thumbs_up" label="点赞"></el-table-column>
                <el-table-column prop="created_at" label="创建时间"></el-table-column>
                <el-table-column prop="updated_at" label="修改时间"></el-table-column>
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
                { name: '文章列表' }
            ],
            search: {
                updatedAt: '',
                name: '',
                status: ''
            }
        }
    }
}
</script>
