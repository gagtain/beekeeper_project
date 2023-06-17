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
import {mapGetters} from 'vuex'
export default({
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
    methods:{
        a(){
            let self = this
            let a = this.USER_STATE.basket.find(function(item){
            if (self.id == item.productItem.product.id && self.wei_id == item.productItem.weight.id && self.pack_id == item.productItem.type_packaging.id){
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
            let response_add = await addBasket(this.id, this.pack_id, this.wei_id)
            if (response_add.status == 200){
                this.$store.dispatch('ADD_BASKET_ITEM', response_add.data.basketItem)
                this.isBasket = true
            }  
        },
        async removeBasketBtn(){
            let response_add = await removeBasket(this.id, this.pack_id, this.wei_id)
            if (response_add.status == 200){
                this.$store.dispatch('REMOVE_BASKET_ITEM', response_add.data.id)
                this.isBasket = false
            }  
        },
    },
  computed:{
    ...mapGetters([
        'USER_STATE'
    ])
  },
  // watch на элементы которые меняются и менять isBasket
  watch:{
    'pack_id'(){
        this.a()
    },
    'wei_id'(){
        this.a()
    }
  }
})
</script>
