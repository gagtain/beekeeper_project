<template>
    <div id="addBasket">
        
  <button v-if="isBasket" class="flex btn_add_favorite remove_kor jus-sp">
            <img
              class="add_favorite"
              src="images/x_tovar.png"
              alt=""
            />
            <p class="b_text" @click="removeBasketBtn()" >Убрать из корзины</p>
          </button>
  <button v-else class="flex btn_add_favorite remove_kor jus-sp">
            <img
              class="add_favorite"
              src="images/x_tovar.png"
              alt=""
            />
            <p class="b_text" @click="addBasketBtn()" >Добавить в корзину</p>
          </button>
    </div>
</template>
<style>

</style>
<script>
import {mapGetters} from 'vuex'
import removeBasket from '../../../additional_func/removeBasket'
import addBasket from '../../../additional_func/addBasket'
import store from '../../../store'
export default({
    el: '#addBasket',
    name: 'AddBasket',
    props: ['sm', 'id'],
    data(){
        return {
            isBasket: false,
            }
    },
    created() {
                let self = this
            let a = this.USER_STATE.basket.find(function(item){
                console.log(item)
            if (item.id == self.id){
                return true
            }else{
                return false
            }
            })
            if (a){
                this.isBasket = true
            }else{
                
                this.isBasket = false
            }
    },
    methods:{
        async removeBasketBtn(){
            let response_add = await removeBasket(this.id)
            if (response_add.status == 200){
                this.isBasket = false
                store.dispatch('REMOVE_BASKET_ITEM', this.id)
                console.log(store)
            }  
        },
        async addBasketBtn(){
            let response_add = await addBasket(this.id)
            if (response_add.status == 200){
                this.isBasket = true
            }  
        },
    },
  computed:{
    ...mapGetters([
        'USER_STATE'
    ])
  }
})
</script>
