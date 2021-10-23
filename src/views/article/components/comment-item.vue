<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
      @click="toUserInfo"
    />

    <div slot="title" class="title-wrap">
      <div class="user-name" @click="toUserInfo">{{ comment.aut_name }}</div>
      <van-button
        class="like-btn"
        :class="{
          liked: comment.is_liking
        }"
        :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
        :loading="commentLikeLoading"
        @click="onCommentLike"
      >{{ comment.like_count || '赞' }}</van-button>
    </div>

    <div slot="label">
      <p class="comment-content">{{ comment.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{ comment.pubdate | relativeTime }}</span>
        <!-- button的点击事件：给父组件comment-list传递reply-click事件和comment参数 -->
        <van-button
          class="reply-btn"
          round
          @click="$emit('reply-click', comment)"
        >回复 {{ isShowingReplyList ? '' : comment.reply_count }}</van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, cancelCommentLike } from '@/api/comment'

export default {
  name: 'CommentItem',
  components: {},
  props: {
    comment: {
      type: Object,
      required: true
    },
    // 接收祖父组件comment-reply通过comment-list传过来的参数，如果为true，那么现在展示的是某条comment的reply列表，所以不用在comment-item中显示回复数量
    isShowingReplyList: {
      type: Boolean
    }
  },
  data () {
    return {
      commentLikeLoading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onCommentLike () {
      this.commentLikeLoading = true
      try {
        if (this.comment.is_liking) {
          // 已赞，取消点赞
          // 更新服务器数据
          await cancelCommentLike(this.comment.com_id)
          // 更新浏览器视图
          if (this.comment.like_count > 0) {
            this.$emit('update-comment_like_count', this.comment.like_count - 1)
          }
        } else {
          // 未赞，点赞
          await addCommentLike(this.comment.com_id)
          this.$emit('update-comment_like_count', this.comment.like_count + 1)
        }
        this.$emit('update-comment_is_liking', !this.comment.is_liking)
      } catch (err) {
        this.$toast('操作失败，请重试')
      }
      this.commentLikeLoading = false
    },
    toUserInfo () {
      this.$router.push({ name: 'user-others', params: { userId: this.comment.aut_id } })
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    // 在恰当的断字点进行换行。break-all允许在单词内换行。
    word-break: break-all;
    // 它实现两端对齐文本效果
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    // width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
    &.liked { // &表示当前选择器的父级
      color: #e5645f;
    }
  }
}
</style>
