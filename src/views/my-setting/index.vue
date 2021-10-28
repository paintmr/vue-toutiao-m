<template>
  <div class="mysetting">
    <van-nav-bar
      class="page-nav-bar"
      title="系统设置"
      left-arrow
      @click-left="$router.back()"
    />

    <van-cell title="手机号码" is-link />
    <van-cell title="修改密码" is-link />

    <van-cell title="开启后，可以让你的好友找到你" class="gb"/>
    <van-cell title="允许将我推荐给好友">
      <van-switch v-model="checked1" size="18px" slot="right-icon"/>
    </van-cell>

    <van-cell title="开启后，可以向你推荐好友" class="gb"/>
    <van-cell title="允许给我推荐可能认识的人">
      <van-switch v-model="checked2" size="18px" slot="right-icon"/>
    </van-cell>

    <van-cell title="开启后，分享到微信QQ等平台的页面会展示你的头像" class="gb"/>
    <van-cell title="分享页显示我的头像">
      <van-switch v-model="checked3" size="18px" slot="right-icon"/>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'MySetting',
  data () {
    return {
      checked1: true,
      checked2: true,
      checked3: true
    }
  }
}
</script>

<style scoped lang="less">
.gb {
  color: #999;
  background-color: #f5f7f9;
  .van-cell__title {
    height: 30px;
    line-height: 30px;
  }
}
</style>
