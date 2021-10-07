<template>
  <van-cell class="article-item">
    <!-- van-multi-ellipsis--l2是vant的内置样式，最多两行显示文字，多余的用省略号代替 -->
    <div class="title van-multi-ellipsis--l2" slot="title">{{ article.title }}</div>
    <div class="label" slot="label">
      <div v-if="article.cover.type === 3" class="cover-wrap">
        <div class="cover-item" v-for="(img, index) in article.cover.images" :key="index">
          <van-image
            fit="cover"
            :src="img"
            class="cover-item-img"
          />
        </div>
      </div>
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}</span>
        <span>{{ article.pubdate | relativeTime}}</span>
      </div>
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
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
.article-item {

  .title {
    font-size: 32px;
    color: #3a3a3a;
  }

  .label {
    .cover-wrap {
      display:flex;
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
          height: 146px;
        }
      }
    }
    .label-info-wrap span{
      font-size: 22px;
      color: #b4b4b4;
      margin-right: 25px;
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
</style>
