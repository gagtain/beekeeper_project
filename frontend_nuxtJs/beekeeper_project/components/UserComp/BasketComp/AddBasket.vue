<template>
    <div id="addBasket">
        
  <button v-if="isBasket" class="flex btn_add_favorite remove_kor jus-sp"  @click="removeBasketBtn()">
            <img
              class="add_favorite"
              :src="$api_root + 'static/online_store/' + 'images/x_tovar.png'"
              alt=""
            />
            <p class="b_text" >Убрать из корзины</p>
          </button>
  <button v-else class="flex btn_add_favorite remove_kor jus-sp"  @click="addBasketBtn()">
            <img
              class="add_favorite"
              :style="!isBasket ? 'transform: rotate(45deg)' : ''"
              :src="$api_root + 'static/online_store/' + 'images/x_tovar.png'"
              alt=""
            />
            <p class="b_text" >Добавить в корзину</p>
          </button>
    </div>
</template>
<style lang="css" src="../../../assets/css/account.css" scoped></style>
<style>

</style>
<script>
import removeBasket from '../../../additional_func/removeBasket'
import addBasket from '../../../additional_func/addBasket'
export default{
    el: '#addBasket',
    name: 'AddBasket',
    props: ['sm', 'ProductItem'],
    data(){
        return {
            isBasket: false,
            USER_STATE: this.$store.getUser
            }
    },
    created() {
        console.log(this.ProductItem)
                let self = this
            let a = this.USER_STATE.basket.find(function(item){
            if (item.productItem.id == self.ProductItem.id){
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
            let response_add = await removeBasket(this.ProductItem.product.id, undefined, undefined, this.ProductItem.id)
            if (response_add.status == 200){
                this.$store.REMOVE_BASKET_ITEM(this.ProductItem.id)
                    this.isBasket = false
            }  
        },
        async addBasketBtn(){
            let response_add = await addBasket(this.ProductItem.product.id,this.ProductItem.weight.id)
            if (response_add.status == 200){
                this.isBasket = true
            }  
        },
    },
}
</script>
