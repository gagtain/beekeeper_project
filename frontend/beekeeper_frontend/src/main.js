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
export let api_root = 'http://localhost:1232/'
app.config.globalProperties.$api_root = api_root
app.mount('#app')

