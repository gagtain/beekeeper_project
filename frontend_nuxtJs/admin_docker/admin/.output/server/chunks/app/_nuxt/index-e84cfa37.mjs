import { _ as _export_sfc, a as __nuxt_component_0$1 } from '../server.mjs';
import { s as searchDelivery } from './SearchDelivery-bb041ecd.mjs';
import { D as DeliveryInfo } from './main-2a14514f.mjs';
import { resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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

const _sfc_main = {
  components: { DeliveryInfo },
  data() {
    return {
      delivery_not_active: null
    };
  },
  async mounted() {
    let r = await searchDelivery("");
    this.delivery_not_active = r.data;
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_delivery_info = resolveComponent("delivery-info");
  const _component_nuxt_link = __nuxt_component_0$1;
  if ($data.delivery_not_active) {
    _push(`<section${ssrRenderAttrs(mergeProps({ class: "grid" }, _attrs))}><article style="${ssrRenderStyle({ "padding": "3%", "display": "flex", "height": "auto", "min-height": "300px" })}"><div class="filter"><p>\u0424\u0438\u043B\u044C\u0440\u0430\u0446\u0438\u044F</p><div class="flex jus-sp"><button class="btn min">\u041D\u0435 \u043E\u0434\u043E\u0431\u0440\u0435\u043D\u043D\u044B\u0435</button><button class="btn min">\u041D\u0435 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u043D\u044B\u0435</button><button class="btn min">\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u043D\u044B\u0435</button><button class="btn min">\u041F\u0440\u0438\u043D\u044F\u0442\u044B\u0435</button></div></div></article><!--[-->`);
    ssrRenderList($data.delivery_not_active, (delivery) => {
      _push(`<article style="${ssrRenderStyle({ "display": "block", "padding": "3%" })}">`);
      _push(ssrRenderComponent(_component_delivery_info, { delivery }, null, _parent));
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "/admin/delivery/" + delivery.id
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="btn"${_scopeId}><span${_scopeId}>\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435</span></button>`);
          } else {
            return [
              createVNode("button", { class: "btn" }, [
                createVNode("span", null, "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435")
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/delivery/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-e84cfa37.mjs.map
