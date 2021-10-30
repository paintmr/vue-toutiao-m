<template>
  <div class="follow-fan-list-wrap">
    <van-nav-bar
      class="page-nav-bar page-nav-bar-position"
      left-arrow
      @click-left="goBack"
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
          <following-list v-if="index===1" :key="updateFollowingList" @update-following-list="updateFollowingList++"/>
          <fan-list v-if="index===2" :key="updateFanList"/>
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
import { setItem, getItem, removeItem } from '@/utils/storage'
import FollowingList from './components/following-list'
import FanList from './components/fan-list'

export default {
  name: 'FollowFanListWrap',
  components: {
    FollowingList,
    FanList
  },
  data () {
    return {
      active: 1,
      updateFollowingList: 0,
      updateFanList: 0
    }
  },
  created () {
    // 每次加载页面的时候（包括第一次进入和刷新），看localstorage中是否存有FOLLOW_FAN_ACTIVE_TAB，如果有，说明是刷新页面，那么就要在当前tab（关注/粉丝）的基础上去刷新，把恰当的值赋值给active。
    // 如果是从user-others页面退回到本页的，this.$route.params.activeTab=undefined。
    this.active = getItem('FOLLOW_FAN_ACTIVE_TAB') ? getItem('FOLLOW_FAN_ACTIVE_TAB') : this.$route.params.activeTab

    // 如果用户进入页面后，没点击过任何tab，此时刷新页面，active会是undefined，此时默认展示active=0的tab。如果用户顺着粉丝的链接进来的，就得把这个数据保存到localstorage中，防止刷新时显示的是关注tab。
    if (this.$route.params.activeTab === 1) {
      setItem('FOLLOW_FAN_ACTIVE_TAB', 1)
    }
  },
  methods: {
    showFollowing () {
      this.active = 0

      // 用户可以点击tab的时候，说明此时已进入本页面。把这个数据记录到localstorage（即便刷新页面，数据依旧存在），用于判断用户刷新后加载页面时，把哪个tab（关注、粉丝）展现给用户
      setItem('FOLLOW_FAN_ACTIVE_TAB', this.active)

      // 查看下孙组件following-fan-item是否在localstorage里面存储了需要更新following-list的标记。如果有，得重新请求关注列表。请求完了以后，删除这个更新的标记。
      // 重新加载following-list组件的方法：给following-list加个key。改变这个key值，即可。
      if (getItem('update-following-list')) {
        this.updateFollowingList++
      }
      removeItem('update-following-list')
    },
    showFans () {
      this.active = 1

      setItem('FOLLOW_FAN_ACTIVE_TAB', this.active)

      // 查看下孙组件following-fan-item是否在localstorage里面存储了需要更新fan-list的标记。如果有，得重新请求粉丝列表。请求完了以后，删除这个更新的标记。
      // 重新加载fan-list组件的方法：给fan-list加个key。改变这个key值，即可。
      if (getItem('update-fan-list')) {
        this.updateFanList++
      }
      removeItem('update-fan-list')
    },
    goBack () {
      // 用户有可能浏览过很多用户的页面，如果用this.$router.back()会回到这些用户页面，到不了my页面。所以用push最好
      this.$router.push({ name: 'my' })
    }
  },
  beforeDestroy () {
    // 用户离开页面时，把localstorage里的tab值销毁，以便用户下次从my页面进入本页时，可以把通过params把用户选择的tab值（用户点击了关注链接还是粉丝链接）传递过来给active。
    removeItem('FOLLOW_FAN_ACTIVE_TAB')
  }

}
</script>

<style scoped lang="less">
.follow-fan-list-wrap {
  padding-top: 92px;
  .page-nav-bar-position {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
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
}
</style>
