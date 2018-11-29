import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes2'
import store from '../store'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  console.log('to:' + to.path)
  if (to.path === '/') {
    next({ path: '/home' })
  }
  if (to.path.startsWith('/login')) {
    store.commit('logout')
    next()
  } else {
    if (!store.state.token) {
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  }
})

export default router
