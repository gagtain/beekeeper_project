<template>
  <div id="favorite">

  <button v-if="isFavorite" class="flex btn_add_favorite jus-sp" @click="removeFavoriteBtn()">
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
import addFavorite from "../../../additional_func/addFavorite";
import removeFavorite from "../../../additional_func/removeFavorite";
import { mapGetters } from "vuex";
export default {
  el: "#favorite",
  name: "FavoriteComp",
  props: ["ProductItem"],
  data() {
    return {
      isFavorite: false,
    };
  },
  setup() {},
  created() {
    let self = this;
    console.log(this.USER_STATE.favorite_product)
    let a = this.USER_STATE.favorite_product.find(function (item) {
      console.log(item.id, self.id)
      if (item.productItem.id == self.ProductItem.id) {
        return true;
      } else {
        return false;
      }
    });
    if (a) {
      this.isFavorite = true;
    } else {
      this.isFavorite = false;
    }
  },
  methods: {
    
    async addFavoriteBtn() {
      let response_add = await addFavorite(this.ProductItem.product.id, this.ProductItem.type_packaging.id,this.ProductItem.weight.id);
      if (response_add.status == 200) {
        this.isFavorite = true;
      }
    },
    async removeFavoriteBtn() {
      console.log(this.ProductItem)
      let response_add = await removeFavorite(this.ProductItem.product.id, undefined, undefined, this.ProductItem.id);
      if (response_add.status == 200) {
        this.$store.dispatch('REMOVE_FAVORITE_ITEM', response_add.data.id)
          this.isFavorite = false;
      }
    },
  },
  computed: {
    ...mapGetters(["USER_STATE"]),
  },
};
</script>
