import Vue from 'vue'
import Vuex from 'vuex'
import { NAVMENU } from '@/config';
Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		userInfo: null,
		navmenu: NAVMENU
	},
	mutations: {

	},
	actions: {

	}
})