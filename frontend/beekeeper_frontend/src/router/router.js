import { createWebHistory, createRouter } from "vue-router";
import LoginComp from '../components/UserAuth/LoginComp.vue'
import RegisterComp from '../components/UserAuth/RegisterComp.vue'
import auth from './middleware/auth.js'

const Router = new createRouter({
    history: createWebHistory(),
    routes:[
        { path: '/', component:  () => import('../components/IndexItem.vue'), meta: {
            middleware: [
                auth
            ] }
        },
        { path: '/login', component: LoginComp },
        { path: '/register', component: RegisterComp },
        { path: '/catalog', component: () => import('../components/Catalog/CatalogItem.vue'), meta: {
            middleware: [
                auth
            ] }
        },
        { path: '/profile', component: () => import('../components/UserComp/WrapperUser.vue'), meta: {
            middleware: [
                auth
            ] }
        },
        { path: '/basket', component: () => import('../components/BasketBase.vue'), meta: {
            middleware: [
                auth
            ] }
        },
        { path: '/favorite', component: () => import('../components/FavoriteBase.vue'), meta: {
            middleware: [
                auth
            ] }
        },
        { path: '/tovar/:id', component: () => import('../components/Tovar/TovarBase.vue'), meta: {
            middleware: [
                auth
            ] }
        },
    ]
})

Router.beforeEach((to, from, next) => {
    // по возможности отключить middleware для переходов между страницами без загрузки
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