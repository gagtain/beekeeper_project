import { r as removeBasket, a as addBasket, b as addFavorite, c as removeFavorite } from "./removeFavorite-8c059756.js";
import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
const account_css_vue_type_style_index_0_src_09d7f640_scoped_09d7f640_lang = "";
const _sfc_main$1 = {
  el: "#addBasket",
  name: "AddBasket",
  props: ["sm", "ProductItem"],
  data() {
    return {
      isBasket: false,
      USER_STATE: this.$store.getUser
    };
  },
  created() {
    console.log(this.ProductItem);
    let self = this;
    let a = this.USER_STATE.basket.find(function(item) {
      if (item.productItem.id == self.ProductItem.id) {
        return true;
      } else {
        return false;
      }
    });
    if (a) {
      this.isBasket = true;
    } else {
      this.isBasket = false;
    }
  },
  methods: {
    async removeBasketBtn() {
      let response_add = await removeBasket(this.ProductItem.product.id, void 0, void 0, this.ProductItem.id);
      if (response_add.status == 200) {
        this.$store.REMOVE_BASKET_ITEM(this.ProductItem.id);
        this.isBasket = false;
      }
    },
    async addBasketBtn() {
      let response_add = await addBasket(this.ProductItem.product.id, this.ProductItem.weight.id);
      if (response_add.status == 200) {
        this.isBasket = true;
      }
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "addBasket" }, _attrs))} data-v-09d7f640>`);
  if ($data.isBasket) {
    _push(`<button class="flex btn_add_favorite remove_kor jus-sp" data-v-09d7f640><img class="add_favorite"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/x_tovar.png")} alt="" data-v-09d7f640><p class="b_text" data-v-09d7f640>Убрать из корзины</p></button>`);
  } else {
    _push(`<button class="flex btn_add_favorite remove_kor jus-sp" data-v-09d7f640><img class="add_favorite" style="${ssrRenderStyle(!$data.isBasket ? "transform: rotate(45deg)" : "")}"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/x_tovar.png")} alt="" data-v-09d7f640><p class="b_text" data-v-09d7f640>Добавить в корзину</p></button>`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/BasketComp/AddBasket.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AddBasket = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-09d7f640"]]);
const account_css_vue_type_style_index_0_src_e3945787_scoped_e3945787_lang = "";
const _sfc_main = {
  el: "#favorite",
  name: "FavoriteComp",
  props: ["ProductItem"],
  data() {
    return {
      isFavorite: false,
      USER_STATE: this.$store.getUser
    };
  },
  setup() {
  },
  created() {
    let self = this;
    console.log(this.USER_STATE.favorite_product);
    let a = this.USER_STATE.favorite_product.find(function(item) {
      console.log(item.id, self.id);
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
      let response_add = await addFavorite(this.ProductItem.product.id, this.ProductItem.weight.id);
      if (response_add.status == 200) {
        this.isFavorite = true;
      }
    },
    async removeFavoriteBtn() {
      console.log(this.ProductItem);
      let response_add = await removeFavorite(this.ProductItem.product.id, void 0, void 0, this.ProductItem.id);
      if (response_add.status == 200) {
        this.$store.REMOVE_FAVORITE_ITEM(response_add.data.id);
        this.isFavorite = false;
      }
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "favorite" }, _attrs))} data-v-e3945787>`);
  if ($data.isFavorite) {
    _push(`<button class="flex btn_add_favorite jus-sp" data-v-e3945787><img class="add_favorite"${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/favorite/favorite_remove.png`)} alt="" data-v-e3945787><p class="b_text" data-v-e3945787> Избранное </p></button>`);
  } else {
    _push(`<button class="flex btn_add_favorite jus-sp" data-v-e3945787><img class="add_favorite"${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/favorite/favorite_add.png`)} alt="" data-v-e3945787><p class="b_text" data-v-e3945787>Добавить в избранное</p></button>`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/BasketComp/FavoriteComp.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FavoriteComp = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-e3945787"]]);
export {
  AddBasket as A,
  FavoriteComp as F
};
//# sourceMappingURL=FavoriteComp-167c184d.js.map
