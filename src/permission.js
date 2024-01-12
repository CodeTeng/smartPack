import router from '@/router'
import store from '@/store'

const whiteList = ['/login', '/404']
router.beforeEach((to, from, next) => {
  const token = store.state.user.token
  if (token) {
    // 有 token
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    // 没有 token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
