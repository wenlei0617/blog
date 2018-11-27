import Pagination from '@/components/pagination';
import { ExcelApi } from '@/service';

let table = {
    data: function() {
        return {
            loading: false,
            total: 0,
            tableData: [],
            pageSize: 10,
            page: 1,
            excel_ids: []
        }
    },
    created: function() {
        this.getTableList();
    },
    // activated: function() {
    //     this.getTableList(this.page)
    // },
    components: { Pagination },
    methods: {
        getExcel(name) {
            if(this.excel_ids.length === 0) {
                return this.$notify.error({
                    title: '错误信息',
                    message: '请选择要导出的数据'
                })
            }
            ExcelApi[name](this.excel_ids).then(res => {
                if(res.status === 200) {
                    const blob = new Blob([res.data], {type: 'application/ms-excel'});
                    const fileName = `报表.xls`;
                    if ('download' in document.createElement('a')) { // 非IE下载
                        const elink = document.createElement('a')
                        elink.download = fileName
                        elink.style.display = 'none'
                        elink.href = URL.createObjectURL(blob)
                        document.body.appendChild(elink)
                        elink.click()
                        URL.revokeObjectURL(elink.href) // 释放URL 对象
                        document.body.removeChild(elink)
                    } else { // IE10+下载
                        navigator.msSaveBlob(blob, fileName)
                    }
                }
            })
        },
        handleSelectionChange(data) {
            this.excel_ids = [];
            data.forEach(item => {
                this.excel_ids.push(item.id);
            })
        },
        getTableList() {
            return console.error('请定义getTalbeList方法');
        },
        _handleSizeChange(size) {
            this.pageSize = size;
            this.getTableList();
        },
        _handleCurrentChange(page) {
            this.page = page;
            this.getTableList(page);
        }
    }
}

export default table;