/**
 * 用户相关请求模块
 */
import request from '@/utils/request'
// import store from '@/store'

/**
 * 登录请求
 */
export const login = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}

/**
 * 发验证码请求
 * 注意：每个手机号每分钟只能接收一次验证码
 */
export const getSmsCode = mobile => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}

/**
 * 获取用户自己的信息
 */
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
    // 发送请求头数据
    // headers: {
    //   // 注意：该接口需要授权才能访问
    //   // token数据格式： Bearer token数据。注意Bearer后面有个空格
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

/**
 * 获取用户频道列表
 * 不强制用户登录，非登录用户也可以获取默认的频道列表
 */
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}
