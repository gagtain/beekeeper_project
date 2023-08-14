import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc, a as _imports_0$1 } from '../server.mjs';
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
import 'axios';
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
import 'ipx';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))}><div class="wrapper-product w-sto flex"><div class="interactiv auto back"><div class="about_us"><div class="flex w-sto"><p class="small-big VAG auto">\u041E \u043D\u0430\u0441</p></div><div class="flex w-sto inf"><div class="to_info"><div class="img flex"><img style="${ssrRenderStyle({ "width": "200px", "height": "200px", "margin": "auto" })}"${ssrRenderAttr("src", _imports_0$1)} alt=""></div><div class="desk m2"><p class="small">\u041F\u0447\u0435\u043B\u0438\u043D\u0430\u044F \u0430\u0440\u0442\u0435\u043B\u044C</p><p class="small">\u041E\u0441\u043D\u043E\u0432\u0430\u0442\u0435\u043B\u044C: \u0418\u0432\u0430\u043D\u0435\u043D\u043A\u043E \u0418. \u0418.</p><p class="small">\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u0430\u044F \u043F\u043E\u0447\u0442\u0430: @gmail.com</p><button style="${ssrRenderStyle({ "background": "rgb(255, 188, 65)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}">\u0413\u0430\u043B\u0435\u0440\u0435\u044F</button></div></div><div class="big_info"><p class="small"> \u041C\u044B \u043E\u0441\u043D\u043E\u0432\u0430\u043D\u044B \u0432 ... . \u0420\u0430\u0431\u043E\u0442\u0430\u0435\u043C \u0442\u0430\u043A \u0442\u043E, \u0434\u0435\u043B\u0430\u0435\u043C \u0442\u043E \u0442\u043E, Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero modi sequi veniam ratione consequatur. Quidem, cum adipisci? Veniam consectetur dolores dignissimos dolorem consequuntur! Porro dignissimos inventore ut impedit vel ipsum. </p></div></div><div class="flex w-sto"><p class="small-big VAG auto">\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F</p></div><div class="flex w-sto"><p class="small-big VAG auto">\u0421\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u044B</p></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about_us.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const about_us = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { about_us as default };
//# sourceMappingURL=about_us-c0090954.mjs.map
