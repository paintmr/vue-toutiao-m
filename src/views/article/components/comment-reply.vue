<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'">
      <van-icon
        slot="left"
        name="cross"
        @click="$emit('close-write-reply-show')"
      />
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <comment-item
        :comment="comment"
        @update-comment_like_count="comment.like_count = $event"
        @update-comment_is_liking="comment.is_liking = $event"
        @reply-click="$emit('reply-click', $event)"
      />
      <!-- /当前评论项 -->

      <van-cell title="所有回复" />

      <!-- 评论的回复列表 -->
      <!-- :list = "commentList"可以放父组件拿到子组件的数据 -->
      <comment-list
        :source="comment.com_id"
        type="c"
        :list = "commentList"
        @reply-click="fromCommentReplyItem($event)"
        :isShowingReplyList="isShowingReplyList"
      />
      <!-- /评论的回复列表 -->
    </div>

    <!-- 底部发布评论区域 -->
    <div class="post-wrap">
      <van-button size="small" round class="post-btn" @click="onReplyClick">回复层主</van-button>
    </div>
    <!-- /底部发布评论区域 -->

    <!-- 撰写评论弹出层(不设置高度，由内容自行撑开) -->
    <van-popup v-model="isWriteReplyShow" position="bottom">
      <comment-post
        v-if="isWriteReplyShow"
        :target="comment.com_id"
        @post-comment-success="onPostCommentReplySuccess"
        :replyTarget="reply.aut_name"
        @deleteReplyTarget="reply={}"
        @reply-click="onReplyClick($event)"
      />
    </van-popup>
    <!-- /撰写评论弹出层 -->
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentPost from '@/components/comment-post'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: [Object],
      required: true
    }
  },
  data () {
    return {
      isWriteReplyShow: false, // 是否显示撰写回复评论的弹出层
      commentList: [],
      reply: {}, // 被回复的reply
      isShowingReplyList: true // 通过comment-list告诉comment-item，现在展示的是某条comment的reply列表，所以不用在comment-item中显示回复数量
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onPostCommentReplySuccess (data) {
      // 更新回复数量
      const replyCount = this.comment.reply_count
      this.$emit('update-comment_reply_count', replyCount + 1)
      // 关闭弹层
      this.isWriteReplyShow = false
      // 刷新评论列表，把最新回复显示到回复列表顶部。
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick () {
      this.reply = this.comment
      // 显示撰写回复评论的弹出层
      this.isWriteReplyShow = true
    },
    fromCommentReplyItem (event) {
      this.reply = event
      // 显示撰写回复评论的弹出层
      this.isWriteReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}

// left: 0;和right: 0;是为了让盒子左右撑开
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #e8e8e8;
  .post-btn {
    width: 60%;
  }
}
</style>
