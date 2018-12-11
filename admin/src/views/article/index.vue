<template>
    <div>
        <w-table
            :isExcel="true"
            :searchData="search"
            api="Article.getList">
            <w-breadcrumb slot="nav" :navigation="navigation"></w-breadcrumb>
            <template slot="search">
                <div style="margin-bottom:20px;">
                    <router-link to="/article/add">
                        <el-button type="primary" size="small">
                            新建
                        </el-button>
                    </router-link>
                </div>
                <el-form-item label="日期">
                    <el-date-picker
                        v-model="search.updated_at"
                        type="date"
                        value-format="yyyy-MM-dd"
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
                <el-form-item label="专题">
                    <el-select v-model="search.type_id">
                        <el-option value="" label="全部"></el-option>
                        <el-option 
                            v-for="item in list"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否推荐">
                    <el-select v-model="search.is_recommend">
                        <el-option value="" label="全部"></el-option>
                        <el-option :value="0" label="否"></el-option>
                        <el-option :value="1" label="是"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template slot="table">
                <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
                <el-table-column prop="name" label="标题"></el-table-column>
                <el-table-column label="专题" prop="article_type.name">
                </el-table-column>
                <el-table-column prop="status_name" label="状态"></el-table-column>
                <el-table-column label="是否推荐">
                    <template slot-scope="scope">
                        {{scope.row.is_recommend===0?'否':'是'}}
                    </template>
                </el-table-column>
                <el-table-column prop="thumbs_up" label="阅读量"></el-table-column>
                <!-- <el-table-column prop="created_at" label="创建时间"></el-table-column> -->
                <el-table-column prop="updated_at" label="修改时间" width="140px"></el-table-column>
                <el-table-column label="备注" width="200px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="getDetail(scope.row.id)">详情</el-button>
                        <el-button type="text" @click="remove(scope)">删除</el-button>
                        <el-button type="text" @click="setStatus(scope)" v-if="scope.row.status===2 || scope.row.status === 0">发布</el-button>
                        <el-button type="text" @click="setStatus(scope)" v-if="scope.row.status===1">下架</el-button>
                        <el-button type="text" @click="setRecommend(scope)">{{scope.row.is_recommend===0?'推荐':'取消推荐'}}</el-button>
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
                { name: '文章列表' }
            ],
            search: {
                updatedAt: '',
                name: '',
                status: '',
                is_recommend: '',
                type_id: ''
            },
            list: []
        }
    },
    created: function() {
        this.$api.Article.getType().then(res => {
            if(res) {
                this.list = res.data;
            }
        })
    },
    methods: {
        getDetail(id) {
            this.$router.push('/article/add/'+id)
        },
        remove(scope) {
            this.$confirm('确定删除当前文章？','提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.$api.Article.remove(scope.row.id).then(res => {
                    if(res) {
                        scope._self.tableData.splice(scope.$index, 1);
                        this.$notify.success({
                            title: '提示',
                            message: '删除成功'
                        })
                    }
                })
            }).catch(()=>{})
        },
        setStatus(scope) {
            this.$confirm(`确定${scope.row.status === 1?'下架':'发布'}当前文章吗？`,'提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.$api.Article.setStatus(scope.row.id, scope.row.status===1?2:1).then(res => {
                    if(res) {
                        this.$notify.success({
                            title: '提示',
                            message: '修改成功'
                        })
                        
                        if(scope.row.status === 1 || scope.row.status === 0) {
                            scope.row.status_name = '下架';
                            scope.row.status = 2;
                        }else if(scope.row.status === 2) {
                            scope.row.status_name = '发布';
                            scope.row.status = 1;
                        }
                    }
                })
            }).catch(() => {})
        },
        setRecommend(scope) {
            this.$confirm(`确定${scope.row.is_recommend===0?'设置推荐':'取消推荐'}当前文章吗？`,'提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.$api.Article.setRecommend(scope.row.id, scope.row.is_recommend===0?1:0).then(res => {
                    if(res) {
                        scope.row.is_recommend = scope.row.is_recommend===0?1:0;
                    }
                })
            }).catch(() => {});
        }
    }
}
</script>
