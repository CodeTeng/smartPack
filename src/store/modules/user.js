import { loginAPI } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

export default {
  namespaced: true,
  state: {
    token: getToken() || ''
  },
  mutations: {
    setToken(state, newToken) {
      state.token = newToken
      setToken(newToken)
    },
    removeToken(state) {
      state.token = ''
      removeToken()
    }
  },
  actions: {
    async loginAction(context, data) {
      const res = await loginAPI(data)
      context.commit('setToken', res.data.token)
    }
  },
  getters: {}
}
