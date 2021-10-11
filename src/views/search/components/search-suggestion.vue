<template>
  <div class="search-suggestion">
    <!-- 左侧图标直接配icon属性 -->
    <van-cell title="联想建议" icon="search"></van-cell>
    <van-cell title="联想建议" icon="search"></van-cell>
    <van-cell title="联想建议" icon="search"></van-cell>
    <van-cell title="联想建议" icon="search"></van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {}
  },
  watch: {
    searchText: {
      // 当searchText改变，调用handler()。handler()名称是固定写法，不要自己任意命名。
      handler (value) {
        console.log(value)
      },
      immediate: true // 侦听开始之后，handler()立即被调用
    }
  }
}
</script>

<style scoped lang="less">

</style>
