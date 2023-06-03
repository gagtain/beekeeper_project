import store  from './store'
import Vuex from 'vuex'
import { createApp } from 'vue'
import App from './App.vue'
import Router from './router/router.js'
const app = createApp(App)
app.use(Vuex)
app.use(Router)
app.use(store)
app.config.devtools = true
app.config.globalProperties.$api_root = 'http://localhost:8000/'
app.mount('#app')

