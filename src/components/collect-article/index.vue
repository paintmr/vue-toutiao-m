<template>
  <van-icon
    :name="collected ? 'star' : 'star-o'"
    :color="collected ? '#ffa500' : ''"
    @click="onCollect"
    :loading="loading"
  />
</template>

<script>
import { addCollect, cancelCollect } from '@/api/article'

export default {
  name: 'CollectArticle',
  model: {
    prop: 'collected',
    event: 'update-collected'
  },
  props: {
    collected: {
      type: Boolean,
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
    async onCollect () {
      this.loading = true
      // 更新数据库
      try {
        if (this.collected) {
          // 已收藏，取消收藏
          await cancelCollect(this.articleId)
        } else {
          // 未收藏，收藏文章
          await addCollect(this.articleId)
        }
        // 更新视图
        this.$emit('update-collected', !this.collected)
        // 提示(修改父组件的数据并非即时的，所以用!this.collected)
        this.$toast.success(!this.collected ? '收藏成功' : '取消收藏')
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
