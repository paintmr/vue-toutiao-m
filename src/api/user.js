/**
 * 用户相关请求模块
 */
import request from '@/utils/request'

// 登录请求
export const login = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}

// 发验证码请求
// 注意：每个手机号每分钟只能接收一次验证码
export const getSmsCode = mobile => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}
