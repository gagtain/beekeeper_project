import { A as AddBasket, F as FavoriteComp } from "./FavoriteComp-167c184d.js";
import { resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
import "./removeFavorite-8c059756.js";
import "hookable";
import "devalue";
import "klona";
import "axios";
import "ofetch";
import "#internal/nitro";
import "unctx";
import "@vue/devtools-api";
import "destr";
import "h3";
import "@unhead/ssr";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "ufo";
import "cookie-es";
import "ohash";
import "defu";
const account_css_vue_type_style_index_0_src_8b48019a_scoped_8b48019a_lang = "";
const favorite_vue_vue_type_style_index_1_scoped_8b48019a_lang = "";
const _sfc_main = {
  el: "#favorite_main",
  name: "FavoriteBase",
  components: {
    AddBasket,
    FavoriteComp
  },
  data() {
    return {
      USER_STATE: this.$store.getUser
    };
  },
  created() {
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_FavoriteComp = resolveComponent("FavoriteComp");
  const _component_AddBasket = resolveComponent("AddBasket");
  const _component_router_link = resolveComponent("router-link");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-8b48019a><div class="wrapper flex" data-v-8b48019a><div class="user_card flex auto" data-v-8b48019a><div class="interactiv user_card_div auto" id="favorite_main" data-v-8b48019a><div class="w-sto kor" data-v-8b48019a><p class="small-big VAG" data-v-8b48019a>Избранное</p><div class="w-sto flex" data-v-8b48019a><div class="w-sto" data-v-8b48019a><!--[-->`);
  ssrRenderList($data.USER_STATE.favorite_product, (b) => {
    _push(`<div class="tovar w-sto flex" data-v-8b48019a><div class="tovar_kor_img_div" data-v-8b48019a><img class="tovar_kor_img"${ssrRenderAttr("src", _ctx.$api_root + b.productItem.product.image)} alt="" data-v-8b48019a></div><div class="info_tovar_kor flex jus-sp" data-v-8b48019a><div class="info_tovar_kor_osnov" data-v-8b48019a><p class="normal-small tovar_kor_name" data-v-8b48019a>${ssrInterpolate(b.productItem.product.name)} [${ssrInterpolate(b.productItem.weight.weight)} гр]</p><p class="normal-small info_in_tovar_kor description" data-v-8b48019a>${ssrInterpolate(b.productItem.product.price)} ${ssrInterpolate(b.productItem.product.price_currency)}</p><div style="${ssrRenderStyle({ "width": "45%" })}" class="flex" data-v-8b48019a>`);
    _push(ssrRenderComponent(_component_FavoriteComp, {
      id: b.id,
      ProductItem: b.productItem
    }, null, _parent));
    _push(ssrRenderComponent(_component_AddBasket, {
      id: b.id,
      ProductItem: b.productItem
    }, null, _parent));
    _push(`</div></div><div class="size_tovar_div" data-v-8b48019a><div class="size_tovar_kor" data-v-8b48019a><div class="select_size" data-v-8b48019a><button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "height": "32px", "border": "none", "border-radius": "6px" })}" onclick="alert(&#39;в разработке&#39;)" data-v-8b48019a>Изменить</button></div></div></div></div></div>`);
  });
  _push(`<!--]-->`);
  if (!$data.USER_STATE.favorite_product.length) {
    _push(`<div style="${ssrRenderStyle({ "width": "50%", "margin": "auto", "margin-top": "10%" })}" data-v-8b48019a><p style="${ssrRenderStyle({ "font-size": "28px" })}" class="VAG" data-v-8b48019a>Список избранного пуст :(</p><div class="select_size" data-v-8b48019a>`);
    _push(ssrRenderComponent(_component_router_link, { to: "/catalog" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}" data-v-8b48019a${_scopeId}> Перейти в каталог </button>`);
        } else {
          return [
            createVNode("button", { style: { "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" } }, " Перейти в каталог ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/favorite.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const favorite = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-8b48019a"]]);
export {
  favorite as default
};
//# sourceMappingURL=favorite-6b448c4e.js.map
