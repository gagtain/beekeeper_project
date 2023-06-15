<template>

            <div class="input-number" id="count_button">
    <div class="input-number__minus" @click="minus_input($event)">-</div>
    <input class="input-number__input" @keydown="input_keydown($event)" type="text" pattern="^[0-9]+$" @focusout="input_onfocus($event)" @input="re_count($event)"  :value="USER_STATE.basket.filter(f => f.id == id)[0].count">
    <div class="input-number__plus" @click="plus_input($event)">+
</div>
          </div>
</template>

<style>
.input-number {
    display: flex;
    align-items: center;
    background: #FFFFFF;
    border: 1px solid #E5E8EE;
    box-sizing: border-box;
    border-radius: 6px;
    color: #424348;
    font-size: 14px;
    text-align: center;
    width: 100%;
}

.input-number__input {
    background: #E5E8EE;
    width: 60%;
    height: 32px;
    border: none;
    padding: 8px;
    text-align: center;
}

.input-number__minus,
.input-number__plus {
  font-size: 20px;
    width: 33%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
}
</style>

<script>

import {mapGetters} from 'vuex'
export default({
    el:'#count_button',
    name:'CountProduct',
    props: ['id'],
    methods:{
        re_count(event){
            if (!(event.srcElement.value == '' || event.srcElement.value == '0')){
                
                this.$store.dispatch('REFACTOR_COUNT_BASKET_ITEM', {basket_id: this.id, count: parseInt(event.srcElement.value)})
            }
        },
        input_onfocus(event){
            if(event.srcElement.value == ''){
                event.srcElement.value = this.USER_STATE.basket.filter(f => f.id == this.id)[0].count
            }else if(event.srcElement.value == '0'){
                this.$store.dispatch('REFACTOR_COUNT_BASKET_ITEM', {basket_id: this.id, count: 1})
            }
        },
        minus_input (event) {
      console.log(event)
        let total = event.srcElement.nextElementSibling;
        if (total.value > 1) {
            this.$store.dispatch('REFACTOR_COUNT_BASKET_ITEM', {basket_id: this.id, count: parseInt(total.value) - 1})
        }
        
    },
    // Увеличиваем на 1
    plus_input (event) {
      console.log(event.srcElement.previousElementSibling)
        let total = event.srcElement.previousElementSibling;
            this.$store.dispatch('REFACTOR_COUNT_BASKET_ITEM', {basket_id: this.id, count: parseInt(total.value) + 1})
    },

    // Запрещаем ввод текста 
    
        input_keydown (event) {
            // Разрешаем: backspace, delete, tab
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 ||
                // Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) ||
                // ← →
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                return;
            } else {
                // Только цифры
                if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    
                    event.preventDefault();
                }
                
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