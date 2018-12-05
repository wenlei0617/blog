import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layout/layout.vue';

Vue.use(Router)

const router = new Router({
	mode: 'hash',
	routes: [
		{
			path: '/',
			component: Layout,
			redirect: 'article',
			children: [
				{
					path: 'article',
					component: () => import('@/views/article/index.vue'),
					name: 'article'
				},
				{
					path: 'article/add/:id?',
					component: () => import('@/views/article/add.vue'),
					name: 'article-add'
				},
				{
					path: 'article-type',
					component: () => import('@/views/articleType/index.vue'),
					name:'article-type'
				},
				{
					path: 'article-type/add/:id?',
					component: () => import('@/views/articleType/add.vue'),
					name: 'article-type-add'
				}
			]
		},
		{
			path: '/login',
			component: () => import('@/views/login.vue'),
			name: 'login'
		}
	],
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return {
				x: 0,
				y: 0
			};
		}
	}
});

//此处做路由鉴权和动态状态注册
router.beforeEach(async (to, from, next) => {
	if (to.name === 'login') {
		next();
	} else {
		if (!sessionStorage.getItem('authorization')) {
			next({name: 'login'});
		} else { // 登陆了
			next();
		}
	}
})

export default router;