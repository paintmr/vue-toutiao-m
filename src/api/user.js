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

/**
 * 关注用户
 */
export const addFollow = (followTargetId) => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target: followTargetId
    }
  })
}

/**
 * 取消关注用户
 */
export const deleteFollow = (followTargetId) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${followTargetId}`,
    data: {
      target: followTargetId
    }
  })
}

/**
 * 获取当前登录用户的个人资料（如果获取当前登录用户的个人资料，不用传参数target；如果要获取别的用户，则要传递参数target）
 */
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}

/**
 * 更新当前登录用户的个人资料
 */
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}

/**
 * 更新当前登录用户的头像
 */
export const updateUserAvatar = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}

/**
 * 获取指定用户信息
 */
export const getUserById = userId => {
  return request({
    method: 'GET',
    url: `/v1_0/users/${userId}`
  })
}

/**
 * 获取用户的关注列表
 */
export const getFollowList = params => {
  return request({
    method: 'GET',
    url: '/v1_0/user/followings',
    params
  })
}

/**
 * 获取用户的粉丝列表
 */
export const getFanList = params => {
  return request({
    method: 'GET',
    url: '/v1_0/user/followers',
    params
  })
}

/**
 * 获取用户的收藏列表
 */
export const getFavouritesList = params => {
  return request({
    method: 'GET',
    url: '/v1_0/article/collections',
    params
  })
}

/**
 * 获取用户的浏览历史列表
 */
export const getHistoryList = params => {
  return request({
    method: 'GET',
    url: '/v1_0/user/histories',
    params
  })
}
