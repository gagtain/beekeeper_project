<template>
  <div class="w-sto kor" id="kor">
    <p class="small-big VAG">Корзина</p>
    <div class="w-sto flex kor_block">
        <BasketList></BasketList>


      <div style="width: 35%;">

        <BasketInfo :items="$store.getUser.basket"></BasketInfo>
      </div>
    </div>
  </div>
</template>

<style lang="css" src="../../assets/css/account.css" scoped></style>
<script>
import BasketInfo from './BasketComp/BasketInfo.vue'
import BasketList from './BasketList.vue';
export default {
    el: '#kor',
    name: 'UserBasket',
    components:{
        BasketList,
        BasketInfo
    }
};
</script>
