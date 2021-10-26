<template>
  <div class="follow-fan-list">
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
    >
      <van-button
        slot="title"
        :class="{selectedtab : active === 0 }"
        type="info"
        @click="showFollowing"
      >关注</van-button>
      <van-button
        slot="title"
        :class="{selectedtab : active === 1 }"
        type="info"
        @click="showFans"
      >粉丝</van-button>
      <div
        slot="title"
        class="tab_underline"
        :class="{fanunderline : active === 1 }"
      ></div>
    </van-nav-bar>

    <van-tabs v-model="active">
      <van-tab v-for="index in 2" :key="index">
        <!-- <template #title>选项</template> -->
          <following-list v-if="index===1"/>
          <fan-list v-if="index===2"/>
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
import { setItem, getItem } from '@/utils/storage'
import FollowingList from './components/following-list'
import FanList from './components/fan-list'

export default {
  name: 'FollowFanList',
  components: {
    FollowingList,
    FanList
  },
  data () {
    return {
      active: 0,
      defaultFans: [
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' }
      ]
    }
  },
  created () {
    this.active = getItem('FOLLOW_FAN_ACTIVE_TAB') ? getItem('FOLLOW_FAN_ACTIVE_TAB') : this.$route.params.activeTab
  },
  methods: {
    showFollowing () {
      this.active = 0
      setItem('FOLLOW_FAN_ACTIVE_TAB', this.active)
    },
    showFans () {
      this.active = 1
      setItem('FOLLOW_FAN_ACTIVE_TAB', this.active)
    }
  }
}
</script>

<style scoped lang="less">
.van-nav-bar__title {
  position: relative;
  .tab_underline {
    position: absolute;
    bottom: 15px;
    left: 288px;
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
  .fanunderline {
    transform: translateX(120px);
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
</style>
