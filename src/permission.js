import router from '@/router'
import store from '@/store'
import asyncRoutes from '@/router/asyncRoutes'

const whiteList = ['/login', '/404']

// 处理一级路由权限数据
function getFirstRoutePermissions(permissionList) {
  const firstPermissionArr = permissionList.map(item => item.split(':')[0])
  return Array.from(new Set(firstPermissionArr))
}

// 处理二级路由权限数据
function getSecondRoutePermissions(permissionList) {
  const secondPermissionArr = permissionList.map(item => {
    const permissionArr = item.split(':')
    return `${permissionArr[0]}:${permissionArr[1]}`
  })
  return Array.from(new Set(secondPermissionArr))
}

// 得到最终路由
function getRoutes(firstPermissions, secondPermissions, asyncRoutes) {
  // 判断当前登陆人是否是管理员
  if (firstPermissions.includes('*')) {
    return asyncRoutes
  }
  return asyncRoutes.filter(firstRoute => firstPermissions.includes(firstRoute.permission)).map(item => {
    return {
      ...item,
      children: item.children.filter(item => secondPermissions.includes(item.permission))
    }
  })
}

router.beforeEach(async(to, from, next) => {
  const token = store.state.user.token
  if (token) {
    // 有 token
    if (to.path === '/login') {
      next('/')
    } else {
      next()
      // 1. 拿到用户的权限信息
      const permissionsList = await store.dispatch('menu/getUserPermission')
      // 2. 根据权限标识 筛选出对应的一级路由标识
      const firstPermissions = getFirstRoutePermissions(permissionsList)
      // 3. 根据权限表示 筛选出对应的二级路由标识
      const secondPermissions = getSecondRoutePermissions(permissionsList)
      // 4. 筛选
      const routes = getRoutes(firstPermissions, secondPermissions, asyncRoutes)
      // 5. 筛选的路由进行展示
      // 5.1 先把筛选出来的路由添加到路由对象中（跳转）
      routes.forEach(item => router.addRoute(item))
      // 5.2 再把筛选出来的路由添加到Vuex中（渲染）
      store.commit('menu/setMenuList', routes)
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
