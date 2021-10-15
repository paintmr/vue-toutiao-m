<template>
    <van-icon
    :name="liked === 1 ? 'good-job' : 'good-job-o'"
    :color="liked === 1 ? '#e5645f' : ''"
    @click="onLike"
    :loading="loading"
  />
</template>

<script>
import { addLike, cancelLike } from '@/api/article'

export default {
  name: 'LikeArticle',
  model: {
    prop: 'liked',
    event: 'update-liked'
  },
  props: {
    liked: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onLike () {
      this.loading = true
      // 更新数据库
      try {
        if (this.liked === 1) {
          // 已点赞，取消点赞
          await cancelLike(this.articleId)
          // 更新视图
          this.$emit('update-liked', 0)
        } else {
          // 未点赞，点赞文章
          await addLike(this.articleId)
          // 更新视图
          this.$emit('update-liked', 1)
        }
        // 提示(修改父组件的数据并非即时的，所以用子组件的this.liked数据状态)
        this.$toast.success(this.liked === 1 ? '取消点赞' : '点赞成功')
      } catch (err) {
        this.$toast.fail('操作失败，请重试！')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">

</style>
