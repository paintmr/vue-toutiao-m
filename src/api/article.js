/**
 * 文章请求模块
 */
import request from '@/utils/request'

/**
 * 请求获取文章列表数据
 */
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/v1_1/articles',
    // params用来传递Query参数
    params
  })
}
/**
 * 请求获取文章详情数据
 */
export const getArticleById = articleId => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${articleId}` // 经过src/utils/reques.js中的JSONBig.parse(data)处理后，这里的articleId变成了BigNumber类型的对象。在这个url里，对象和字符串拼接，对象也成了字符串的一部分。任何数据和字符串拼接，都会变成字符串。
  })
}
/**
 * 收藏文章
 */
export const addCollect = articleId => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target: articleId
    }
  })
}

/**
 * 取消收藏文章
 */
export const cancelCollect = articleId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${articleId}`
  })
}

/**
 * 给文章点赞
 */
export const addLike = articleId => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

/**
 * 取消文章点赞
 */
export const cancelLike = articleId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${articleId}`
  })
}
