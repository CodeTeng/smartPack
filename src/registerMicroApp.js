import { registerMicroApps, start } from 'qiankun'
// registerMicroApps 可以注册多个子应用 每个对象代表一个子应用的配置
const isDev = process.env.NODE_ENV === 'development'
registerMicroApps([
  {
    name: 'BigScreen', // 子应用的名字 可以随便起
    entry: `${isDev ? '//localhost:5173' : '//localhost:8089'}`, // 自子应用启动之后的访问地址 【地址中没写协议的话表示跟当前项目的协议保持一致】
    container: '#container', // 子应用渲染到哪个dom结构中
    activeRule: '/bigScreen' // 跳转到子应用中访问哪个页面路由
  }
])
start()
