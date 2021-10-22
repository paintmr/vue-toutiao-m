<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      :placeholder="replyTarget ?  '回复'+replyTarget+'：' : '请输入留言'"
      show-word-limit
    />
    <van-button
      class="post-btn"
      @click="onPost"
      :disabled="!message.length"
    >发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'

export default {
  name: 'CommentPost',
  components: {},
  // inject接收上上级组件provide的值，可以写在export default中的任意位置
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    },
    replyTarget: {
      type: [Number, String]
    }
  },
  data () {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onPost () {
      // 展示登录中 loading
      // 在组件中通过this.$toast来调用Toast组件
      this.$toast.loading({
        message: '发布中……',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示loading组件的时间，默认 2000毫秒,  0表示持续展示不关闭。同时，新toast调用时，会关闭老toast
      })
      try {
        // 如果是回复评论：
        if (this.replyTarget) {
          this.message = `回复${this.replyTarget}：${this.message}`
          // 每次提交回复后，要把replyTarget置空，否则在comment-reply中回复comment时，会带上这个replyTarget
          this.$emit('deleteReplyTarget')
        }
        // 向服务器提交新增的评论
        const { data } = await addComment({
          target: this.target.toString(),
          content: this.message,
          art_id: typeof this.articleId === 'object' ? this.articleId.toString : this.articleId
        })
        // 关闭弹层和刷新评论列表
        this.$emit('post-comment-success', data.data)
        // 清空文本框
        this.message = ''
        // 提示用户发布评论成功
        this.$toast.success('评论发布成功')
      } catch (err) {
        this.$toast.fail('评论发布失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
