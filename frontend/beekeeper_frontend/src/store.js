
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
      state.user.basket = state.user.basket.filter(b => b.id != id)
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
    REFACTOR_CATALOG_LIST({commit}, catalog_list){
        commit('MUTATE_CATALOG_LIST', catalog_list)
    },
  },
    getters:{
        USER_STATE(state){
            return state.user
        },
        CATALOG_LIST_STATE(state){
            return state.catalog_list
        },
  }
})

export default store