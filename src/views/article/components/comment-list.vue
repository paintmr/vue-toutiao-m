<template>
<!-- created中调用了this.onLoad()，以便已进入文章详情页就能拿到评论的总数。但van-list有个默认功能：滚动到van-list所在的组件时，自动触发onLoad函数。而针对某条评论的回复也会用到comment-list这个组件。这样就导致在获取某条评论的回复列表时，会很快地先后2次触发onLoad，造成展示的数据重复。为了避免这种bug，设置:immediate-check="false" -->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :error="error"
    error-text="加载失败，请点击重试"
    :immediate-check="false"
  >
  <!-- @reply-click：用$event接收子组件comment-item传过来的comment参数，并传递给父组件article/index.vue -->
    <comment-item
      v-for="(comment,index) in list"
      :key="index"
      :comment="comment"
      @update-comment_like_count="comment.like_count = $event"
      @update-comment_is_liking="comment.is_liking = $event"
      @reply-click="$emit('reply-click', $event)"
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
    },
    list: {
      type: Array,
      default: () => [] // 如果父组件传了值过来，就用父组件的，如果父组件没传值，就用自己的。
    },
    type: {
      type: String,
      // 自定义prop数据验证，希望type的值要么是a，要么是c，不能是别的。value是type的值。return一个布尔值，true是验证通过，false是验证失败。
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'// 普通类型的默认值直接访问即可。引用类型的默认值，比如上面的list中的数组，需要通过函数来访问。
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10, // 服务器默认不能小于10，否则报错。
      error: false // 是否显示评论列表加载失败
    }
  },
  created () {
    // 如果不下拉到文章底部，不会触发onLoad()。如果不触发onLoad，就拿不到评论的条数。这样评论的条数会显示为0，这样显然不合理。所以一加载页面就去触发onLoad
    // 自己触发onLoad时，不会自动触发loading动画，所以要手动设置一下this.loading = true
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad () {
      try {
        // 1 请求获取数据
        const { data } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 文章id或评论id。
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
