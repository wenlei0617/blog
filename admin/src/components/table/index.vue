<template>
    <div class="common-table">
        <slot name="nav"></slot>
        <el-form 
            class="pagination-search" 
            :inline="true" 
            size="small"
            v-if="isSearch">
           <slot name="search"></slot>
            <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
                <el-button v-if="isExcel" type="primary" @click="getExcel">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table class="common-el-table" :border="true" :data="tableData" v-loading="loading">
            <slot name="table"></slot>
        </el-table>
        <el-pagination
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[1, 2, 10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"></el-pagination>
    </div>
</template>
<script>
export default {
    name: 'pagination',
    props: {
        isSearch: {                 //是否显示搜索栏
            type: Boolean,
            default: () => {
                return true;
            }
        },
        searchData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        isExcel: {
            type: Boolean,
            default: () => {
                return false;
            }
        },
        api: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            tableData: [],
            total: 0,
            currentPage: 1,
            loading: false,
            pageSize: 10
        }
    },
    created: function() {
        this.getTableList(1);
    },
    methods: {
        getTableList() {
            const methods = this.api.split('.');
            this.loading = true;
            this.$api[methods[0]][methods[1]]({
                ...this.searchData,
                page: this.currentPage,
                pageSize: this.pageSize
            }).then(res => {
                if(res) {
                    this.tableData = res.data.rows;
                    this.total = res.data.count;
                }
                setTimeout(() => {
                   this.loading = false; 
                }, 500);
            }).catch(() => {
                setTimeout(() => {
                   this.loading = false; 
                }, 500);
            })
        },
        getExcel() {},
        search() {
            this.currentPage = 1;
            this.getTableList();
        },
        handleSizeChange(size) {
            this.pageSize = size;
            this.currentPage = 1;
            this.getTableList();
        },
        handleCurrentChange(page) {
            this.currentPage = page;
            this.getTableList();
        }
    }
}
</script>
<style lang="scss">
.common-table{
    .common-el-table{
        margin-top: 40px;
    }
    .pagination-search+.common-el-table{
        margin-top: 0;
    }
    .pagination-search{
        margin: 20px 0 20px;
    }
    .pagination{
        margin-top: 20px;
    }
}
</style>


