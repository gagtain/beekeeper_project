import axios from "axios";
import { b as api_root, _ as _export_sfc, d as defineNuxtComponent } from "../server.mjs";
import { useSSRContext, mergeProps } from "vue";
import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import "hookable";
import "destr";
import "devalue";
import "klona";
async function addBasket(pk, type_weight_id) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/basket/${pk}`,
      method: "post",
      headers: {},
      withCredentials: true,
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
      headers: {},
      withCredentials: true
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main$2 = {
  methods: {
    tooltip() {
      this.$store.REFACTOR_TOOLTIP({
        status: true,
        title: "Успешно"
      });
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/DefaultTooltip.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const DefaultTooltipVue = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const katalog_scss_vue_type_style_index_0_src_164542d6_scoped_164542d6_lang = "";
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
  mixins: [DefaultTooltipVue],
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
        this.tooltip();
      } else if (response_add.status == 401) {
        this.$router.push("/login?message=Для данного действия необходимо авторизоваться");
      }
    },
    async removeBasketBtn() {
      let response_add = await removeBasket(this.id);
      if (response_add.status == 200) {
        this.$store.REMOVE_BASKET_ITEM(response_add.data.id);
        this.isBasket = false;
        this.tooltip();
      } else if (response_add.status == 401) {
        this.$router.push("/login?message=Для данного действия необходимо авторизоваться");
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
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "addBasket" }, _attrs))} data-v-164542d6>`);
  if ($options.a()) {
    _push(`<button class="w-sto btn au" data-v-164542d6>Из корзины</button>`);
  } else {
    _push(`<button class="w-sto btn au" data-v-164542d6>В корзину</button>`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/AddBasket.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AddBasket = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-164542d6"]]);
async function addFavorite(pk) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/favorite/${pk}`,
      method: "post",
      headers: {},
      withCredentials: true
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
      headers: {},
      withCredentials: true
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const FavoriteComp_vue_vue_type_style_index_0_scoped_23c1e945_lang = "";
const _sfc_main = /* @__PURE__ */ defineNuxtComponent({
  el: "#favorite",
  name: "FavoriteComp",
  props: ["id"],
  mixins: [DefaultTooltipVue],
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
        this.tooltip();
      } else if (response_add.status == 401) {
        this.$router.push("/login?message=Для данного действия необходимо авторизоваться");
      }
    },
    async removeFavoriteBtn() {
      let response_add = await removeFavorite(this.id);
      if (response_add.status == 200) {
        this.$store.REMOVE_FAVORITE_ITEM(
          response_add.data.id
        );
        this.tooltip();
      } else if (response_add.status == 401) {
        this.$router.push("/login?message=Для данного действия необходимо авторизоваться");
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
    }, _attrs))} data-v-23c1e945><img class="auto"${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/favorite/favorite_remove.png`)} alt="" data-v-23c1e945></button>`);
  } else {
    _push(`<button${ssrRenderAttrs(mergeProps({
      id: "favorite",
      class: "fav-btn flex"
    }, _attrs))} data-v-23c1e945><img class="auto"${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/favorite/favorite_add.png`)} alt="" data-v-23c1e945></button>`);
  }
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/FavoriteComp.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FavoriteComp = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-23c1e945"]]);
export {
  AddBasket as A,
  FavoriteComp as F
};
//# sourceMappingURL=FavoriteComp-443120c2.js.map
