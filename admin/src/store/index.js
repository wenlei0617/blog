import Vue from 'vue'
import Vuex from 'vuex'
// import { NAVMENU } from '@/config';
import Api from '@/service/index.js'
Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		userInfo: null,
		navmenu: []
	},
	mutations: {
		setNav(state, data) {
			state.navmenu = data;
		}
	},
	actions: {
		async getSelfNav({commit}) {
			// console.log(Basic);
			let result = await Api.Basic.getSelfNav();
			commit('setNav', result.data);
		}
	}
})