import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from './http'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, {size: 'small'})
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 入口文件作用：导入其他依赖
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
