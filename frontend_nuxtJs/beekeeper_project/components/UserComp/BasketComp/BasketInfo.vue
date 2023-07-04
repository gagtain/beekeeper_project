<template>
  <div class="register_zakaz" style="width: 100%;">
    <SubmitOrderref :items="items"></SubmitOrderref>
    <ProductListInfo :items="items"></ProductListInfo>
    
  </div>
</template>

<style lang="css" src="../../../assets/css/account.css" scoped></style>
<style scoped>
.fon_btn{
  background: url(http://localhost:8080/img/sot.0b9dac38.png) center no-repeat;
opacity: 0.1;
position: absolute;
height: 100%;
width: 100%;
top: 0;
left: 0;
}
</style>
<script>
import SubmitOrderref from '../../AddtionalComp/Submit_Order_ref.vue';
import ProductListInfo from './ProductListInfo.vue';
export default {
  components: { SubmitOrderref, ProductListInfo },
  el: "#reg_zakaz",
  name: "BasketInfo",
  props: ['items']
};
</script>
