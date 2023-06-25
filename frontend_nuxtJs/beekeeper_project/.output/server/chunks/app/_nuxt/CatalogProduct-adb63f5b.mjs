import { _ as _export_sfc, b as __nuxt_component_0$1 } from '../server.mjs';
import { A as AddBasket, F as FavoriteComp } from './FavoriteComp-8b6586cf.mjs';
import { useSSRContext, resolveComponent, mergeProps, withCtx, createVNode, toDisplayString } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';

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
const _sfc_main = {
  el: "#product_catalog",
  name: "CatalogProduct",
  props: ["pr"],
  components: {
    TovarMinImageList,
    AddBasket,
    FavoriteComp
  },
  data() {
    return {
      type_weigth_id: null,
      type_pack_id: null
    };
  },
  created() {
    this.type_weigth_id = this.pr.list_weight[0].id;
    this.type_pack_id = this.pr.type_packaging[0].id;
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
  const _component_NuxtLink = __nuxt_component_0$1;
  const _component_AddBasket = resolveComponent("AddBasket");
  const _component_FavoriteComp = resolveComponent("FavoriteComp");
  _push(`<section${ssrRenderAttrs(mergeProps({
    class: "product",
    id: "product_catalog"
  }, _attrs))} data-v-8aa91168><div class="product__photo" data-v-8aa91168><div class="photo-container" data-v-8aa91168><div class="photo-main" data-v-8aa91168><div class="controls" data-v-8aa91168></div><img${ssrRenderAttr("src", _ctx.$api_root + $props.pr.image)} alt="green apple slice" data-v-8aa91168></div>`);
  _push(ssrRenderComponent(_component_TovarMinImageList, {
    image: $props.pr.image,
    ImageProductList: $props.pr.ImageProductList
  }, null, _parent));
  _push(`</div></div><div class="product__info" data-v-8aa91168><div class="title" data-v-8aa91168>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    "no-prefetch": "",
    to: `/tovar/${$props.pr.id}`
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p class="small-big product__name" data-v-8aa91168${_scopeId}>${ssrInterpolate($props.pr.name)}</p>`);
      } else {
        return [
          createVNode("p", { class: "small-big product__name" }, toDisplayString($props.pr.name), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="very-small product__code" data-v-8aa91168>COD: ${ssrInterpolate($props.pr.id)}</span></div><div class="price" data-v-8aa91168><span class="product__price small-big" data-v-8aa91168>${ssrInterpolate($props.pr.price)} <span class="product__price small" data-v-8aa91168>${ssrInterpolate($props.pr.price_currency)}</span></span></div><div class="variant" data-v-8aa91168><h3 data-v-8aa91168>\u0420\u0430\u0437\u043C\u0435\u0440</h3><div class="flex" data-v-8aa91168><ul class="variant-ul" data-v-8aa91168><!--[-->`);
  ssrRenderList($props.pr.list_weight, (ls_w, index) => {
    _push(`<li class="${ssrRenderClass([$data.type_weigth_id == ls_w.id ? "active" : "", "photo-album-li"])}" data-v-8aa91168><div class="h_sto" data-v-8aa91168><p data-v-8aa91168>${ssrInterpolate(ls_w.weight)} \u0433\u0440</p></div></li>`);
  });
  _push(`<!--]--></ul></div><h3 data-v-8aa91168>\u0422\u0438\u043F \u0443\u043F\u0430\u043A\u043E\u0432\u043A\u0438</h3><div class="flex" data-v-8aa91168><ul class="variant-ul" data-v-8aa91168><!--[-->`);
  ssrRenderList($props.pr.type_packaging, (ty_pck, index) => {
    _push(`<li class="${ssrRenderClass([$data.type_pack_id == ty_pck.id ? "active" : "", "photo-album-li"])}" data-v-8aa91168><div class="h_sto" data-v-8aa91168><p data-v-8aa91168>${ssrInterpolate(ty_pck.name)}</p></div></li>`);
  });
  _push(`<!--]--></ul></div></div><div class="product__text" data-v-8aa91168><p class="small" data-v-8aa91168>${ssrInterpolate($props.pr.description)}</p></div><div class="flex" data-v-8aa91168>`);
  _push(ssrRenderComponent(_component_AddBasket, {
    id: $props.pr.id,
    wei_id: $data.type_weigth_id,
    pack_id: $data.type_pack_id
  }, null, _parent));
  _push(ssrRenderComponent(_component_FavoriteComp, {
    id: $props.pr.id,
    wei_id: $data.type_weigth_id,
    pack_id: $data.type_pack_id
  }, null, _parent));
  _push(`</div></div></section>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Catalog/CatalogProduct.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CatalogProduct = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-8aa91168"]]);

export { CatalogProduct as C, TovarMinImageList as T };
//# sourceMappingURL=CatalogProduct-adb63f5b.mjs.map
