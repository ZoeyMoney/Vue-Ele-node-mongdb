import Vue from 'vue'
import Router from 'vue-router'
import config from './js/index'
/* import Feedback from './views/Feedback'
import table from './views/table' */
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: resolve => require(['@/views/Login'], resolve)
    }, {
      path: '/Home',
      name: 'Home',
      redirect: '/Feedback',
      component: resolve => require(['@/views/Home'], resolve),
      children: [
        { path: '/Feedback', name: 'Feedback', component: resolve => require(['@/views/Feedback'], resolve) },
        { path: '/table', name: 'table', component: resolve => require(['@/views/table'], resolve) },
        { path: '/UserName', name: 'UserName', component: resolve => require(['@/views/UserName'], resolve) },
        { path: '/image_all', name: 'image_all', component: resolve => require(['@/views/image_all'], resolve) },
        { path: '/netdisc', name: 'netdisc', component: resolve => require(['@/views/netdisc'], resolve) }
      ]
    }
  ]
})

export default router
router.beforeEach((to, from, next) => {
  if (to.fullPath != '/') {
    if (!sessionStorage.getItem(config.KEY.CACHE_LOGIN_NAME)) {
      return next('/')
    }
  }
  next()
})
