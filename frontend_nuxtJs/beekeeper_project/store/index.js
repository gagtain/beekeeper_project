import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    counter: 0,
    user: {
      basket:[{
        productItem:{
          
        }
        
      }],
      favorite_product:[{

      }]
    },
    catalog_list: null,
    assess_token: ''
  }),
  actions: {
    increment() {
      // `this` is the store instance
      this.counter++
    },
    userSet(user){
      this.user = user
    },
    assess_tokenSet(assess_token){
      this.assess_token = assess_token
    },
    
    REMOVE_BASKET_ITEM(id){
      this.user.basket = this.user.basket.filter(b => b.productItem.id != id)
    },
    ADD_BASKET_ITEM(obj_basketItem){
      this.user.basket.push(obj_basketItem)
    },
    ADD_FAVORITE_ITEM(obj_favoriteItem){
      this.user.favorite_product.push(obj_favoriteItem)
    },
    REMOVE_FAVORITE_ITEM(id) {
      this.user.favorite_product = this.user.favorite_product.filter(b => b.productItem.id != id)
    },
    REFACTOR_COUNT_BASKET_ITEM(obj_basketId_count){
      if (Number.isInteger(obj_basketId_count.count)){
        this.user.basket.filter(b => b.id == obj_basketId_count.basket_id)[0].count = obj_basketId_count.count
      }
    },
    REFACTOR_CATALOG_LIST(catalog_list){
        this.catalog_list = catalog_list
    },
  },
  getters: {
    getCount(state){
        return state.counter
    },
    getUser(state){
      return state.user
    },
    getAssess_token(state){
      return state.assess_token
    },
    getCatalog_list(state){
      return state.catalog_list
    }
  }
})