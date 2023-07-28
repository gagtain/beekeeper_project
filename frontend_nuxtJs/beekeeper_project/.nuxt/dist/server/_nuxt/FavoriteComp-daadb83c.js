import { mergeProps, useSSRContext } from "vue";
import "hookable";
import { a as api_root, u as useCookie, _ as _export_sfc, d as defineNuxtComponent } from "../server.mjs";
import "devalue";
import "klona";
import axios from "axios";
import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import "destr";
async function addBasket(pk, type_weight_id) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/basket/${pk}`,
      method: "post",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      },
      data: {
        type_weight: type_weight_id
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
async function removeBasket(pk) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/basket/${pk}`,
      method: "delete",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const katalog_scss_vue_type_style_index_0_src_e69ca2a1_scoped_e69ca2a1_lang = "";
const _sfc_main$1 = {
  el: "#addBasket",
  name: "AddBasket",
  props: ["id"],
  data() {
    return {
      isBasket: false
    };
  },
  created() {
  },
  setup() {
  },
  methods: {
    a() {
      let self = this;
      let a = this.$store.getUser.basket.find(function(item) {
        if (self.id == item.productItem.id) {
          return true;
        } else {
          return false;
        }
      });
      return a;
    },
    async addBasketBtn() {
      let response_add = await addBasket(this.id);
      if (response_add.status == 200) {
        this.$store.ADD_BASKET_ITEM(response_add.data.basketItem);
        this.isBasket = true;
      }
    },
    async removeBasketBtn() {
      let response_add = await removeBasket(this.id);
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
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "addBasket" }, _attrs))} data-v-e69ca2a1>`);
  if ($options.a()) {
    _push(`<button class="w-sto btn au" data-v-e69ca2a1>Из корзины</button>`);
  } else {
    _push(`<button class="w-sto btn au" data-v-e69ca2a1>В корзину</button>`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/AddBasket.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AddBasket = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-e69ca2a1"]]);
async function addFavorite(pk) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/favorite/${pk}`,
      method: "post",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
async function removeFavorite(pk) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/favorite/${pk}`,
      method: "delete",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const FavoriteComp_vue_vue_type_style_index_0_scoped_8d69c0da_lang = "";
const _sfc_main = /* @__PURE__ */ defineNuxtComponent({
  el: "#favorite",
  name: "FavoriteComp",
  props: ["id"],
  setup() {
  },
  created() {
    this.a();
  },
  methods: {
    a() {
      let self = this;
      let a = this.$store.getUser.favorite_product.find(function(item) {
        if (self.id == item.productItem.id) {
          return true;
        } else {
          return false;
        }
      });
      return a;
    },
    async addFavoriteBtn() {
      let response_add = await addFavorite(this.id);
      if (response_add.status == 200) {
        this.$store.ADD_FAVORITE_ITEM(
          response_add.data.favoriteItem
        );
        this.isFavorite = true;
      }
    },
    async removeFavoriteBtn() {
      let response_add = await removeFavorite(this.id);
      if (response_add.status == 200) {
        this.$store.REMOVE_FAVORITE_ITEM(
          response_add.data.id
        );
      }
    }
  },
  watch: {
    wei_id() {
      this.a();
    }
  }
}, "$mMs4bzKJaw");
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  if (_ctx.a()) {
    _push(`<button${ssrRenderAttrs(mergeProps({
      id: "favorite",
      class: "fav-btn flex"
    }, _attrs))} data-v-8d69c0da><img class="auto"${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/favorite/favorite_remove.png`)} alt="" data-v-8d69c0da></button>`);
  } else {
    _push(`<button${ssrRenderAttrs(mergeProps({
      id: "favorite",
      class: "fav-btn flex"
    }, _attrs))} data-v-8d69c0da><img class="auto"${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/favorite/favorite_add.png`)} alt="" data-v-8d69c0da></button>`);
  }
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/FavoriteComp.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FavoriteComp = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-8d69c0da"]]);
export {
  AddBasket as A,
  FavoriteComp as F
};
//# sourceMappingURL=FavoriteComp-daadb83c.js.map
