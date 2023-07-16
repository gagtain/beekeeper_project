<template>
    <div id="addBasket">
  <button v-if="isBasket" @click="removeBasketBtn" class="btn au">Убрать из корзины</button>
  <button v-else @click="addBasketBtn" class="btn au">Добавить в корзину</button>
    </div>
</template>
<style>
</style>
<style lang="scss" src="../../assets/css/katalog/katalog.scss" scoped></style>
<script>
import addBasket from '../../additional_func/addBasket'
import removeBasket from '../../additional_func/removeBasket'
export default{
    el: '#addBasket',
    name: 'AddBasket',
    props: ['id', 'pack_id', 'wei_id'],
    data(){
        return {
            isBasket: false,
            }
    },
    created() {
        this.a()
    },
  setup() {
  },
    methods:{
        a(){
            let self = this
            console.log(this.$store.getUser.basket)
            let a = this.$store.getUser.basket.find(function(item){
            if (self.id == item.productItem.product.id && self.wei_id == item.productItem.weight.id){
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
        async addBasketBtn(){
            let response_add = await addBasket(this.id, this.wei_id)
            if (response_add.status == 200){
                this.$store.ADD_BASKET_ITEM(response_add.data.basketItem)
                this.isBasket = true
            }  
        },
        async removeBasketBtn(){
            let response_add = await removeBasket(this.id, this.wei_id)
            if (response_add.status == 200){
                this.$store.REMOVE_BASKET_ITEM(response_add.data.id)
                this.isBasket = false
            }  
        },
    },
  // watch на элементы которые меняются и менять isBasket
  watch:{
    pack_id(){
        console.log(3214)
        this.a()
    },
    wei_id(){
        console.log(3214)
        this.a()
    }
  }
}
</script>
