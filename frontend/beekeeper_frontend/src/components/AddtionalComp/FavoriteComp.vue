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
  box-shadow: 2px 2px 25px -7px black;
  height: 53px;
  cursor: pointer;
  width: 53px;
  border-radius: 50%;
  background-color: rgb(245, 173, 40);
  border: none;

  margin-left: 1%;
}
.fav-btn:active {
  background-color: rgb(245, 173, 40);
  scale: 0.96;
  color: #000;
}
.fav-btn img {
  height: 25px;
  width: 25px;
}
</style>
<script>
import addFavorite from "../../additional_func/addFavorite";
import removeFavorite from "../../additional_func/removeFavorite";
import { mapGetters } from "vuex";
export default {
  el: "#favorite",
  name: "FavoriteComp",
  props: ["id", "pack_id", "wei_id"],
  data() {
    return {
      isFavorite: false,
    };
  },
  setup() {},
  created() {
    this.a();
  },
  methods: {
    a() {
      let self = this;
      let a = this.USER_STATE.favorite_product.find(function (item) {
        if (
          self.id == item.productItem.product.id &&
          self.wei_id == item.productItem.weight.id &&
          self.pack_id == item.productItem.type_packaging.id
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
      let response_add = await addFavorite(this.id, this.pack_id, this.wei_id);
      if (response_add.status == 200) {
        this.$store.dispatch(
          "ADD_FAVORITE_ITEM",
          response_add.data.favoriteItem
        );
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
  watch: {
    pack_id() {
      this.a();
    },
    wei_id() {
      this.a();
    },
  },
};
</script>
