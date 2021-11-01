<template>
  <div class="f-h-a-item">
    <van-cell
      class="article-item"
      :to="{
        name: 'article', // 路由中设定的名称
        params: {
          articleId: article.art_id, // articleId是路由中设定的参数名称
          tabIndex: tabIndex,
          userId: userId
        }
      }"
    >
      <!-- van-multi-ellipsis--l2是vant的内置样式，最多两行显示文字，多余的用省略号代替 -->
      <div class="title van-multi-ellipsis--l2" slot="title" :class="{titleheight: article.cover.type === 1 }">{{ article.title }}</div>
      <div class="label" slot="label">
        <div v-if="article.cover.type === 3" class="cover-wrap">
          <div class="cover-item" v-for="(img, index) in article.cover.images" :key="index">
            <van-image
              fit="cover"
              class="cover-item-img"
              :src="img"
            />
          </div>
        </div>
        <div class="label-info-wrap">
          <span>{{ article.aut_name }}</span>
          <span>{{ article.pubdate | relativeTime}}</span>
        </div>
        <div class="comment-like-favourites-wrap-height"></div>
      </div>
      <!-- fit="cover"让短边都显示出来，长边有些内容看不见。这样防止拉伸图片。 -->
      <van-image
        v-if="article.cover.type === 1"
        slot="default"
        class="right-cover"
        fit="cover"
        :src="article.cover.images[0]"
      />
    </van-cell>

    <div class="comment-like-favourites-wrap">
      <div class="item" @click="isWriteCommentShow=true">
        <van-icon class="comment-icon" name="comment-o" />
        <span>{{ article.comm_count ? article.comm_count : '评论'}}</span>
      </div>
      <div class="item" @click="onLike">
        <van-icon
          class="btn-item"
          :name="article.is_liking === true ? 'good-job' : 'good-job-o'"
          :color="article.is_liking === true ? '#e5645f' : ''"
          :loading="loading"
        />
        <span>{{ article.like_count ? article.like_count : '点赞'}}</span>
      </div>
      <div class="item">
        <van-icon name="star-o" />
        <span>{{ article.collect_count ? article.collect_count : '收藏'}}</span>
      </div>
    </div>

    <!-- 发布评论弹出层(不设置高度，由内容自行撑开) -->
    <van-popup
      v-if="isWriteCommentShow"
      v-model="isWriteCommentShow"
      position="bottom"
    >
      <comment-post
        :target="article.art_id"
        @post-comment-success="onPostCommentSuccess"
      />
    </van-popup>
    <!-- /发布评论弹出层 -->
  </div>
</template>

<script>
import CommentPost from '@/components/comment-post'
import { addLike, cancelLike } from '@/api/article'

export default {
  name: 'FHAItem',
  components: {
    CommentPost
  },
  props: {
    article: {
      type: Object,
      required: true
    },
    tabIndex: {
      type: Number,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      isWriteCommentShow: false, // 是否显示撰写文章评论弹出层
      loading: false, // 点赞/取消点赞时的loading
      likeFlag: true // 点赞时的记号，防止用户快速点击时多次调用onLike
    }
  },
  methods: {
    onPostCommentSuccess () {
      // 关闭弹层
      this.isWriteCommentShow = false

      // 更新评论总条数
      this.$emit('update-comm_count')
    },
    async onLike () {
      if (this.likeFlag) {
        this.likeFlag = false
        this.loading = true
        // 更新数据库
        try {
          if (this.article.is_liking === true) {
            // 已点赞，取消点赞
            await cancelLike(this.article.art_id)
            // 通知list更新点赞的视图和数据
            this.article.is_liking = false
            this.article.like_count--
          } else {
            // 未点赞，点赞文章
            await addLike(this.article.art_id)
            // 通知list更新点赞的视图和数据
            this.article.is_liking = true
            this.article.like_count++
          }
          this.$toast.success(this.article.is_liking === false ? '取消点赞' : '点赞成功')
        } catch (err) {
          this.$toast.fail('操作失败，请重试！')
        }
        this.loading = false
        this.likeFlag = true
      }
    }
  }
}
</script>

<style scoped lang="less">
.f-h-a-item {
  position: relative;
  .article-item {
    position: relative;
    margin-bottom: 6px;
    .title {
      line-height: 55px;
      font-size: 32px;
      color: #3a3a3a;
    }
    .titleheight {
      height: 100px;
    }
    .label {
      .cover-wrap {
        display: flex;
        padding: 30px 0;
        .cover-item {
          flex: 1;
          height: 146px;
          // 不包括.cover-item的最后一个子元素
          &:not(:last-child) {
            padding-right: 4px;
          }
          .cover-item-img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .label-info-wrap {
        margin-bottom: 10px;
        span{
          font-size: 22px;
          color: #b4b4b4;
          margin-right: 25px;
        }
      }

      .comment-like-favourites-wrap-height {
        height: 92px;
      }
    }

    .van-cell__value {
      flex: unset;
      width: 232px;
      height: 146px;
      padding-left: 25px;
      .right-cover {
        width: 232px;
        height: 146px;
      }
    }
  }

  .comment-like-favourites-wrap {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    width: 90%;
    border-top: 1px solid #ececec;
    border-bottom: 1px solid #ececec;
    padding: 10px;
    display: flex;
    .item {
      width: 33.33%;
      height: 90px;
      line-height: 90px;
      text-align: center;
      font-size: 33px;
      color: #333;
      .van-icon {
        margin-right: 10px;
      }
      &:not(:last-child) {
        border-right: 1px solid #ececec;
      }
    }
  }
}
</style>
