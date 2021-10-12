<template>
  <div class="search-suggestion">
    <!-- 左侧图标直接配icon属性 -->
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 按需加载的好处：只会把用到的成员打包到结果中。全体加载写法：import lodash from 'lodash'
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 搜索联想建议
    }
  },
  watch: {
    searchText: {
      // 当searchText改变，调用handler()。handler()名称是固定写法，不要自己任意命名。
      /**
       * handler (value) {
       *  console.log(value)
       * }
       * 的完整写法
       * handler: function (value) {
       *  console.log(value)
       * }
       */
      // handler (value) {
      //   this.loadSearchSuggestions(value)
      // },
      // 在handler()中调用this.loadSearchSuggestions(value)的时候，加入防抖功能
      // debounce()函数有2个参数。
      // 参数1：一个函数
      // 参数2：延迟时间，单位毫秒。
      // 返回值：防抖之后的函数。每一次侦听到searchText改变，等300毫秒，才会去触发参数1的函数。
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 300),
      immediate: true // 侦听开始之后，handler()立即被调用
    }
  },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('搜索联想推荐数据获取失败')
      }
    },
    highlight (text) {
      const hightlightStr = `<span class="active">${this.searchText}</span>`
      /**
       * text.replace(/sdaf/gi, hightlightStr) 中，gi指全局范围不区分大小写。正则表达式/ /中间的内容都会当作匹配字符，而不是数据变量。
       * 如果需要根据数据变量动态创建正则表达式，用new RegExp()
       * new RegExp()的参数1相当于正则表达式/ /中间的内容，这可以是字符串，也可以是变量。参数2是匹配模式，要写到字符串中。
       * text.replace()不修改text字符串，而是在按需求替换了原来的text后，返回一个新的字符串。
       */
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, hightlightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
