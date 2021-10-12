<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="搜索结果加载失败，请重试"
    >
      <van-cell v-for="(article, index) in list" :key="index" :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'

export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false // 默认不展示搜索结果加载失败的样式
    }
  },
  methods: {
    async onLoad () {
      try {
        // 1 请求获取数据
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.perPage, // 每页大小
          q: this.searchText // 查询关键词
        })

        // 用来演示加载失败的测试代码
        // if (Math.random() > 0.5) {
        //   JSON.parse('dasdfasd')
        // }

        // 2 将数据添加到数组列表中
        const { results } = data.data
        this.list.push(...results)

        // 3 将本次加载中的loading关闭
        this.loading = false

        // 4 判断是否还有数据
        if (results.length) {
          // 如果有，则更新获取下一组数据的页码
          this.page++
        } else {
          // 如果没有，则将加载状态finished设置为结束
          this.finished = true
        }
      } catch (err) {
        // 展示加载失败的提示
        this.error = true
        // 关闭loading提示
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
