import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    counter: 0,
    user: {
      image: '',
      basket:[],
      favorite_product:[],
      is_sending: false
    },
    catalog_list: [],
    assess_token: '',
    catalog_params: [],
    tooltip: {
      status: false,
      title: ''
    },
    basket_refactor_websocket: [{
      id: null,
      type: null
    }]
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
        let index = this.user.basket.findIndex(b => b.id == obj_basketId_count.basket_id)
        this.user.basket[index].count = obj_basketId_count.count
      }
    },
    REFACTOR_USER_IMAGE(image){
      this.user.image = image
    },
    REFACTOR_USER_SENDING(sending){
      this.user.is_sending = sending
    },
    REFACTOR_CATALOG_LIST(catalog_list){
        this.catalog_list = catalog_list
    },
    ADD_ORDER_BY_CATALOG_PARAMS(params, not_params){
      let r = this.catalog_params.slice().filter(e => !not_params.includes(e))
      r.push(params)
      this.catalog_params.length = 0
      this.catalog_params.push(...r)
      console.log(this.catalog_params)
    },
    ADD_CATALOG_PARAMS(params){
      this.catalog_params.push(params)
    },
    REMOVE_CATALOG_PARAMS(params){

      let index = this.catalog_params.indexOf(params)
      this.catalog_params.splice(index, 1)
    },
    CLEAR_CATALOG_PARAMS(){
      this.catalog_params = []
    },
    REFACTOR_TOOLTIP(tooltip){
      this.tooltip = tooltip
    },
    ADD_BASKET_REFACTOR_WEBSOCKET(refact){
      this.basket_refactor_websocket.push(refact)
    },
    REMOVE_BASKET_REFACTOR_WEBSOCKET(refact){
      this.basket_refactor_websocket = this.basket_refactor_websocket.filter(e => e.id != refact.id && e.type != refact.type)
    }
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
    },
    getCatalog_params(state){
      return state.catalog_params
    },
    getTooltip(state){
      return state.tooltip
    },
    getBasket_refactor_websocket(state){
      return state.basket_refactor_websocket
    }
  }
})