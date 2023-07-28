<template>
  <div id="favorite">

  <button v-if="a()" class="flex btn_add_favorite jus-sp" @click="removeFavoriteBtn()">
    <img
      class="add_favorite"
      :src="`${$api_root}static/online_store/images/favorite/favorite_remove.png`"
      alt=""
    />
    <p class="b_text" >
      Избранное
    </p>
  </button>
  <button v-else class="flex btn_add_favorite jus-sp" @click="addFavoriteBtn()">
    <img
      class="add_favorite"
      :src="`${$api_root}static/online_store/images/favorite/favorite_add.png`"
      alt=""
    />
    <p class="b_text">Добавить в избранное</p>
  </button>
  </div>
</template>
<style lang="css" src="../../../assets/css/account.css" scoped></style>
<script>
import FavoriteComp from '~/components/AddtionalComp/FavoriteComp.vue';
export default {
  el: "#favorite",
  name: "FavoriteComp",
  props: ["id"],
  extends: FavoriteComp
};
</script>
