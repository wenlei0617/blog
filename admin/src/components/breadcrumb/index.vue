<template>
    <div>
        <el-breadcrumb>
            <template v-for="(item, index) in navigation" >
                <el-breadcrumb-item :key="index" v-if="item.to" :to="item.to">{{item.name}}</el-breadcrumb-item>
                <el-breadcrumb-item :key="index" v-else>{{item.name}}</el-breadcrumb-item>    
            </template>
        </el-breadcrumb>
    </div>
</template>
<script>
export default {
    name: 'wbreadcrumb',
    props: {
        navigation: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        }
    }
}
</script>
