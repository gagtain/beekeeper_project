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
        async addBasketBtn(){
            let response_add = await addBasket(this.id)
            if (response_add.status == 200){
                this.isBasket = true
            }  
        },
        async removeBasketBtn(){
            let response_add = await removeBasket(this.id)
            if (response_add.status == 200){
                this.isBasket = false
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
