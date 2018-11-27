import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import Element from 'element-ui';
import App from './App.vue'
import router from './route'
import store from './store/index.js';
import 'element-ui/lib/theme-chalk/index.css';
import '@/style/font.css';
import '@/style/common.scss';


Vue.use(Element);
Vue.config.productionTip = false;
// Vue.config.performance = true;
// Vue.config.errorHandler = function() {
	
// }

sync(store, router);


new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');