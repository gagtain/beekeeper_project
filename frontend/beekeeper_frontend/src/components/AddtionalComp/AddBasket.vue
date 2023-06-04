<template>
    <div id="addBasket">
        
  <button v-if="isBasket" @click="removeBasketBtn" class="btn au">Убрать из корзины</button>
  <button v-else @click="addBasketBtn" class="btn au">Добавить в корзину</button>
    </div>
</template>
<style>
</style>
<script>
import addBasket from '../../additional_func/addBasket'
import removeBasket from '../../additional_func/removeBasket'
export default({
    el: '#addBasket',
    name: 'AddBasket',
    props: ['sm', 'id'],
    data(){
        return {
            isBasket: false
            }
    },
    setup() {
        
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
        }
    }
})
</script>
