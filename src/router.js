import Vue from 'vue'
import Router from 'vue-router'
import store from './store';
import Home from './views/Home.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        { path: '/', name: 'empty-page', component: () => import('@/views/EmptyPage.vue') },
        { path: '/connection/create', name: 'connection-create', component: () => import('@/views/ConnectionCreate.vue') },
        { path: '/connections/:id', name: 'connection-details', component: () => import('@/views/ConnectionDetails.vue') },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.name === 'empty-page') {
    if (store.state.connections.length > 0) {
      const defaultConnection = store.state.connections[0]
      next({ path: `/connections/${defaultConnection.id}` })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
