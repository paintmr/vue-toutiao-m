<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <!-- 默认插槽会放在右边 -->
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
    :title="history"
    v-for="(history, index) in searchHistories"
    :key="index"
    @click="onSearchHistoryClick(history, index)"
    >
    <!-- v-show比v-if性能开销更小。v-if只能结合v-else来用。v-show不能和v-else合用。 -->
      <van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    /**
     * 普通Props数据（数字，字符串，布尔值）不能修改。即使改了也不会传导给父组件
     * 引用类型props数据（数组，对象）
     *    可以修改，比如[].push() [].splice()
     *    不能重新赋值，比如xxx = []
     */
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 控制删除显示状态
    }
  },
  methods: {
    onSearchHistoryClick (history, index) {
      if (this.isDeleteShow) {
        // 删除状态，删除本条历史记录
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态，直接进入搜索
        this.$emit('search', history)
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
