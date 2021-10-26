<template>
  <div class="Fan-list">
    fan-list
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多用户了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <van-cell v-for="(user, index) in list" :key="index" :title="user.name" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getFanList } from '@/api/user'

export default {
  name: 'FanList',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      refreshSuccessText: '刷新数据成功',
      page: 1, // 用户列表页数，默认1
      per_page: 10, // 用户列表每页用户数量
      defaultFans: [
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' },
        { name: 'qaz' }
      ]
    }
  },
  created () {
  },
  methods: {
    async onLoad () {
      try {
        // 1 发起请求，获取数据
        const params = {
          page: this.page,
          per_page: this.per_page
        }
        const { data } = await getFanList(params)
        const { results } = data.data

        // 2 把请求的结果放到list数组中
        // ...是数组的展开操作符，它会把数组元素一个一个拿出来，然后再push进去
        if (results.length) {
          this.list.push(...results)
        } else {
          this.list.push(...this.defaultFans)
        }

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
      // 1 发起请求，获取数据
      const params = {
        page: this.page,
        per_page: this.per_page
      }
      const { data } = await getFanList(params)
      const { results } = data.data

      // 2 把请求的结果放到list数组中
      this.list.push(...results)

      // 3 更新下拉刷新成功提示文本
      this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`

      // 4 关闭下拉刷新的loading状态
      this.refreshing = false
    }
  }
}
</script>

<style scoped lang="less">
</style>
