<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
      >
        搜索
      </van-button>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <!-- swipeable可以开启滑动切换标签页效果。要swipeable生效，必须有:key -->
    <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
    <van-tabs v-model="active" class="channel-tabs" animated swipeable>
      <van-tab v-for="channel in channels" :title="channel.name" :key="channel.id">
        <!-- 每个channel下的文章列表 -->
        <article-list :channel="channel" />
      </van-tab>
      <!-- class="placeholder"的占位符是为了防止有最后一个tab的内容被class="hamburger-btn"这个按钮给挡住。 -->
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow = true">
        <i class="vuetoutiao vuetoutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      :style="{ height: '100%' }"
      close-icon-position="top-left"
    >
      <channel-edit :my-channels="channels" :active="active" @update-active="onUpdateActive" />
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0,
      channels: [], // 用户频道列表
      isChannelEditShow: false// 控制编辑频道弹出层的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels
        let channels = []
        if (this.user) {
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录，判断是否有本地的频道列表数据
          const localChannels = getItem('VUETOUTIAO_CHANNELS')
          if (localChannels) {
            // 有，拿来用
            channels = localChannels
          } else {
            // 没有,请求获取默认频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取用户频道数据失败')
      }
    },
    onUpdateActive (index, isChannelEditShow = true) {
      // 更新选中的频道
      this.active = index
      // 关闭编辑频道弹层
      this.isChannelEditShow = isChannelEditShow
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
      max-width: unset;
  }

  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs{
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      // 因为.placeholder的父节点.van-tabs__nav设置了display:flex。如果.placeholder中不写flex-shrink，就无法设置width。
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.vuetoutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
