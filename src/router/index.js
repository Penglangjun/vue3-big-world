import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
// 还有一个createHashHistory
const router = createRouter({// vite中的环境变量 就是vite.config.js 中的配置项
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页
    { path: '/login', component: () => import('@/views/login/LoginPage.vue')},
    { path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },{
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        },
      ]
    }
  ]
})
// 没有token，直接拦截
router.beforeEach((to) => {
  const userStore = useUserStore()
  if(!userStore.token && to.path !== '/login')
    return '/login'
})

export default router
