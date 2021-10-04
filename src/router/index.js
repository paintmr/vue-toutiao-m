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
  },
  {
    path: '/',
    // name: 'layout', //如果有children（子路由），这个name: 'layout'的设置就没有意义了。可以注销
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // 这个参数留空，是默认的子路由。默认子路由只能有1个
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
