<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :error="error"
    error-text="加载失败，请点击重试"
  >
    <comment-item
      v-for="(comment,index) in list"
      :key="index"
      :comment="comment"
      @update-comment_like_count="comment.like_count = $event"
      @update-comment_is_liking="comment.is_liking = $event"
    />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      sourceId: '',
      offset: null, // 获取下一页数据的标记
      limit: 10, // 服务器默认不能小于10，否则报错。
      error: false // 是否显示评论列表加载失败
    }
  },
  created () {
    // 如果不下拉到文章底部，不会触发onLoad()。如果不触发onLoad，就拿不到评论的条数。这样评论的条数会显示为0，这样显然不合理。所以一加载页面就去触发onLoad
    this.onLoad()
  },
  methods: {
    async onLoad () {
      // 如果传过来的文章id类型是BigNumber对象，且此时this.sourceId是空的，遍历BigNumber对象.c数组（有原来的id拆分的数字组成），把这些数字拼接成1个string（除了类型不是number外，和原来的文章id长得一样），作为文章id参数传递给服务器。
      if (typeof (this.source) === 'object' && !this.sourceId) {
        let str = ''
        this.source.c.forEach(item => {
          str += '' + item
        })
        this.sourceId = str
      }
      try {
        // 1 请求获取数据
        const { data } = await getComments({
          type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.sourceId ? this.sourceId : this.source, // 文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })

        // 2 将数据添加到列表中
        const { results } = data.data // 这里如果要取出total_count必须注意：total_count是服务器返回的数据的命名，这里不允许这样命名，得改成驼峰法totalCount
        this.list.push(...results)
        // 把results传递给父组件
        this.$emit('onload-success', data.data)

        // 3 将loading设置为false
        this.loading = false

        // 4 判断是否还有数据
        if (results.length) {
          // 4-1 有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          // 4-2 没有就将finished设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
