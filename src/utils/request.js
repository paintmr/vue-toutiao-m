// 请求模块
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'
/**
 * JSONBig可以处理数据中超出JavaScript安全整数范围的问题
 * JSONBig.parse() // 把JSON格式的字符串转为JavaScript对象
 * 使用的时候要把BigNumber类型的数据转为字符串来使用
 * JSONBig.stringify() //把JavaScript对象转为JSON格式的字符串
*/

const request = axios.create({
  // 接口的基准路径
  // baseURL: 'http://ttapi.research.itcast.cn/'
  baseURL: 'http://toutiao-app.itheima.net/',
  // 以后端返回的原始数据为基础，自定义返回的数据形态。
  transformResponse: [function (data) {
    // axios默认处理方式：
    // return JSON.parse(data)
    // data是后端返回的原始数据，一般是JSON格式的字符串。但data偶尔可能不是JSON格式的字符串，所以用try catch的代码。
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 这是axios自带的请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  // congif: 本次请求的配置对象
  // config 里面有个属性：headers
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  // 注意，这里一定要返回config配置对象，否则请求就停在这里出不去了。
  return config
}, function (error) {
  // Do something with request error 如果请求出错了（还没有发出去），会进入这里
  return Promise.reject(error)
})

// 响应拦截器

export default request
