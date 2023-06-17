
import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      user: {
        'username': '',
        'FIO': '',
        'image': ''
      },
      catalog_list: null
    }
  },
  mutations: {
    MUTATE_RENAME_USER: (state, user) =>{
        state.user = user
    },
    MUTATE_CATALOG_LIST: (state, catalog_list) =>{
        state.catalog_list = catalog_list
    },
    MUTATE_REMOVE_BASKET_ITEM: (state, id) =>{
      state.user.basket = state.user.basket.filter(b => b.productItem.id != id)
    },
    MUTATE_ADD_BASKET_ITEM: (state, obj_basketItem) =>{
      state.user.basket.push(obj_basketItem)
    },
    MUTATE_ADD_FAVORITE_ITEM: (state, obj_favoriteItem) =>{
      state.user.favorite_product.push(obj_favoriteItem)
    },
    MUTATE_COUNT_BASKET_ITEM: (state, obj_basketId_count) =>{
      if (Number.isInteger(obj_basketId_count.count)){
        console.log(1)
        state.user.basket.filter(b => b.id == obj_basketId_count.basket_id)[0].count = obj_basketId_count.count
      }
    },
    MUTATE_REMOVE_FAVORITE_ITEM: (state, id) =>{
      
      state.user.favorite_product = state.user.favorite_product.filter(b => b.id != id)
    }
  },
  actions:{
    RENAME_USER({commit}, user){
        commit('MUTATE_RENAME_USER', user)
    },
    REMOVE_BASKET_ITEM({commit}, id){
      
      commit('MUTATE_REMOVE_BASKET_ITEM', id)
    },
    REMOVE_FAVORITE_ITEM({commit}, id){
      
      commit('MUTATE_REMOVE_FAVORITE_ITEM', id)
    },
    ADD_FAVORITE_ITEM({commit}, obj_favoriteItem){
      commit('MUTATE_ADD_FAVORITE_ITEM', obj_favoriteItem)

    },
    REFACTOR_CATALOG_LIST({commit}, catalog_list){
        commit('MUTATE_CATALOG_LIST', catalog_list)
    },
    REFACTOR_COUNT_BASKET_ITEM({commit}, obj_basketId_count){
        commit('MUTATE_COUNT_BASKET_ITEM', obj_basketId_count)
    },
    ADD_BASKET_ITEM({commit}, obj_basketItem){
      commit('MUTATE_ADD_BASKET_ITEM', obj_basketItem)
  },
  },
    getters:{
        USER_STATE(state){
            return state.user
        },
        CATALOG_LIST_STATE(state){
            return state.catalog_list
        },
        BASKET_LIST_STATE(state){
            return state.user.basket
        },
  }
})

export default store