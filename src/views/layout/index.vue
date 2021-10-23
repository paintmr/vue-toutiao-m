<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <router-view />
    <!-- /子路由出口 -->

    <!-- 标签导航栏 -->
    <!-- 在van-tabbar中写上route，表示开启路由模式，那么在控制台的vue中，通过修改active的数字来控制被选中的tab这个功能就失效，因为此时由路由来决定哪个tab被选中。 写上了route，就可以去掉v-model="active"了-->
    <van-tabbar class="layout-tabbar"  route>
      <van-tabbar-item replace to="/">
        <i slot="icon" class="vuetoutiao vuetoutiao-shouye"></i>
        <span class="text">首页</span>
      </van-tabbar-item>
      <!-- <van-tabbar-item replace to="/qa">
        <i slot="icon" class="vuetoutiao vuetoutiao-wenda"></i>
        <span class="text">问答</span>
      </van-tabbar-item>
      <van-tabbar-item replace to="/video">
        <i slot="icon" class="vuetoutiao vuetoutiao-shipin"></i>
        <span class="text">视频</span>
      </van-tabbar-item> -->
      <van-tabbar-item replace to="/my">
        <i slot="icon" class="vuetoutiao vuetoutiao-wode"></i>
        <span class="text">{{ $store.state.user ? '我的' : '未登录' }}</span>
      </van-tabbar-item>
    </van-tabbar>
    <!-- /标签导航栏 -->
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="less">
.layout-container {
  .layout-tabbar {
    i {
      font-size: 40px
    }
    .text{
      font-size: 20px;
    }
  }
}
</style>
