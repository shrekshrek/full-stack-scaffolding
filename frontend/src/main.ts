import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// 导入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 导入UnoCSS样式
import 'uno.css'
// 导入全局样式系统
import './styles/index.scss'

const app = createApp(App)

// 注册Element Plus
app.use(ElementPlus, {
  locale: zhCn,
  size: 'default'
})

// 注册Pinia状态管理
app.use(createPinia())

// 注册路由
app.use(router)

// 挂载应用
app.mount('#app')
