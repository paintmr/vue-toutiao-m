<template>
  <div class="favourites-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <f-h-a-item v-for="(article, index) in list" :key="index" :article="article" :tabIndex="tabIndex" :userId="userId"/>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import FHAItem from './f-h-a-item'
import { getFavouritesList } from '@/api/user'

export default {
  name: 'FavouritesList',
  props: {
    tabIndex: {
      type: Number,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  components: {
    FHAItem
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      page: 1, // 用户列表页数，默认1
      per_page: 10 // 用户列表每页用户数量
    }
  },
  methods: {
    // 初始化或者向上拉屏幕的时候，会触发onLoad，组件自动把loading设置为true。
    // List初始化后触发一次onLoad事件，用于加载第一屏的数据。如果一次请求加载的数据条数较少，以至于数据无法铺满屏幕，List会继续触发onLoad事件，直到内容铺满屏幕或者数据全部加载完成。
    async onLoad () {
      try {
        // 如果是刷新动作onRefresh调用本方法
        if (this.refreshing) {
          this.list = []
          this.page = 1
          this.refreshing = false
        }
        // 1 发起请求，获取数据
        const params = {
          page: this.page,
          per_page: this.per_page
        }
        const { data } = await getFavouritesList(params)
        const { results } = data.data

        // 2 把请求的结果放到list数组中
        // ...是数组的展开操作符，它会把数组元素一个一个拿出来，然后再push进去
        this.list.push(...results)

        // 3 加载状态结束
        // 数据加载结束之后要把加载状态设置为结束
        // loading设置为false以后才能触发下一次的加载
        this.loading = false

        // 4 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取的页数
          this.page++
        } else {
          // 如果数据全部请求完毕，把finished设置为true，之后不再加载更多数据。
          this.finished = true
        }
      } catch (err) {
        // 提示错误
        this.error = true
        this.loading = false
      }
    },
    // 下拉刷新时会触发onRefresh函数。系统自动把refreshing设置为true
    async onRefresh () {
      // 重新加载数据
      this.finished = false
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    }
  }
}
</script>

<style scoped lang="less">
</style>
