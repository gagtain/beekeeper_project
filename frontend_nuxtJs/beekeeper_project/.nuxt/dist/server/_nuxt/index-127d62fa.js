import { _ as _export_sfc, b as __nuxt_component_0 } from "../server.mjs";
import { n as newsList } from "./newsList-54d7dd14.js";
import { L as LoadingComp } from "./LoadingComp-34c86e82.js";
import { resolveComponent, mergeProps, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import "ofetch";
import "#internal/nitro";
import "hookable";
import "unctx";
import "@vue/devtools-api";
import "destr";
import "devalue";
import "klona";
import "h3";
import "@unhead/ssr";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "ufo";
import "cookie-es";
import "ohash";
import "axios";
import "defu";
const news_min_css_vue_type_style_index_0_src_040bfc16_scoped_040bfc16_lang = "";
const index_vue_vue_type_style_index_1_scoped_040bfc16_lang = "";
const _sfc_main = {
  components: { LoadingComp },
  data() {
    return {
      news: null
    };
  },
  async created() {
    let r = await newsList(0, 20);
    this.news = r.data;
    console.log(this.news);
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = __nuxt_component_0;
  const _component_loading_comp = resolveComponent("loading-comp");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-040bfc16><div class="wrapper flex w-sto" data-v-040bfc16><div class="interactiv auto back" data-v-040bfc16><div class="w-sto product_div" data-v-040bfc16><div class="flex w-sto" data-v-040bfc16><p class="auto small-big VAG" data-v-040bfc16>Новости</p></div>`);
  if ($data.news) {
    _push(`<section style="${ssrRenderStyle({ "padding": "5%" })}" class="grid w-sto" data-v-040bfc16><!--[-->`);
    ssrRenderList($data.news, (new_obj) => {
      _push(`<article class="grid-item" style="${ssrRenderStyle({ "max-height": "400px" })}" data-v-040bfc16><div class="image" data-v-040bfc16><img${ssrRenderAttr("src", this.$api_root + new_obj.main_image)} data-v-040bfc16></div><div class="info" data-v-040bfc16>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/news/${new_obj.id}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 data-v-040bfc16${_scopeId}>${ssrInterpolate(new_obj.title)}</h2>`);
          } else {
            return [
              createVNode("h2", null, toDisplayString(new_obj.title), 1)
            ];
          }
        }),
        _: 2
      }, _parent));
      _push(`<div class="info-text" data-v-040bfc16><p data-v-040bfc16>${ssrInterpolate(new_obj.main_text)}</p></div><div class="button-wrap" data-v-040bfc16>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "atuin-btn",
        to: `/news/${new_obj.id}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Подробнее`);
          } else {
            return [
              createTextVNode("Подробнее")
            ];
          }
        }),
        _: 2
      }, _parent));
      _push(`</div></div></article>`);
    });
    _push(`<!--]--></section>`);
  } else {
    _push(ssrRenderComponent(_component_loading_comp, null, null, _parent));
  }
  _push(`</div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-040bfc16"]]);
export {
  index as default
};
//# sourceMappingURL=index-127d62fa.js.map
