import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

// 导入黑暗模式样式
import 'element-plus/theme-chalk/dark/css-vars.css';
import './styles/dark/css-vars.css';

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
