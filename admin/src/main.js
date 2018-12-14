import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import Element from 'element-ui';
import App from './App.vue'
import router from './route'
import store from './store/index.js';
import 'element-ui/lib/theme-chalk/index.css';
import '@/style/font.css';
import '@/style/common.scss';
import Table from '@/components/table';
import Breadcrumb from '@/components/breadcrumb';
import Api from '@/service';


Vue.use(Element);
Vue.component('WTable', Table);
Vue.component('WBreadcrumb', Breadcrumb);
Vue.prototype.$api = Api;

sync(store, router);

if(store.state.navmenu.length === 0 && sessionStorage.getItem('authorization')) {
	store.dispatch('getSelfNav');
}


new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');