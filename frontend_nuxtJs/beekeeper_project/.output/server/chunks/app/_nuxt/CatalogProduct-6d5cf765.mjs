import { _ as _export_sfc, b as __nuxt_component_0$1 } from '../server.mjs';
import { A as AddBasket, F as FavoriteComp } from './FavoriteComp-daadb83c.mjs';
import { useSSRContext, resolveComponent, mergeProps, withCtx, createVNode, toDisplayString } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';

const _sfc_main$2 = {
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
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "photo-album flex",
    id: "photo-album"
  }, _attrs))} data-v-1a834377><img class="add-img-tovar"${ssrRenderAttr("src", _ctx.$api_root + $props.image)} data-v-1a834377><!--[-->`);
  ssrRenderList($props.ImageProductList, (img, index) => {
    _push(`<img class="add-img-tovar"${ssrRenderAttr("src", _ctx.$api_root + img.photo)} data-v-1a834377>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/TovarMinImageList.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const TovarMinImageList = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-1a834377"]]);
const _sfc_main$1 = {
  el: "#rating",
  name: "RatingComp",
  props: ["rating"]
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tovar/RatingComp.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const RatingComp = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {
  el: "#product_catalog",
  name: "CatalogProduct",
  props: ["pr"],
  components: {
    TovarMinImageList,
    AddBasket,
    FavoriteComp,
    RatingComp
  },
  data() {
    return {
      type_weigth_id: null,
      select_productItem: null
    };
  },
  created() {
    this.select_productItem = this.pr.productItemList[0];
  },
  methods: {
    select_type_weigth(pk) {
      let a = this.pr.productItemList.slice();
      this.select_productItem = a.filter((ob) => ob.weight.id == pk)[0];
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
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TovarMinImageList = resolveComponent("TovarMinImageList");
  const _component_NuxtLink = __nuxt_component_0$1;
  const _component_rating_comp = resolveComponent("rating-comp");
  const _component_AddBasket = resolveComponent("AddBasket");
  const _component_FavoriteComp = resolveComponent("FavoriteComp");
  _push(`<section${ssrRenderAttrs(mergeProps({
    class: "product",
    id: "product_catalog"
  }, _attrs))} data-v-a4e8fa5b><div class="product__photo" data-v-a4e8fa5b><div class="photo-container" data-v-a4e8fa5b><div class="photo-main" data-v-a4e8fa5b><div class="controls" data-v-a4e8fa5b></div><img${ssrRenderAttr("src", _ctx.$api_root + $props.pr.image)} alt="green apple slice" data-v-a4e8fa5b></div>`);
  _push(ssrRenderComponent(_component_TovarMinImageList, {
    image: $props.pr.image,
    ImageProductList: $props.pr.ImageProductList
  }, null, _parent));
  _push(`</div></div><div class="product__info" data-v-a4e8fa5b><div class="title" data-v-a4e8fa5b>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    "no-prefetch": "",
    to: `/tovar/${$props.pr.id}`
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p class="small-big product__name" data-v-a4e8fa5b${_scopeId}>${ssrInterpolate($props.pr.name)}</p>`);
      } else {
        return [
          createVNode("p", { class: "small-big product__name" }, toDisplayString($props.pr.name), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="very-small product__code" data-v-a4e8fa5b>COD: ${ssrInterpolate($props.pr.id)}</span></div><div class="price" data-v-a4e8fa5b><span class="product__price small-big" data-v-a4e8fa5b>${ssrInterpolate($data.select_productItem.price)} <span class="product__price small" data-v-a4e8fa5b>${ssrInterpolate($props.pr.price_currency)}</span></span></div>`);
  _push(ssrRenderComponent(_component_rating_comp, {
    rating: $props.pr.rating
  }, null, _parent));
  _push(`<div class="variant" data-v-a4e8fa5b><h3 data-v-a4e8fa5b>\u0420\u0430\u0437\u043C\u0435\u0440</h3><div class="flex" data-v-a4e8fa5b><ul class="variant-ul" data-v-a4e8fa5b><!--[-->`);
  ssrRenderList($options.get_weight_type_list(), (ls_w, index) => {
    _push(`<li class="${ssrRenderClass([$data.select_productItem.weight.id == ls_w.id ? "active" : "", "photo-album-li"])}" data-v-a4e8fa5b><div class="h_sto" data-v-a4e8fa5b><p data-v-a4e8fa5b>${ssrInterpolate(ls_w.weight)} \u0433\u0440</p></div></li>`);
  });
  _push(`<!--]--></ul></div></div><div class="product__text" data-v-a4e8fa5b></div><div class="flex jus-sp" data-v-a4e8fa5b>`);
  _push(ssrRenderComponent(_component_AddBasket, {
    style: { "width": "40%" },
    id: $data.select_productItem.id
  }, null, _parent));
  _push(ssrRenderComponent(_component_FavoriteComp, {
    id: $data.select_productItem.id
  }, null, _parent));
  _push(`</div></div></section>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Catalog/CatalogProduct.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CatalogProduct = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-a4e8fa5b"]]);

export { CatalogProduct as C, RatingComp as R, TovarMinImageList as T };
//# sourceMappingURL=CatalogProduct-6d5cf765.mjs.map
