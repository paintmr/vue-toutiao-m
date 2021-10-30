<template>
  <div class="my-favourites-history-articles">
    <van-nav-bar
      class="page-nav-bar page-nav-bar-position"
      left-arrow
      @click-left="goBack"
    >
      <van-button
        slot="title"
        :class="{selectedtab : active === 0 }"
        type="info"
        @click="showFavourites"
      >收藏</van-button>
      <van-button
        slot="title"
        :class="{selectedtab : active === 1 }"
        type="info"
        @click="showHistory"
      >历史</van-button>
      <van-button
        slot="title"
        :class="{selectedtab : active === 2 }"
        type="info"
        @click="showArticles"
      >作品</van-button>
      <div
        slot="title"
        class="tab_underline"
        :class="{historyunderline : active === 1, worksunderline : active === 2 }"
      ></div>
    </van-nav-bar>

    <van-tabs v-model="active">
      <van-tab v-for="index in 3" :key="index">
          <favourites-list v-if="index===1" :tabIndex="0" :userId="userId"/>
          <history-list v-if="index===2" :tabIndex="1" :userId="userId"/>
          <articles-list v-if="index===3" :tabIndex="2" :userId="userId"/>
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
import { setItem, getItem, removeItem } from '@/utils/storage'
import FavouritesList from './components/favourites-list'
import HistoryList from './components/history-list'
import ArticlesList from './components/articles-list'

export default {
  name: 'MyFavouritesHistoryArticles',
  data () {
    return {
      active: 1,
      userId: null
    }
  },
  components: {
    FavouritesList,
    HistoryList,
    ArticlesList
  },
  created () {
    // 每次加载页面的时候（包括第一次进入和刷新），看localstorage中是否存有F_H_A_ACTIVE_TAB，如果有，说明是刷新页面，那么就要在当前tab（收藏/历史）的基础上去刷新，把恰当的值赋值给active。
    this.active = getItem('F_H_A_ACTIVE_TAB') ? getItem('F_H_A_ACTIVE_TAB') : this.$route.params.activeTab

    // 如果用户进入页面后，没点击过任何tab，此时刷新页面，active会是undefined，此时默认展示active=0的tab。如果用户顺着历史或者作品的链接进来的，就得把这个数据保存到localstorage中，防止刷新时显示的是收藏tab。
    if (this.$route.params.activeTab === 1) {
      setItem('F_H_A_ACTIVE_TAB', 1)
    } else if (this.$route.params.activeTab === 2) {
      setItem('F_H_A_ACTIVE_TAB', 2)
    }

    // 给userId赋值
    this.userId = getItem('USERID') ? getItem('USERID') : this.$route.params.userId
    // 如果用户进入页面后，刷新页面，params里面的数据会被清空，得把params里的userId保存在localstorage，以便用户刷新页面后，也能请求作品articles
    if (this.$route.params.userId) {
      setItem('USERID', this.$route.params.userId)
    }
  },
  methods: {
    showFavourites () {
      this.active = 0

      // 用户可以点击tab的时候，说明此时已进入本页面。把这个数据记录到localstorage（即便刷新页面，数据依旧存在），用于判断用户刷新后加载页面时，把哪个tab（收藏、历史）展现给用户
      setItem('F_H_A_ACTIVE_TAB', this.active)
    },
    showHistory () {
      this.active = 1

      setItem('F_H_A_ACTIVE_TAB', this.active)
    },
    showArticles () {
      this.active = 2

      setItem('F_H_A_ACTIVE_TAB', this.active)
    },
    goBack () {
      // 用户有可能浏览过很多文章详情的页面，如果用this.$router.back()会回到这些文章详情页面，到不了my页面。所以用push最好
      this.$router.push({ name: 'my' })
    }
  },
  beforeDestroy () {
    // 用户离开页面时，把localstorage里的tab值销毁，以便用户下次从my页面进入本页时，可以把通过params把用户选择的tab值（用户点击了关注链接还是粉丝链接）传递过来给active。
    removeItem('F_H_A_ACTIVE_TAB')
    removeItem('USERID')
  }
}
</script>

<style scoped lang="less">
.my-favourites-history-articles {
  padding-top: 92px;
  .page-nav-bar-position {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
  }
  .van-nav-bar__title {
    position: relative;
    .tab_underline {
      position: absolute;
      bottom: 15px;
      left: 229px;
      z-index: 1;
      width: 56px;
      height: 5px;
      background-color: #fff;
      border-radius: 2px;
      transition-duration: 0.3s;
    }
    .selectedtab {
      font-weight: 700;
    }
    .historyunderline {
      transform: translateX(118px);
      transition-duration: 0.3s;
    }
    .worksunderline {
      transform: translateX(241px);
      transition-duration: 0.3s;
    }
    .van-button--info {
      color: #fff;
      background-color: #3296fa;
      border: 1px solid #3296fa;
    }
  }
  /deep/ .van-tabs__wrap {
    display: none;
  }
}
</style>
