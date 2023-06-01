

import { createApp } from 'vue'
import App from './App.vue'
import Router from './router/router.js'
const app = createApp(App)
app.use(Router)
app.config.globalProperties.$api_root = 'http://localhost:8000/'
app.mount('#app')

