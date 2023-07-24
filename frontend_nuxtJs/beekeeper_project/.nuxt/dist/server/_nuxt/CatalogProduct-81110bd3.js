import { _ as _export_sfc, b as __nuxt_component_0 } from "../server.mjs";
import { A as AddBasket, F as FavoriteComp, R as RatingComp } from "./RatingComp-20429173.js";
import { mergeProps, useSSRContext, resolveComponent, withCtx, createVNode, toDisplayString } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
const hexTovar_css_vue_type_style_index_0_src_1a834377_scoped_1a834377_lang = "";
const _sfc_main$1 = {
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
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "photo-album flex",
    id: "photo-album"
  }, _attrs))} data-v-1a834377><img class="add-img-tovar"${ssrRenderAttr("src", _ctx.$api_root + $props.image)} data-v-1a834377><!--[-->`);
  ssrRenderList($props.ImageProductList, (img, index) => {
    _push(`<img class="add-img-tovar"${ssrRenderAttr("src", _ctx.$api_root + img.photo)} data-v-1a834377>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/TovarMinImageList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const TovarMinImageList = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-1a834377"]]);
const katalog_scss_vue_type_style_index_0_src_61047b49_scoped_61047b49_lang = "";
const checkbox_scss_vue_type_style_index_1_src_61047b49_scoped_61047b49_lang = "";
const CatalogProduct_vue_vue_type_style_index_2_scoped_61047b49_lang = "";
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
      type_weigth_id: null
    };
  },
  created() {
    this.type_weigth_id = this.pr.list_weight[0].id;
  },
  methods: {
    select_type_weigth(pk) {
      console.log(pk);
      this.type_weigth_id = pk;
    },
    select_type_pack(pk) {
      console.log(pk);
      this.type_pack_id = pk;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TovarMinImageList = resolveComponent("TovarMinImageList");
  const _component_NuxtLink = __nuxt_component_0;
  const _component_rating_comp = resolveComponent("rating-comp");
  const _component_AddBasket = resolveComponent("AddBasket");
  const _component_FavoriteComp = resolveComponent("FavoriteComp");
  _push(`<section${ssrRenderAttrs(mergeProps({
    class: "product",
    id: "product_catalog"
  }, _attrs))} data-v-61047b49><div class="product__photo" data-v-61047b49><div class="photo-container" data-v-61047b49><div class="photo-main" data-v-61047b49><div class="controls" data-v-61047b49></div><img${ssrRenderAttr("src", _ctx.$api_root + $props.pr.image)} alt="green apple slice" data-v-61047b49></div>`);
  _push(ssrRenderComponent(_component_TovarMinImageList, {
    image: $props.pr.image,
    ImageProductList: $props.pr.ImageProductList
  }, null, _parent));
  _push(`</div></div><div class="product__info" data-v-61047b49><div class="title" data-v-61047b49>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    "no-prefetch": "",
    to: `/tovar/${$props.pr.id}`
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p class="small-big product__name" data-v-61047b49${_scopeId}>${ssrInterpolate($props.pr.name)}</p>`);
      } else {
        return [
          createVNode("p", { class: "small-big product__name" }, toDisplayString($props.pr.name), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="very-small product__code" data-v-61047b49>COD: ${ssrInterpolate($props.pr.id)}</span></div><div class="price" data-v-61047b49><span class="product__price small-big" data-v-61047b49>${ssrInterpolate($props.pr.price)} <span class="product__price small" data-v-61047b49>${ssrInterpolate($props.pr.price_currency)}</span></span></div>`);
  _push(ssrRenderComponent(_component_rating_comp, {
    rating: $props.pr.rating
  }, null, _parent));
  _push(`<div class="variant" data-v-61047b49><h3 data-v-61047b49>Размер</h3><div class="flex" data-v-61047b49><ul class="variant-ul" data-v-61047b49><!--[-->`);
  ssrRenderList($props.pr.list_weight, (ls_w, index) => {
    _push(`<li class="${ssrRenderClass([$data.type_weigth_id == ls_w.id ? "active" : "", "photo-album-li"])}" data-v-61047b49><div class="h_sto" data-v-61047b49><p data-v-61047b49>${ssrInterpolate(ls_w.weight)} гр</p></div></li>`);
  });
  _push(`<!--]--></ul></div></div><div class="product__text" data-v-61047b49></div><div class="flex jus-sp" data-v-61047b49>`);
  _push(ssrRenderComponent(_component_AddBasket, {
    id: $props.pr.id,
    wei_id: $data.type_weigth_id
  }, null, _parent));
  _push(ssrRenderComponent(_component_FavoriteComp, {
    id: $props.pr.id,
    wei_id: $data.type_weigth_id
  }, null, _parent));
  _push(`</div></div></section>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Catalog/CatalogProduct.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CatalogProduct = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-61047b49"]]);
export {
  CatalogProduct as C,
  TovarMinImageList as T
};
//# sourceMappingURL=CatalogProduct-81110bd3.js.map
