<template>
    <div class="register_zakaz">
        <div class="kor_all_info auto w-sto">
          <p class="VAG small zakaz_info_of">Информация о корзине</p>
          <p class="m2">Товаров: {{ USER_STATE.basket.length }}</p>
          <p class="m2">Вес: 1.25кг</p>
          <p class="m2">Цена: {{ USER_STATE.basket.reduce(function(sum, elem) {
	return sum + parseFloat(elem.price);
}, 0) }}</p>
          <p class="m2">скидки:</p>
          <ul>
            <li>Скидки на товары: 1000р</li>
          </ul>
          <p id="is" class="small">Итоговая сумма: {{ USER_STATE.basket.reduce(function(sum, elem) {
	return sum + parseFloat(elem.price);
}, 0) }}</p>
          <button class="w-sto">Оформить</button>
        </div>
      </div>
</template>

<style lang="css" src="../../../assets/css/account.css" scoped></style>


<script>

import {mapGetters} from 'vuex'
export default({
    el: '#reg_zakaz',
    name: 'BasketInfo',
    created(){

    },
  computed:{
    ...mapGetters([
        'USER_STATE'
    ])
  }
})

</script>