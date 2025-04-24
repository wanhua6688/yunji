import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/phone/:mobileId',
      name: 'Phone',
      component: () => import('@/views/YunJi/index.vue'),
      props: true,
    },
    {
      path: '/s/:mobileId',
      name: 'SharePhone',
      component: () => import('@/views/SharePhone/index.vue'),
    },
  ],
})

export default router
