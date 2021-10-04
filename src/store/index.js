import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'VUETOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 一个对象，存储当前登录用户信息（token等数据）
    // 用户的登录状态信息
    // user: JSON.parse(window.localStorage.getItem('VUETOUTIAO_USER'))
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      // 为了防止刷新丢失数据，把数据备份到本地存储
      // window.localStorage.setItem('VUETOUTIAO_USER', JSON.stringify(user))
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
