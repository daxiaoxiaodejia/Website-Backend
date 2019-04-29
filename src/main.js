import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/fonts/iconfont.css'
import axios from './http'
import moment from 'moment'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 依赖全局演示文件
import './assets/css/global.css'

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)
Vue.use(ElementUI, {size: 'small'})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.filter('ft', (v) => {
  return moment(v * 1000).format('YYYY-MM-DD HH:mm:ss')
})
// 入口文件作用：导入其他依赖
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
