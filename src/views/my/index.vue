<template>
  <div class="my-container">

    <!-- 已登录头部 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image
            :src="userInfo.photo"
            class="avatar"
            round
            fit="cover"
          />
          <span class="nickname">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button
            size="mini"
            round
            to="/my/profile"
          >编辑资料</van-button>
        </div>
      </div>
      <div class="data-status">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item" @click="toFollowingFansPage(0)">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item" @click="toFollowingFansPage(1)">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- /已登录头部 -->

    <!-- 未登录头部 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="">
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- /未登录头部 -->

    <!-- 宫格导航 -->
    <van-grid clickable :column-num="3" class="grid-nav mb-9">
      <van-grid-item
        class="grid-item"
        :to="{
          name: 'favhisart', // 路由中设定的名称
          params: {
            activeTab: 0,
            userId: userInfo.id
          }
        }"
      >
        <i slot="icon" class="vuetoutiao vuetoutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item
        class="grid-item"
        :to="{
          name: 'favhisart', // 路由中设定的名称
          params: {
            activeTab: 1,
            userId: userInfo.id
          }
        }"
      >
        <i slot="icon" class="vuetoutiao vuetoutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
      <van-grid-item
        class="grid-item"
        :to="{
          name: 'favhisart', // 路由中设定的名称
          params: {
            activeTab: 2,
            userId: userInfo.id
          }
        }"
      >
        <i slot="icon" class="vuetoutiao vuetoutiao-zuopin"></i>
        <span slot="text" class="text">作品</span>
      </van-grid-item>
    </van-grid>
    <!-- /宫格导航 -->

    <!-- 单元格 -->
    <!-- is-link默认带有ble的效果 -->
    <!-- :to="{ name: 'a' }" -->
    <van-cell title="小智同学" is-link to="/my/chatrobot" />
    <van-cell
      title="系统设置"
      is-link
      class="mb-9"
      to="/my/setting"
    />
    <van-cell v-if="user" class="logout-cell" clickable title="退出登录" @click="onLogout" />
    <!-- /单元格 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'

export default {
  name: 'MyIndex',
  data () {
    return {
      userInfo: {} // 用户信息
    }
  },
  computed: {
    // 把vuex容器里的数据映射到当前组件中。这样就能像访问当前组件的数据一样访问vuex容器中的数据。
    ...mapState(['user'])
  },
  created () {
    // 如果用户登录了，请求加载用户信息数据
    if (this.user) {
      this.loadUserInfo()
    }
  },
  methods: {
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取数据失败，请稍后重试')
      }
    },
    onLogout () {
      // 退出提示
      // 在组件中使用 this.$dialog来调用弹框组件
      this.$dialog.confirm({
        title: '确认退出吗？'
      }).then(() => {
        // on confirm
        // 确认退出：清除登录状态（容器中的user + 本地存储中的user）
        this.$store.commit('setUser', null)
      }).catch(() => {
        // on cancel
        console.log('取消执行这里')
      })
    },
    toFollowingFansPage (activeTab) {
      this.$router.push({ name: 'followeringfans', params: { activeTab: activeTab } })
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    // background: url("../../assets/banner.png"); // 这行代码也可以改成下面这样用~@引导的路径。~@等于src。css中的~@引导路径和js中的@引导路径一样的作用。
    background: url("~@/assets/banner.png");
    background-size: cover;
  }

  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 5px solid #fff;
        }
        .nickname {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-status {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .vuetoutiao-shoucang {
        color: #eb5253;
      }
      .vuetoutiao-lishi {
        color: #ff9d1d;
      }
      .vuetoutiao-zuopin {
        color: #409dfa;
      }
      span.text {
        font-size: 28px;
      }
    }
  }

  .logout-cell {
  text-align: center;
  color: #d86262;
  }

  .mb-9 {
    margin-bottom: 9px;
  }
}
</style>
