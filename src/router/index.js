import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/Users'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/welcome',
      // 二级路由配置 将会在home组件下使用
      children: [
        {path: '/welcome', name: 'welcome', component: Welcome},
        {path: '/users', name: 'users', component: Users}
      ]
    }
  ]
})

// 天机导航守卫
router.beforeEach((to, from, next) => {
  // to 去的路由对象,
  // from 离开的路由对象,
  // next()调用下一个路由 ,
  // next('/xxx') 要去的路由
  // console.log(to)
  // console.log(from)
  // next()
  // 1. 如果要跳转的是登录页，则不需要拦截
  if (to.path === '/login') return next()
  // // 2. 如果现在未登录，判断是否有token
  if (!sessionStorage.getItem('token')) return next('/login')
  next()
})
export default router
