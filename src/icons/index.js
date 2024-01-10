import Vue from 'vue'
// 1.全局注册名称为 svg-icon 组件 在任何一个.vue文件中
// 都可以通过 <svg-icon/> 进行图标渲染
import SvgIcon from '@/components/SvgIcon'
Vue.component('svg-icon', SvgIcon)

// 2. 把svg目录下的所有的.svg文件都变成 模块化可用的状态
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => {
  requireContext.keys().map(requireContext)
}

requireAll(req)

// 最终实现的效果：<svg-icon icon-class="svg图标的名称"/> -> 渲染出来一个图标
