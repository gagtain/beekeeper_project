import { createWebHistory, createRouter } from "vue-router";
import IndexItem from '../components/IndexItem.vue'
import LoginComp from '../components/UserAuth/LoginComp.vue'
import RegisterComp from '../components/UserAuth/RegisterComp.vue'
import auth from './middleware/auth.js'

const Router = new createRouter({
    history: createWebHistory(),
    routes:[
        { path: '/', component: IndexItem, meta: {
            middleware: [
                auth
            ] }
        },
        { path: '/login', component: LoginComp },
        { path: '/register', component: RegisterComp },
    ]
})

Router.beforeEach((to, from, next) => {
    if (!to.meta.middleware) {
        return next()
    }
    const middleware = to.meta.middleware
    const context = {
        to,
        from,
        next
    }
    return middleware[0]({
        ...context
    })
})

export default Router