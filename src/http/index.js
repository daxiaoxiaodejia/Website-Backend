// 导出一个已经配置好的axios，不需要在main.js里面配置

import axios from 'axios'

// 去哪局使用必须依赖Vue 在main.js里面使用
// baseURL 配置
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
// 响应拦截
axios.interceptors.response.use(res => {
// 判断token是否失效
  if (res.data.meta.status === 401) {
    location.href = '#/login'
  } else {
    return res
  }
})
// 导出
export default axios