<template>
    <div id="addBasket">
        
  <button v-if="a()" class="flex btn_add_favorite remove_kor jus-sp"  @click="removeBasketBtn()">
            <img
              class="add_favorite"
              :src="$api_root + 'static/online_store/' + 'images/x_tovar.png'"
              alt=""
            />
            <p class="b_text" >Убрать из корзины</p>
          </button>
  <button v-else class="flex btn_add_favorite remove_kor jus-sp"  @click="addBasketBtn()">
            <img
              class="add_favorite"
              :style="!isBasket ? 'transform: rotate(45deg)' : ''"
              :src="$api_root + 'static/online_store/' + 'images/x_tovar.png'"
              alt=""
            />
            <p class="b_text" >Добавить в корзину</p>
          </button>
    </div>
</template>
<style lang="css" src="../../../assets/css/account.css" scoped></style>
<style>

</style>
<script>
import AddBasket from '~/components/AddtionalComp/AddBasket.vue';
export default{
    el: '#addBasket',
    name: 'AddBasket',
    props: ['id'],
    extends: AddBasket
}
</script>
