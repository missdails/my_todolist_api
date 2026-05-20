import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'  //引入ElementPlus完整的组件库
import 'element-plus/dist/index.css'  //引入element-plus的样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue'  //引入ElementPlus的Icons图标库
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app=createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}  //注册ElementPlus图标库到全局
const pinia=createPinia()
app.use(router)
app.use(ElementPlus)  //启用ElementPlus
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.mount('#app')
