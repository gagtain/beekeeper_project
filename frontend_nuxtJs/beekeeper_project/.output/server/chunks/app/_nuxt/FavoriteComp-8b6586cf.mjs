import { a as addBasket, r as removeBasket, b as addFavorite, c as removeFavorite } from './removeFavorite-c9297cac.mjs';
import { useSSRContext, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc, d as defineNuxtComponent } from '../server.mjs';

const _sfc_main$1 = {
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
        if (self.id == item.productItem.product.id && self.wei_id == item.productItem.weight.id && self.pack_id == item.productItem.type_packaging.id) {
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
      let response_add = await addBasket(this.id, this.pack_id, this.wei_id);
      if (response_add.status == 200) {
        this.$store.ADD_BASKET_ITEM(response_add.data.basketItem);
        this.isBasket = true;
      }
    },
    async removeBasketBtn() {
      let response_add = await removeBasket(this.id, this.pack_id, this.wei_id);
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
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "addBasket" }, _attrs))} data-v-196cf92a>`);
  if ($data.isBasket) {
    _push(`<button class="btn au" data-v-196cf92a>\u0423\u0431\u0440\u0430\u0442\u044C \u0438\u0437 \u043A\u043E\u0440\u0437\u0438\u043D\u044B</button>`);
  } else {
    _push(`<button class="btn au" data-v-196cf92a>\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443</button>`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/AddBasket.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AddBasket = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-196cf92a"]]);
const _sfc_main = /* @__PURE__ */ defineNuxtComponent({
  el: "#favorite",
  name: "FavoriteComp",
  props: ["id", "pack_id", "wei_id"],
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
        if (self.id == item.productItem.product.id && self.wei_id == item.productItem.weight.id && self.pack_id == item.productItem.type_packaging.id) {
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
        this.$store.ADD_FAVORITE_ITEM(
          response_add.data.favoriteItem
        );
        this.isFavorite = true;
      }
    },
    async removeFavoriteBtn() {
      let response_add = await removeFavorite(this.id, this.pack_id, this.wei_id);
      if (response_add.status == 200) {
        this.$store.REMOVE_FAVORITE_ITEM(
          response_add.data.id
        );
        this.isFavorite = false;
      }
    }
  },
  watch: {
    pack_id() {
      this.a();
    },
    wei_id() {
      this.a();
    }
  }
}, "$mMs4bzKJaw");
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  if (_ctx.isFavorite) {
    _push(`<button${ssrRenderAttrs(mergeProps({
      id: "favorite",
      class: "fav-btn flex auto"
    }, _attrs))} data-v-be7316bf><img class="auto"${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/favorite/favorite_remove.png`)} alt="" data-v-be7316bf></button>`);
  } else {
    _push(`<button${ssrRenderAttrs(mergeProps({
      id: "favorite",
      class: "fav-btn flex auto"
    }, _attrs))} data-v-be7316bf><img class="auto"${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/favorite/favorite_add.png`)} alt="" data-v-be7316bf></button>`);
  }
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/FavoriteComp.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FavoriteComp = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-be7316bf"]]);

export { AddBasket as A, FavoriteComp as F };
//# sourceMappingURL=FavoriteComp-8b6586cf.mjs.map
