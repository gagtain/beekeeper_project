import { a as addBasket, r as removeBasket, b as addFavorite, c as removeFavorite } from "./removeFavorite-8c059756.js";
import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrRenderStyle, ssrInterpolate } from "vue/server-renderer";
import { _ as _export_sfc, d as defineNuxtComponent } from "../server.mjs";
import "hookable";
import "destr";
import "devalue";
import "klona";
const katalog_scss_vue_type_style_index_0_src_0e691b4d_scoped_0e691b4d_lang = "";
const _sfc_main$2 = {
  el: "#addBasket",
  name: "AddBasket",
  props: ["id", "pack_id", "wei_id"],
  data() {
    return {
      isBasket: false
    };
  },
  created() {
    this.a();
  },
  setup() {
  },
  methods: {
    a() {
      let self = this;
      console.log(this.$store.getUser.basket);
      let a = this.$store.getUser.basket.find(function(item) {
        if (self.id == item.productItem.product.id && self.wei_id == item.productItem.weight.id) {
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
    async addBasketBtn() {
      let response_add = await addBasket(this.id, this.wei_id);
      if (response_add.status == 200) {
        this.$store.ADD_BASKET_ITEM(response_add.data.basketItem);
        this.isBasket = true;
      }
    },
    async removeBasketBtn() {
      let response_add = await removeBasket(this.id, this.wei_id);
      if (response_add.status == 200) {
        this.$store.REMOVE_BASKET_ITEM(response_add.data.id);
        this.isBasket = false;
      }
    }
  },
  // watch на элементы которые меняются и менять isBasket
  watch: {
    pack_id() {
      console.log(3214);
      this.a();
    },
    wei_id() {
      console.log(3214);
      this.a();
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "addBasket" }, _attrs))} data-v-0e691b4d>`);
  if ($data.isBasket) {
    _push(`<button class="w-sto btn au" data-v-0e691b4d>Из корзины</button>`);
  } else {
    _push(`<button class="w-sto btn au" data-v-0e691b4d>В корзину</button>`);
  }
  _push(`</div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/AddBasket.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AddBasket = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-0e691b4d"]]);
const FavoriteComp_vue_vue_type_style_index_0_scoped_eb5116cb_lang = "";
const _sfc_main$1 = /* @__PURE__ */ defineNuxtComponent({
  el: "#favorite",
  name: "FavoriteComp",
  props: ["id", "wei_id"],
  data() {
    return {
      isFavorite: false
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
      let a = this.$store.getUser.favorite_product.find(function(item) {
        if (self.id == item.productItem.product.id && self.wei_id == item.productItem.weight.id) {
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
        );
        this.isFavorite = false;
      }
    }
  },
  watch: {
    wei_id() {
      this.a();
    }
  }
}, "$mMs4bzKJaw");
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  if (_ctx.isFavorite) {
    _push(`<button${ssrRenderAttrs(mergeProps({
      id: "favorite",
      class: "fav-btn flex"
    }, _attrs))} data-v-eb5116cb><img class="auto"${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/favorite/favorite_remove.png`)} alt="" data-v-eb5116cb></button>`);
  } else {
    _push(`<button${ssrRenderAttrs(mergeProps({
      id: "favorite",
      class: "fav-btn flex"
    }, _attrs))} data-v-eb5116cb><img class="auto"${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/favorite/favorite_add.png`)} alt="" data-v-eb5116cb></button>`);
  }
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/FavoriteComp.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const FavoriteComp = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-eb5116cb"]]);
const rating_css_vue_type_style_index_0_src_true_lang = "";
const _sfc_main = {
  el: "#rating",
  name: "RatingComp",
  props: ["rating"]
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "rating-mini",
    id: "rating"
  }, _attrs))}><!--[-->`);
  ssrRenderList(Math.round($props.rating), (i) => {
    _push(`<span class="active"></span>`);
  });
  _push(`<!--]--><!--[-->`);
  ssrRenderList(5 - Math.round($props.rating), (i) => {
    _push(`<span></span>`);
  });
  _push(`<!--]--><p class="normal-small" style="${ssrRenderStyle({ "display": "inline" })}">/${ssrInterpolate(Math.round($props.rating * 100) / 100)}</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tovar/RatingComp.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RatingComp = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  AddBasket as A,
  FavoriteComp as F,
  RatingComp as R
};
//# sourceMappingURL=RatingComp-20429173.js.map
