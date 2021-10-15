/**
 * 文章请求模块
 */
import request from '@/utils/request'

/**
 * 请求获取文章评论列表数据
 */
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
