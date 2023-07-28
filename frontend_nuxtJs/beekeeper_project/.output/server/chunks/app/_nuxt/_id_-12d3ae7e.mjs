import { useSSRContext, mergeProps, resolveComponent } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc, a as api_root, u as useCookie } from '../server.mjs';
import { A as AddBasket, F as FavoriteComp } from './FavoriteComp-daadb83c.mjs';
import { R as RatingComp, C as CatalogProduct } from './CatalogProduct-6d5cf765.mjs';
import axios from 'axios';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'destr';
import 'h3';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'ufo';
import 'cookie-es';
import 'ohash';
import 'defu';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'klona';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';

const _sfc_main$2 = {
  el: "galery_product",
  name: "TovarImage",
  props: ["image", "ImageProductList"],
  created() {
    console.log(this.image);
  },
  methods: {
    a(img) {
      document.getElementById("main_tovar_img").src = img.srcElement.src;
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "images_tovar flex",
    id: "galery_product"
  }, _attrs))} data-v-16ad3630><div class="min" data-v-16ad3630><ul class="jus-sp-ar" data-v-16ad3630><li class="li_min_img" data-v-16ad3630><img class="tovar_img_the_min"${ssrRenderAttr("src", _ctx.$api_root + $props.image)} alt="" data-v-16ad3630></li><!--[-->`);
  ssrRenderList($props.ImageProductList, (im, index) => {
    _push(`<li class="li_min_img" data-v-16ad3630><img class="tovar_img_the_min"${ssrRenderAttr("src", _ctx.$api_root + im.photo)} alt="" data-v-16ad3630></li>`);
  });
  _push(`<!--]--></ul></div><div class="max" data-v-16ad3630><img id="main_tovar_img" class="tovar_img_the_max"${ssrRenderAttr("src", _ctx.$api_root + $props.image)} alt="" data-v-16ad3630></div></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tovar/TovarImage.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-16ad3630"]]);
const _sfc_main$1 = {
  props: ["pr"],
  data() {
    return {
      isDescription: false,
      isSostav: false,
      type_weigth_id: null
    };
  },
  components: {
    AddBasket,
    FavoriteComp,
    TovarImage: __nuxt_component_0$1,
    RatingComp
  },
  extends: CatalogProduct,
  methods: {
    getCategoryList() {
      let cat_list = this.pr.category.slice();
      let l = [];
      cat_list.forEach((element) => {
        l.push(element.name);
      });
      return l;
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TovarImage = __nuxt_component_0$1;
  const _component_rating_comp = resolveComponent("rating-comp");
  const _component_AddBasket = resolveComponent("AddBasket");
  const _component_FavoriteComp = resolveComponent("FavoriteComp");
  if ($props.pr) {
    _push(`<div${ssrRenderAttrs(mergeProps({ class: "ob flex jus-sp w-sto" }, _attrs))} data-v-f091f05d>`);
    _push(ssrRenderComponent(_component_TovarImage, {
      image: $props.pr.image,
      ImageProductList: $props.pr.ImageProductList
    }, null, _parent));
    _push(`<div class="tovar_infa" data-v-f091f05d><div class="tovar_name" data-v-f091f05d><p class="black bolshoi auto" data-v-f091f05d>${ssrInterpolate($props.pr.name)}</p></div><div class="tovar_two" data-v-f091f05d><p class="black nebolsh" data-v-f091f05d>\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438: ${ssrInterpolate($options.getCategoryList().join(", "))}</p></div>`);
    _push(ssrRenderComponent(_component_rating_comp, {
      rating: $props.pr.rating
    }, null, _parent));
    _push(`<div class="price flex" data-v-f091f05d><span style="${ssrRenderStyle({ "line-height": "1" })}" class="tovar_price VAG small-big" data-v-f091f05d>${ssrInterpolate(_ctx.select_productItem.price)} <span style="${ssrRenderStyle({ "line-height": "1" })}" class="tovar_price VAG small" data-v-f091f05d>${ssrInterpolate(_ctx.select_productItem.price_currency)}</span></span></div><div class="variant tovar_two" data-v-f091f05d><h3 data-v-f091f05d>\u0420\u0430\u0437\u043C\u0435\u0440</h3><div class="flex" data-v-f091f05d><ul class="variant-ul" data-v-f091f05d><!--[-->`);
    ssrRenderList($props.pr.list_weight, (ls_w, index) => {
      _push(`<li class="${ssrRenderClass([_ctx.select_productItem.weight.id == ls_w.id ? "active" : "", "photo-album-li"])}" data-v-f091f05d><div class="h_sto" data-v-f091f05d><p data-v-f091f05d>${ssrInterpolate(ls_w.weight)} \u0433\u0440</p></div></li>`);
    });
    _push(`<!--]--></ul></div></div><div class="flex tovar_two jus-sp but but-b product_menu" data-v-f091f05d>`);
    _push(ssrRenderComponent(_component_AddBasket, {
      style: { "width": "40%" },
      id: _ctx.select_productItem.id
    }, null, _parent));
    _push(ssrRenderComponent(_component_FavoriteComp, {
      id: _ctx.select_productItem.id
    }, null, _parent));
    _push(`</div><div class="tovar_two" data-v-f091f05d><p class="black malenkii" data-v-f091f05d>\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u043E\u0441\u0442\u0438</p></div><div class="tovar_two vib" data-v-f091f05d><div class="flex jus-sp op_contex" data-v-f091f05d><p class="black malenkii vib_" data-v-f091f05d>\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435</p><div class="contex material-symbols-outlined" data-v-f091f05d> - </div></div>`);
    if ($data.isDescription) {
      _push(`<div class="context_text" data-v-f091f05d><p class="malenkii black" data-v-f091f05d>${ssrInterpolate($props.pr.description)}</p></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div><div class="tovar_two vib" data-v-f091f05d><div class="flex jus-sp op_contex" data-v-f091f05d><p class="black malenkii vib_" data-v-f091f05d>\u0421\u043E\u0441\u0442\u0430\u0432</p><div class="contex material-symbols-outlined" data-v-f091f05d><span class="material-symbols-outlined" data-v-f091f05d> - </span></div></div>`);
    if ($data.isSostav) {
      _push(`<div class="context_text" data-v-f091f05d><p class="malenkii black" data-v-f091f05d>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora natus rem temporibus deserunt repudiandae iure officia cumque eum omnis sapiente illum voluptates, amet ex optio consectetur sed dolore sit eaque.</p></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div></div>`);
  } else {
    _push(`<!---->`);
  }
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tovar/Tovar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-f091f05d"]]);
async function getTovar(pk) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/product/${pk}`,
      method: "get",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main = {
  el: "#tovar",
  name: "TovarBase",
  components: {
    Tovar: __nuxt_component_0
  },
  data() {
    return {
      tovar: null
    };
  },
  async created() {
    let response_tovar = await getTovar(this.$route.params.id);
    console.log(response_tovar);
    if (response_tovar.status == 200) {
      this.tovar = response_tovar.data;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_tovar = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-d779fa96><div class="wrapper flex w-sto" data-v-d779fa96><div class="tovar_in flex interactiv jus-sp auto" id="tovar" data-v-d779fa96>`);
  if ($data.tovar) {
    _push(ssrRenderComponent(_component_tovar, { pr: $data.tovar }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tovar/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-d779fa96"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-12d3ae7e.mjs.map
