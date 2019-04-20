// 导出一个已经配置好的axios，不需要在main.js里面配置

import axios from 'axios'

// 去哪局使用必须依赖Vue 在main.js里面使用
// baseURL 配置
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 导出
export default axios