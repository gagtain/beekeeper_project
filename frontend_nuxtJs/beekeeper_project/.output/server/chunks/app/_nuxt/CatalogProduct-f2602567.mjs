import { _ as _export_sfc, b as __nuxt_component_0$1 } from '../server.mjs';
import { A as AddBasket, F as FavoriteComp } from './FavoriteComp-e87b76fb.mjs';
import { useSSRContext, resolveComponent, mergeProps, withCtx, createVNode, toDisplayString } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';

const _sfc_main$4 = {
  el: "#photo-album",
  name: "TovarMinImageList",
  props: ["image", "ImageProductList"],
  created() {
    console.log(this.ImageProductList);
  },
  methods: {
    a(img) {
      img.srcElement.parentElement.parentElement.firstChild.getElementsByTagName(
        "img"
      )[0].src = img.srcElement.src;
    }
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "photo-album flex",
    id: "photo-album"
  }, _attrs))} data-v-1a834377><img class="add-img-tovar"${ssrRenderAttr("src", _ctx.$api_root + $props.image)} data-v-1a834377><!--[-->`);
  ssrRenderList($props.ImageProductList, (img, index) => {
    _push(`<img class="add-img-tovar"${ssrRenderAttr("src", _ctx.$api_root + img.photo)} data-v-1a834377>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/TovarMinImageList.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const TovarMinImageList = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4], ["__scopeId", "data-v-1a834377"]]);
const _sfc_main$3 = {
  el: "#rating",
  name: "RatingComp",
  props: ["rating"]
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tovar/RatingComp.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const RatingComp = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$2 = {
  props: ["select_productItem", "pr"],
  methods: {
    select_type_weigth(pk) {
      let a = this.pr.productItemList.slice();
      let select_product = a.filter((ob) => ob.weight.id == pk)[0];
      this.$emit("select_product", select_product);
      console.log(this.select_productItem);
    },
    get_weight_type_list() {
      let list = [];
      this.pr.productItemList.forEach((element) => {
        list.push(element.weight);
      });
      return list;
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  if ($props.select_productItem.weight) {
    _push(`<div${ssrRenderAttrs(mergeProps({ class: "variant" }, _attrs))} data-v-f1928444><h3 data-v-f1928444>\u0420\u0430\u0437\u043C\u0435\u0440</h3><div class="flex" data-v-f1928444><ul class="variant-ul" data-v-f1928444><!--[-->`);
    ssrRenderList($options.get_weight_type_list(), (ls_w, index) => {
      _push(`<li class="${ssrRenderClass([$props.select_productItem.weight.id == ls_w.id ? "active" : "", "photo-album-li"])}" data-v-f1928444><div class="h_sto" data-v-f1928444><p data-v-f1928444>${ssrInterpolate(ls_w.weight)} \u0433\u0440</p></div></li>`);
    });
    _push(`<!--]--></ul></div></div>`);
  } else {
    _push(`<!---->`);
  }
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Product/SelectVariantMenu.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const SelectVariantMenu = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-f1928444"]]);
const _sfc_main$1 = {
  data() {
    return {
      select_productItem: null
    };
  },
  methods: {
    select_product(e) {
      this.select_productItem = e;
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Product/SelectVariantMixin.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const SelectVariantMixin = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {
  el: "#product_catalog",
  name: "CatalogProduct",
  props: ["pr"],
  components: {
    TovarMinImageList,
    AddBasket,
    FavoriteComp,
    RatingComp,
    SelectVariantMenu
  },
  mixins: [SelectVariantMixin],
  data() {
    return {
      type_weigth_id: null
    };
  },
  created() {
    this.select_productItem = this.pr.productItemList[0];
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TovarMinImageList = resolveComponent("TovarMinImageList");
  const _component_NuxtLink = __nuxt_component_0$1;
  const _component_rating_comp = resolveComponent("rating-comp");
  const _component_select_variant_menu = resolveComponent("select-variant-menu");
  const _component_AddBasket = resolveComponent("AddBasket");
  const _component_FavoriteComp = resolveComponent("FavoriteComp");
  _push(`<section${ssrRenderAttrs(mergeProps({
    class: "product",
    id: "product_catalog"
  }, _attrs))} data-v-70e5a602><div class="product__photo" data-v-70e5a602><div class="photo-container" data-v-70e5a602><div class="photo-main" data-v-70e5a602><div class="controls" data-v-70e5a602></div><img${ssrRenderAttr("src", _ctx.$api_root + $props.pr.image)} alt="green apple slice" data-v-70e5a602></div>`);
  _push(ssrRenderComponent(_component_TovarMinImageList, {
    image: $props.pr.image,
    ImageProductList: $props.pr.ImageProductList
  }, null, _parent));
  _push(`</div></div><div class="product__info" data-v-70e5a602><div class="title" data-v-70e5a602>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    "no-prefetch": "",
    to: `/tovar/${$props.pr.id}`
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p class="small-big product__name" data-v-70e5a602${_scopeId}>${ssrInterpolate($props.pr.name)}</p>`);
      } else {
        return [
          createVNode("p", { class: "small-big product__name" }, toDisplayString($props.pr.name), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="very-small product__code" data-v-70e5a602>COD: ${ssrInterpolate($props.pr.id)}</span></div><div class="price" data-v-70e5a602><span class="product__price small-big" data-v-70e5a602>${ssrInterpolate(_ctx.select_productItem.price)} <span class="product__price small" data-v-70e5a602>${ssrInterpolate($props.pr.price_currency)}</span></span></div>`);
  _push(ssrRenderComponent(_component_rating_comp, {
    rating: $props.pr.rating
  }, null, _parent));
  _push(ssrRenderComponent(_component_select_variant_menu, {
    select_productItem: _ctx.select_productItem,
    pr: $props.pr,
    onSelect_product: _ctx.select_product
  }, null, _parent));
  _push(`<div style="${ssrRenderStyle(_ctx.select_productItem.weight ? "margin-top: 8px" : "margin-top: 56px")}" class="flex jus-sp" data-v-70e5a602>`);
  _push(ssrRenderComponent(_component_AddBasket, {
    style: { "width": "40%" },
    id: _ctx.select_productItem.id
  }, null, _parent));
  _push(ssrRenderComponent(_component_FavoriteComp, {
    id: _ctx.select_productItem.id
  }, null, _parent));
  _push(`</div></div></section>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Catalog/CatalogProduct.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CatalogProduct = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-70e5a602"]]);

export { CatalogProduct as C, RatingComp as R, SelectVariantMenu as S, TovarMinImageList as T };
//# sourceMappingURL=CatalogProduct-f2602567.mjs.map
