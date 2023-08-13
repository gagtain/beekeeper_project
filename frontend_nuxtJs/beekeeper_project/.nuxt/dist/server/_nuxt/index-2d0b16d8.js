import { _ as _export_sfc, u as useHead, b as __nuxt_component_0 } from "../server.mjs";
import { mergeProps, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import "hookable";
import "destr";
import "devalue";
import "klona";
import { n as newsList } from "./newsList-667eb38d.js";
import { L as LoadingComp } from "./LoadingComp-34c86e82.js";
import "ofetch";
import "#internal/nitro";
import "unctx";
import "@vue/devtools-api";
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
const news_min_css_vue_type_style_index_0_src_206161c0_scoped_206161c0_lang = "";
const index_vue_vue_type_style_index_1_scoped_206161c0_lang = "";
const __default__ = {
  components: { LoadingComp },
  data() {
    return {
      news: null
    };
  },
  async created() {
    let r = await newsList(0, 20);
    this.news = r.data;
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Пчелиная артель - Новости"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-206161c0><div class="wrapper flex w-sto" data-v-206161c0><div class="interactiv auto back" data-v-206161c0><div class="w-sto product_div" data-v-206161c0><div class="flex w-sto" data-v-206161c0><p class="auto small-big VAG" data-v-206161c0>Новости</p></div>`);
      if (_ctx.news) {
        _push(`<section style="${ssrRenderStyle({ "padding": "5%" })}" class="grid w-sto" data-v-206161c0><!--[-->`);
        ssrRenderList(_ctx.news, (new_obj) => {
          _push(`<article class="grid-item" style="${ssrRenderStyle({ "max-height": "400px" })}" data-v-206161c0><div class="image" data-v-206161c0><img${ssrRenderAttr("src", this.$api_root + new_obj.main_image.slice(1))} data-v-206161c0></div><div class="info" data-v-206161c0>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/news/${new_obj.id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<h2 style="${ssrRenderStyle({ "display": "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", "overflow": "hidden" })}" data-v-206161c0${_scopeId}>${ssrInterpolate(new_obj.title)}</h2>`);
              } else {
                return [
                  createVNode("h2", { style: { "display": "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", "overflow": "hidden" } }, toDisplayString(new_obj.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<div class="info-text" data-v-206161c0><p data-v-206161c0>${ssrInterpolate(new_obj.main_text.slice(0, 80))}...</p></div><div class="button-wrap" data-v-206161c0>`);
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
        _push(ssrRenderComponent(LoadingComp, null, null, _parent));
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-206161c0"]]);
export {
  index as default
};
//# sourceMappingURL=index-2d0b16d8.js.map
