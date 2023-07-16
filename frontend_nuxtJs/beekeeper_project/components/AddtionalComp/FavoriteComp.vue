<template>
  <button
    v-if="isFavorite"
    @click="removeFavoriteBtn()"
    id="favorite"
    class="fav-btn flex auto"
  >
    <img
      class="auto"
      :src="`${$api_root}static/online_store/images/favorite/favorite_remove.png`"
      alt=""
    />
  </button>
  <button
    v-else
    id="favorite"
    @click="addFavoriteBtn()"
    class="fav-btn flex auto"
  >
    <img
      class="auto"
      :src="`${$api_root}static/online_store/images/favorite/favorite_add.png`"
      alt=""
    />
  </button>
</template>
<style scoped>
.fav-btn {
  height: 53px;
  cursor: pointer;
  width: 53px;
  
  border-radius: 12px;
    background-color: transparent;
  border: none;

  margin-left: 1%;
}
.fav-btn img {
  height: 25px;
  width: 25px;
}
</style>
<script>
import addFavorite from "../../additional_func/addFavorite";
import removeFavorite from "../../additional_func/removeFavorite";


export default defineNuxtComponent({
  el: "#favorite",
  name: "FavoriteComp",
  props: ["id", "wei_id"],
  data() {
    return {
      isFavorite: false,
    };
  },
  setup() {
  },
  created() {
    this.a();
  },
  methods: {
    a() {
      let self = this;
      let a = this.$store.getUser.favorite_product.find(function (item) {
        if (
          self.id == item.productItem.product.id &&
          self.wei_id == item.productItem.weight.id
        ) {
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
    async addFavoriteBtn() {
      
      let response_add = await addFavorite(this.id, this.wei_id);
      if (response_add.status == 200) {
        this.$store.ADD_FAVORITE_ITEM(
          response_add.data.favoriteItem
        ); 
        this.isFavorite = true;
      }
    },
    async removeFavoriteBtn() {
      let response_add = await removeFavorite(this.id, this.wei_id);
      if (response_add.status == 200) {
        this.$store.REMOVE_FAVORITE_ITEM(
           response_add.data.id
           ) 
        this.isFavorite = false;
      }
    },
  },
  watch: {
    wei_id() {
      this.a();
    },
  },
});
</script>
