<template>
  <button class="flex btn_add_favorite jus-sp">
    <img
      class="add_favorite"
      :src="`${$api_root}static/online_store/images/favorite/favorite_add.png`"
      alt=""
    />
    <p v-if="isFavorite" class="b_text" @click="removeFavoriteBtn()">
      Избранное
    </p>
    <p v-else class="b_text" @click="addFavoriteBtn()">
      Добавить в избранное
    </p>
  </button>
</template>
<style scoped>
.fav-btn {
  padding: 5%;
  border-radius: 50px;
  background-color: rgb(245, 173, 40);
}
.fav-btn img {
  height: 25px;
  width: 25px;
}
</style>
<script>
import addFavorite from "../../../additional_func/addFavorite";
import removeFavorite from "../../../additional_func/removeFavorite";
import { mapGetters } from "vuex";
export default {
  el: "#favorite",
  name: "FavoriteComp",
  props: ["id"],
  data() {
    return {
      isFavorite: false,
    };
  },
  setup() {},
  created() {
    let self = this;
    let a = this.USER_STATE.favorite_product.find(function (item) {
      console.log(item);
      if (item.id == self.id) {
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
      let response_add = await addFavorite(this.id);
      if (response_add.status == 200) {
        this.isFavorite = true;
      }
    },
    async removeFavoriteBtn() {
      let response_add = await removeFavorite(this.id);
      if (response_add.status == 200) {
        this.isFavorite = false;
      }
    },
  },
  computed: {
    ...mapGetters(["USER_STATE"]),
  },
};
</script>
