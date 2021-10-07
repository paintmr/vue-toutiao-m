<template>
  <div class="article-list">
    <van-pull-refresh v-model="isRefreshLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <!-- <van-cell v-for="(article, index) in list" :key="index" :title="article.title" /> -->
        <article-item v-for="(article, index) in list" :key="index" :article="article" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制 加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isRefreshLoading: false, // 控制下拉刷新的loading状态
      refreshSuccessText: '刷新数据成功' // 下拉刷新成功提示文本
    }
  },
  methods: {
    // 初始化或者向上拉屏幕的时候，会触发onLoad，组件自动把loading设置为true。
    // List初始化后触发一次onLoad事件，用于加载第一屏的数据。如果一次请求加载的数据条数较少，以至于数据无法铺满屏幕，List会继续触发onLoad事件，直到内容铺满屏幕或者数据全部加载完成。
    async onLoad () {
      try {
        // 1 发起请求，获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id，又父组件通过props传过来的
          timestamp: this.timestamp || Date.now(), // 类似于分页显示的页码。请求第1页数据：当前最新时间戳。用于请求之后数据的时间戳会在当前请求结果中返回给你。
          with_top: 1// 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含。这个接口里没有这类数据，所以不论设置0还是1，结果都一样。
        })
        const { results } = data.data

        // 模拟随机请求失败的代码。随机给代码插入一段非JSON格式的代码
        // if (Math.random() > 0.5) {
        //   JSON.parse('dasdfasd')
        // }

        // 2 把请求的结果放到list数组中
        // ...是数组的展开操作符，它会把数组元素一个一个拿出来，然后再push进去
        this.list.push(...results)

        // 3 加载状态结束
        // 数据加载结束之后要把加载状态设置为结束
        // loading设置为false以后才能触发下一次的加载
        this.loading = false

        // 4 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
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
    // 下拉刷新时会触发onRefresh函数。系统自动把isRefreshLoading设置为true
    async onRefresh () {
      // 1 请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id，又父组件通过props传过来的
          timestamp: Date.now(), // 类似于分页显示的页码。下拉刷新时就用当前的时间戳。
          with_top: 1// 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含。这个接口里没有这类数据，所以不论设置0还是1，结果都一样。
        })
        // 模拟随机请求失败的代码。随机给代码插入一段非JSON格式的代码
        // if (Math.random() > 0.5) {
        //   JSON.parse('dasdfasd')
        // }
        // 2 将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 3 更新下拉刷新成功提示文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
        // 4 关闭下拉刷新的loading状态
        this.isRefreshLoading = false
      } catch (err) {
        this.refreshSuccessText = '刷新失败'
        this.isRefreshLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
