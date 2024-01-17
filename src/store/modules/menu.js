import { getUserProfileApi } from '@/api/user'
import { routes, resetRouter } from '@/router'

export default {
  namespaced: true,
  state: {
    permission: [],
    menuList: []
  },
  mutations: {
    setMenuList(state, asyncRoutes) {
      state.menuList = [...routes, ...asyncRoutes]
    },
    clearMenuList(state) {
      state.menuList = []
      resetRouter()
    },
    setPermission(state, newPermission) {
      state.permission = newPermission
    }
  },
  actions: {
    async getUserPermission(context) {
      const res = await getUserProfileApi()
      context.commit('setPermission', res.data.permissions)
      return res.data.permissions
    }
  },
  getters: {}
}
