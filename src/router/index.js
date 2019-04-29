import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('@/components/Login')
const Home = () => import('@/components/Home/Home')
const Welcome = () => import('@/components/Welcome')
const Users = () => import('@/components/users/Users')
const Rights = () => import('@/components/Auth/Rights')
const Roles = () => import('@/components/Auth/Roles')
const Categories = () => import('@/components/goods/Categories')
const Params = () => import('@/components/goods/Params')
const Goods = () => import('@/components/goods/Goods')
const GoodsAdd = () => import('@/components/goods/Goods-Add')
const Orders = () => import('@/components/orders/Orders')
const Reports = () => import('@/components/reports/Reports')

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
        {path: '/users', name: 'users', component: Users},
        {path: '/rights', name: 'rights', component: Rights},
        {path: '/roles', name: 'roles', component: Roles},
        {path: '/Categories', name: 'categories', component: Categories},
        {path: '/params', name: 'params', component: Params},
        {path: '/goods', name: 'goods', component: Goods},
        {path: '/goods/add', name: 'goodsadd', component: GoodsAdd},
        {path: '/orders', name: 'orders', component: Orders},
        {path: '/reports', name: 'reports', component: Reports}
      ]
    }
  ]
})

// 添加导航守卫
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
