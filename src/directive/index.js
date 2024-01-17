// 放置全局指令
import Vue from 'vue'
import store from '@/store'

// 管理员权限特殊处理
const adminPerms = '*:*:*'
Vue.directive('permission', {
  // el:使用自定义指令的DOM元素
  // binding:对象  binding.value 可以接受到外部传过来的值
  inserted(el, binding) {
    const permissions = store.state.menu.permission
    if (!permissions.includes(binding.value) && !permissions.includes(adminPerms)) {
      // 隐藏el
      // el.style.display = 'none'
      el.remove()
    }
  }
})
