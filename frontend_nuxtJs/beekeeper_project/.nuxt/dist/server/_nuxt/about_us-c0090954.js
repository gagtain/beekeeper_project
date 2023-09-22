import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr } from "vue/server-renderer";
import { _ as _export_sfc, a as _imports_0 } from "../server.mjs";
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
const about_us_vue_vue_type_style_index_0_lang = "";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))}><div class="wrapper-product w-sto flex"><div class="interactiv auto back"><div class="about_us"><div class="flex w-sto"><p class="small-big VAG auto">О нас</p></div><div class="flex w-sto inf"><div class="to_info"><div class="img flex"><img style="${ssrRenderStyle({ "width": "200px", "height": "200px", "margin": "auto" })}"${ssrRenderAttr("src", _imports_0)} alt=""></div><div class="desk m2"><p class="small">Пчелиная артель</p><p class="small">Основатель: Иваненко И. И.</p><p class="small">Контактная почта: @gmail.com</p><button style="${ssrRenderStyle({ "background": "rgb(255, 188, 65)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}">Галерея</button></div></div><div class="big_info"><p class="small"> Мы основаны в ... . Работаем так то, делаем то то, Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero modi sequi veniam ratione consequatur. Quidem, cum adipisci? Veniam consectetur dolores dignissimos dolorem consequuntur! Porro dignissimos inventore ut impedit vel ipsum. </p></div></div><div class="flex w-sto"><p class="small-big VAG auto">Достижения</p></div><div class="flex w-sto"><p class="small-big VAG auto">Сертификаты</p></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about_us.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const about_us = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  about_us as default
};
//# sourceMappingURL=about_us-c0090954.js.map
