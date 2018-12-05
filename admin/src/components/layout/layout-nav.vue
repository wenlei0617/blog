<template>
    <div class="layout-nav common-scroll">
        <el-menu
            :router="true"
            :default-active="active"
            background-color="#20222A"
            text-color="rgba(255,255,255,.7)"
            active-text-color="#fff">
            <template v-for="item in $store.state.navmenu" >
                <el-submenu 
                    v-if="item.children"
                    :index="item.id" 
                    :key="item.id">
                    <template slot="title">
                        <i :class="item.className"></i>
                        <span>{{item.name}}</span>
                    </template>
                    <el-menu-item-group v-if="item.children.length">
                        <el-menu-item 
                            v-for="subItem in item.children"
                            :key="subItem.id"
                            :route="{path: subItem.path}" 
                            :index="subItem.id">{{subItem.name}}</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item
                    v-else
                    :key="item.id"
                    :route="{path: item.path}"
                    :index="item.id">
                    <i class="iconfont" :class="item.className"></i>
                    <span slot="title">{{item.name}}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>
<script>
export default {
    data() {
        return {
            active: '1'
        }
    },
    watch: {
        '$route': {
            handler(){
                let active = '';
                this.$store.state.navmenu.forEach(item => {
                    if(item.path && this.$route.path === item.path) {
                        active = item.id;
                    }
                    if(!item.path) {
                        item.children.forEach(subItem => {
                            if(subItem.path === this.$route.path) {
                                active = subItem.id;
                            }
                        })
                    }
                })
                this.active = active;
            },
            immediate: true
        }
    }
}
</script>
<style lang="scss">
.layout-nav{
    height: 100%;
    background: #20222A;
    box-sizing: border-box;
    width: 100%;
    overflow: auto;
}
.el-menu-item.is-active{
    background: #009688 !important;
}
</style>

