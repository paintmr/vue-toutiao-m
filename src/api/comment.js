/**
 * 文章请求模块
 */
import request from '@/utils/request'

/**
 * 请求获取文章评论列表数据
 */
// GET参数使用params进行传递
// 我们写的时候是对象，
// 但axios在给服务器发请求前，会把params对象转为key=value?key=value?key=value的格式放到url里面。
// 如果直接把BigNumber对象作为params的一部分传递近来，axios拼字符的时候会出错（会多写一个引号）。所以，要先把BigNumber对象.toString()转成字符串。
export const getComments = params => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    // params用来传递Query参数。接口文档中还说要body参数，这是错误。这里只要Query参数即可。
    params
  })
}

/**
 * 对评论或评论回复点赞
 */
export const addCommentLike = commentId => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target: commentId
    }
  })
}

/**
 * 取消对评论或评论回复点赞
 */
export const cancelCommentLike = commentId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${commentId}`
  })
}
/**
 * 添加文章评论或评论回复。body里面必须带target，content，和art_id。把这些数据都放到data对象里。
 */
export const addComment = data => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
