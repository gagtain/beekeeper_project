<template>
  <div class="w-sto kor" id="kor">
    <p class="small-big VAG">Корзина</p>
    <div class="w-sto flex kor_block">
        <BasketList></BasketList>


      <div class="register_zakaz">
        <div class="kor_all_info auto w-sto">
          <p class="VAG small zakaz_info_of">Информация о корзине</p>
          <p class="m2">Товаров: 12</p>
          <p class="m2">Вес: 1.25кг</p>
          <p class="m2">Цена: 1111</p>
          <p class="m2">скидки:</p>
          <ul>
            <li>Скидки на товары: 1000р</li>
          </ul>
          <p id="is">Итоговая сумма 100р</p>
          <p class="small">111 руб</p>
          <button class="w-sto">Оформить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BasketList from './BasketList.vue';
export default {
    el: '#kor',
    name: 'UserBasket',
    components:{
        BasketList
    }
};
</script>
