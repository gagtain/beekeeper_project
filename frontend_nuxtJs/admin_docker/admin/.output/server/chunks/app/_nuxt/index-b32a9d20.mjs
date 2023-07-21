import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { useSSRContext, resolveComponent, mergeProps, withCtx, createVNode } from 'vue';
import { _ as _export_sfc, a as __nuxt_component_0$1 } from '../server.mjs';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import 'ufo';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'defu';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'klona';
import 'ohash';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'http-graceful-shutdown';

const _sfc_main$2 = {
  setup() {
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<article${ssrRenderAttrs(_attrs)}><div class="order_article"><div class="flex"><img class="auto" src="https://cdekpromo.ru/chto-daet-dogovor-cdek.jpg" alt=""><div class="order_all_info auto"><p>\u0412\u0441\u0435\u0433\u043E \u0437\u0430\u043A\u0430\u0437\u043E\u0432</p><p class="videl">100</p></div></div><div class="flex"><img class="auto" src="https://cdekpromo.ru/chto-daet-dogovor-cdek.jpg" alt=""><div class="order_all_info auto"><p>\u041E\u0431\u0449\u0430\u044F \u0441\u0443\u043C\u043C\u0430 \u0437\u0430\u043A\u0430\u0437\u043E\u0432</p><p class="videl">2000 \u0440\u0443\u0431</p></div></div></div></article>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminComp/OrderArticle.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const OrderArticle = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$1 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = __nuxt_component_0$1;
  _push(`<article${ssrRenderAttrs(_attrs)}><div class="order-not-active"><p class="small">\u0412\u0441\u0435\u0433\u043E \u043D\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u0434\u043E\u0441\u0442\u0430\u0432\u043E\u043A: <span style="${ssrRenderStyle({ "color": "blue" })}">100</span></p>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/delivery/not-active",
    "no-prefetch": ""
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<button class="btn"${_scopeId}>\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C</button>`);
      } else {
        return [
          createVNode("button", { class: "btn" }, "\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></article>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminComp/DeliveryNotActive.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const DeliveryNotActive = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {
  components: { OrderArticle, DeliveryNotActive },
  setup() {
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_order_article = resolveComponent("order-article");
  const _component_delivery_not_active = resolveComponent("delivery-not-active");
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "grid" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_order_article, null, null, _parent));
  _push(ssrRenderComponent(_component_delivery_not_active, null, null, _parent));
  _push(`<article></article><article></article><article></article><article></article><article></article><article></article></section>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-b32a9d20.mjs.map
