<template>
  <div id="app">
    <!-- 路由出口 -->
    <router-view/>
    <h1>黑马头条</h1>
    <div class="box">
      <i class="vuetoutiao vuetoutiao-dianzan"></i>
    </div>
    <van-button type="primary">主要按钮</van-button>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
.box {
  width:750px;
  height: 64px;
  background-color: lightcoral;
}
</style>
