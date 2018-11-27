<template>
    <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
</template>
<script>
export default {
    name: 'pagination',
    props: {
        total: {
            type: Number,
            required: true
        },
        currentPage: {
            type: Number,
            default: 1
        }
    },
    // data() {
    //     return {
    //         currentPage: 1
    //     }
    // },
    methods: {
        changeCurrentPage() {

        },
        handleSizeChange(size) {
            this.$emit('size-change', size);
        },
        handleCurrentChange(page) {
            this.$emit('current-change', page);
        }
    }
}
</script>
<style lang="scss" scoped>
.pagination{
    margin-top: 20px;
}
</style>


