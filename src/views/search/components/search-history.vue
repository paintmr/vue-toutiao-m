<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <span>全部删除</span>
      <span>完成</span>
      <!-- 默认插槽会放在右边 -->
      <van-icon name="delete" />
    </van-cell>
    <van-cell title="\(^o^)/~">
      <van-icon name="close" />
    </van-cell>
    <van-cell title="\(^o^)/~">
      <van-icon name="close" />
    </van-cell>
    <van-cell title="\(^o^)/~">
      <van-icon name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory'
}
</script>

<style scoped lang="less">

</style>
