
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
      catalog_list: [
        {
          id: 0,
          name: "",
          image: "",
          price: "",
          price_currency: "",
          description: "",
          category: [
            {
              name: "",
            },
          ],
          type_packaging: {
            name: "",
          },
        },
      ],
    }
  },
  mutations: {
    MUTATE_RENAME_USER: (state, user) =>{
        state.user = user
    },
    MUTATE_CATALOG_LIST: (state, catalog_list) =>{
        state.catalog_list = catalog_list
    },
  },
  actions:{
    RENAME_USER({commit}, user){
        commit('MUTATE_RENAME_USER', user)
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