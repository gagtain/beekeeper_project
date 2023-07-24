import { _ as _export_sfc, a as __nuxt_component_0$2 } from '../server.mjs';
import { s as searchDelivery } from './SearchDelivery-1eaa006e.mjs';
import { D as DeliveryInfo } from './DeliveryInfo-bad117ec.mjs';
import { O as OrderInfo } from './OrderInfo-39aa70cf.mjs';
import { resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
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
import 'axios';
import './main-cf4969ae.mjs';

const _sfc_main = {
  components: { DeliveryInfo, OrderInfo },
  data() {
    return {
      delivery_not_active: null
    };
  },
  async mounted() {
    let r = await searchDelivery("status=\u041D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435");
    this.delivery_not_active = r.data;
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_delivery_info = resolveComponent("delivery-info");
  const _component_order_info = resolveComponent("order-info");
  const _component_nuxt_link = __nuxt_component_0$2;
  if ($data.delivery_not_active) {
    _push(`<section${ssrRenderAttrs(mergeProps({ class: "grid" }, _attrs))} data-v-242da6d1><article data-v-242da6d1>*\u0412 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435*</article><!--[-->`);
    ssrRenderList($data.delivery_not_active, (delivery) => {
      _push(`<article style="${ssrRenderStyle({ "display": "block", "padding": "3%", "height": "auto" })}" data-v-242da6d1>`);
      _push(ssrRenderComponent(_component_delivery_info, { delivery }, null, _parent));
      _push(ssrRenderComponent(_component_order_info, {
        order: delivery.order_delivery_transaction[0]
      }, null, _parent));
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "/admin/delivery/" + delivery.id
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="btn" data-v-242da6d1${_scopeId}>\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435</button>`);
          } else {
            return [
              createVNode("button", { class: "btn" }, "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435")
            ];
          }
        }),
        _: 2
      }, _parent));
      _push(`</article>`);
    });
    _push(`<!--]--></section>`);
  } else {
    _push(`<!---->`);
  }
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/delivery/not-active.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const notActive = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-242da6d1"]]);

export { notActive as default };
//# sourceMappingURL=not-active-8c6a5e35.mjs.map
