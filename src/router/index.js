import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    // 完整写法是import('@/views/login/index.vue')，当一个文件夹里有index.vue时，省略index.vue，系统会自动加载index.vue
    component: () => import('@/views/login')
  }
]

const router = new VueRouter({
  routes
})

export default router
