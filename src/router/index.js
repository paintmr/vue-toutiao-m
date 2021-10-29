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
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  },
  {
    path: '/search', // 搜索页面
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    path: '/article/:articleId', // 文章详情页面
    name: 'article',
    component: () => import('@/views/article'),
    props: true // 开启props传参，即把路由参数映射到组件的props数据中
  },
  {
    path: '/my/profile', // 查看与编辑自己的信息。
    name: 'myprofile',
    component: () => import('@/views/my-profile')
  },
  {
    path: '/my/followingfans', // 查看关注/粉丝页面
    name: 'followeringfans',
    component: () => import('@/views/my-following-fan-list')
  },
  {
    path: '/my/favhisart', // 收藏/浏览/作品记录
    name: 'favhisart',
    component: () => import('@/views/my-fav-his-art')
  },
  {
    path: '/my/chatrobot', // 聊天机器人
    name: 'chat-robot',
    component: () => import('@/views/chat-robot')
  },
  {
    path: '/my/setting', // 系统设置
    name: 'mysetting',
    component: () => import('@/views/my-setting')
  },
  {
    path: '/user/:userId', // 去到别的用户信息页面   /user/:userId必须放在所有以/user/开头的路由后面，否则进入这些路由时，会进入/user/:userId导向的页面
    name: 'user-others',
    component: () => import('@/views/user-others')
  }
]

const router = new VueRouter({
  routes
})

export default router
