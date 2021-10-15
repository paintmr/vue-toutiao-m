<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical></van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime}}</div>

          <!-- 关注和取关源代码 -->
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            @click="onFollow"
            :loading="followLoading"
          >已关注</van-button>
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="onFollow"
            :loading="followLoading"
          >关注</van-button> -->

          <!-- 组件化之后的关注和取关代码 -->
          <!-- <follow-user
            :is-followed="article.is_followed"
            class="follow-btn"
            :user-id="article.aut_id"
            @update-is_followed="article.is_followed = $event"
          /> -->

          <!-- v-model的关注和取关代码 -->
          <follow-user
            v-model="article.is_followed"
            class="follow-btn"
            :user-id="article.aut_id"
          />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- /文章内容 -->

        <!-- 把底部区域放到这里，确保在有数据以后，再加载底部区域。否则评论、收藏等需要数据的组件没有数据，需要刷新才能正常显示。 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
          >写评论</van-button>
          <van-icon
            class="comment-icon"
            name="comment-o"
            badge="123"
          />
          <!-- <van-icon
            name="star-o"
            color="#777"
          /> -->
          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          />
          <!-- <van-icon
            class="btn-item"
            name="good-job-o"
            color="#777"
          /> -->
          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
          />
          <van-icon
            name="share"
            color="#777"
          />
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（如网络原因或服务单异常 -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它位置错误（如网络原因或服务单异常 -->
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle
  },
  props: {
    articleId: {
      type: [Number, String, Object], // 如果从文章列表跳转到某篇文章详情，articleId是数字；如果直接输入URL访问文章详情，articleId是字符串。还要考虑到JSONBig.parse(data) 會把超出 JS 安全整數範圍的數字轉為一個 BigNumber 類型的對象的情况。
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的loading状态
      errStatus: 0, // 失败状态码
      followLoading: false
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)

        // 模拟随机请求失败的代码。随机给代码插入一段非JSON格式的代码
        // if (Math.random() > 0.5) {
        //   JSON.parse('dasdfasd')
        // }

        this.article = data.data

        // 初始化图片点击预览
        // 得到数据，渲染画面，这两个步骤之间有时间差。所以立即执行console.log(this.$refs['article-content'])打印出来是undefined。得延迟一下。
        setTimeout(() => {
          // console.log(this.$refs['article-content'])
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        console.log('获取数据失败', err)
      }
      // 不论请求成功或失败，都停止loading
      this.loading = false
    },
    previewImage () {
      // 得到所有的img节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // 得到所有图片的地址
      const imgsSrc = []
      imgs.forEach((img, index) => {
        imgsSrc.push(img.src)
        // 给每个图片注册点击事件
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images: imgsSrc,
            startPosition: index // 起始位置，从0开始
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";

.article-container {

  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }

  .article-detail {

    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cel__lable {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
    }
    .comment-icon {
      top: 2px;
      color: #777;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777
    }
  }
}
</style>
