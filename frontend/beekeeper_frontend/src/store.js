
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
    }
  },
  mutations: {
    MUTATE_RENAME_USER: (state, user) =>{
        state.user = user
    },
  },
  actions:{
    RENAME_USER({commit}, user){
        commit('MUTATE_RENAME_USER', user)
    },
  },
    getters:{
        USER_STATE(state){
            return state.user
        },
  }
})

export default store