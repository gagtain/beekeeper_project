<template>
  <div class="w-sto kor" id="kor">
    <p class="small-big VAG">Корзина</p>
    <div class="w-sto flex kor_block">
        <BasketList></BasketList>


      <div class="basket_info_div">

        <BasketInfo :items="$store.getUser.basket"></BasketInfo>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.basket_info_div{
  width: 35%;
}
@media (max-width: 1000px) {
  .basket_info_div{
    width: 100%;
  }
}
</style>
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
