import { s as searchCountOrders } from './SearchCountOrders-4d81b291.mjs';
import axios from 'axios';
import { _ as _export_sfc, b as api_root, a as __nuxt_component_0$2 } from '../server.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { useSSRContext, resolveComponent, mergeProps, withCtx, createVNode } from 'vue';
import { s as searchCountDelivery } from './SearchCountDelivery-42eb8224.mjs';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import 'ufo';
import 'cookie-es';
import 'destr';
import 'ohash';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
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
import 'http-graceful-shutdown';

async function searchSumOrders(params) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/orders/search/sum?${params}`,
      method: "get",
      headers: {
        //     "Authorization": `Bearer ${useCookie('assess').value}`
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main$3 = {
  setup() {
  },
  data() {
    return {
      orders_sum: null,
      orders_count: null
    };
  },
  async mounted() {
    let r = await searchCountOrders("");
    this.orders_count = r.data.count;
    r = await searchSumOrders("");
    this.orders_sum = r.data.sum;
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<article${ssrRenderAttrs(_attrs)} data-v-272f3412><div class="order_article" data-v-272f3412><div class="flex" data-v-272f3412><img class="auto" src="https://cdekpromo.ru/chto-daet-dogovor-cdek.jpg" alt="" data-v-272f3412><div class="order_all_info auto" data-v-272f3412><p data-v-272f3412>\u0412\u0441\u0435\u0433\u043E \u0437\u0430\u043A\u0430\u0437\u043E\u0432</p><p class="videl" data-v-272f3412>${ssrInterpolate($data.orders_count)}</p></div></div><div class="flex" data-v-272f3412><img class="auto" src="https://cdekpromo.ru/chto-daet-dogovor-cdek.jpg" alt="" data-v-272f3412><div class="order_all_info auto" data-v-272f3412><p data-v-272f3412>\u041E\u0431\u0449\u0430\u044F \u0441\u0443\u043C\u043C\u0430 \u0437\u0430\u043A\u0430\u0437\u043E\u0432</p><p class="videl" data-v-272f3412>${ssrInterpolate($data.orders_sum)} \u0440\u0443\u0431</p></div></div></div></article>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminComp/OrderArticle.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const OrderArticle = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-272f3412"]]);
const _sfc_main$2 = {
  data() {
    return {
      count_delivery: null
    };
  },
  async mounted() {
    let r = await searchCountDelivery("status=\u041D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435");
    this.count_delivery = r.data.count;
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = __nuxt_component_0$2;
  _push(`<article${ssrRenderAttrs(_attrs)} data-v-d09a18de><div class="order-not-active" data-v-d09a18de><p class="small" data-v-d09a18de>\u0412\u0441\u0435\u0433\u043E \u043D\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u0434\u043E\u0441\u0442\u0430\u0432\u043E\u043A: <span style="${ssrRenderStyle({ "color": "blue" })}" data-v-d09a18de>${ssrInterpolate($data.count_delivery)}</span></p>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/admin/delivery?filter=status=\u041D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435",
    "no-prefetch": ""
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<button class="btn" data-v-d09a18de${_scopeId}>\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C</button>`);
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminComp/DeliveryNotActive.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const DeliveryNotActive = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-d09a18de"]]);
const _sfc_main$1 = {
  data() {
    return {
      count_orders: null
    };
  },
  async mounted() {
    let r = await searchCountOrders("status=\u041D\u0435 \u043E\u0434\u043E\u0431\u0440\u0435\u043D\u043D\u044B\u0439");
    this.count_orders = r.data.count;
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = __nuxt_component_0$2;
  _push(`<article${ssrRenderAttrs(_attrs)} data-v-0b455ff7><div class="order-not-active" data-v-0b455ff7><p class="small" data-v-0b455ff7>\u0412\u0441\u0435\u0433\u043E \u043D\u0435 \u043E\u0434\u043E\u0431\u0440\u0435\u043D\u043D\u044B\u0445 \u0437\u0430\u043A\u0430\u0437\u043E\u0432: <span style="${ssrRenderStyle({ "color": "blue" })}" data-v-0b455ff7>${ssrInterpolate($data.count_orders)}</span></p>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/admin/orders/?filter=status=\u041D\u0435 \u043E\u0434\u043E\u0431\u0440\u0435\u043D\u043D\u044B\u0439",
    "no-prefetch": ""
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<button class="btn" data-v-0b455ff7${_scopeId}>\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C</button>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminComp/OrdersMainInfo.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const OrdersMainInfo = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-0b455ff7"]]);
const _sfc_main = {
  components: { OrderArticle, DeliveryNotActive, OrdersMainInfo }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_order_article = resolveComponent("order-article");
  const _component_delivery_not_active = resolveComponent("delivery-not-active");
  const _component_orders_main_info = resolveComponent("orders-main-info");
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "grid" }, _attrs))} data-v-8458cbae>`);
  _push(ssrRenderComponent(_component_order_article, null, null, _parent));
  _push(ssrRenderComponent(_component_delivery_not_active, null, null, _parent));
  _push(ssrRenderComponent(_component_orders_main_info, null, null, _parent));
  _push(`<article data-v-8458cbae></article><article data-v-8458cbae></article><article data-v-8458cbae></article><article data-v-8458cbae></article></section>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-8458cbae"]]);

export { index as default };
//# sourceMappingURL=index-02f9dc6f.mjs.map
