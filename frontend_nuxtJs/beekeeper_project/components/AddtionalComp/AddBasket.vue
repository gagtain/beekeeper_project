<template>
    <div id="addBasket">
  <button v-if="a()" @click="removeBasketBtn" class="w-sto btn au">Из корзины</button>
  <button v-else @click="addBasketBtn" class="w-sto btn au">В корзину</button>
    </div>
</template>
<style>
</style>
<style lang="scss" src="../../assets/css/katalog/katalog.scss" scoped></style>
<script>
import addBasket from '../../additional_func/addBasket'
import removeBasket from '../../additional_func/removeBasket'
import DefaultTooltipVue from './DefaultTooltip.vue'
export default{
    el: '#addBasket',
    name: 'AddBasket',
    props: ['id'],
    data(){
        return {
            isBasket: false,
            }
    },
    created() {
    },
    mixins: [DefaultTooltipVue],
  setup() {
  },
    methods:{
        a(){
            let self = this
            let a = this.$store.getUser.basket.find(function(item){
            if (self.id == item.productItem.id ){
                return true
            }else{
                return false
            }
            })
            return a
        },
        async addBasketBtn(){
            let response_add = await addBasket(this.id)
            if (response_add.status == 200){
                this.$store.ADD_BASKET_ITEM(response_add.data.basketItem)
                this.isBasket = true
                this.tooltip()
            }else if(response_add.status == 401){
                this.$router.push('/login?message=Для данного действия необходимо авторизоваться')
            }  
        },
        async removeBasketBtn(){
            let response_add = await removeBasket(this.id)
            if (response_add.status == 200){
                this.$store.REMOVE_BASKET_ITEM(response_add.data.id)
                this.isBasket = false
                this.tooltip()
            }  else if(response_add.status == 401){
                this.$router.push('/login?message=Для данного действия необходимо авторизоваться')
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
