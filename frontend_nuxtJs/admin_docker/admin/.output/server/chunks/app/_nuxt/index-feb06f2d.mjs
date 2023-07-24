import { _ as _export_sfc, a as __nuxt_component_0$2 } from '../server.mjs';
import { s as searchDelivery } from './SearchDelivery-1eaa006e.mjs';
import { D as DeliveryInfo } from './DeliveryInfo-bad117ec.mjs';
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
import './main-cf4969ae.mjs';

const _sfc_main = {
  components: { DeliveryInfo },
  data() {
    return {
      delivery_list: null
    };
  },
  async mounted() {
    let r = await searchDelivery("");
    this.delivery_list = r.data;
  },
  methods: {
    async filter(param_filter) {
      let r = await searchDelivery(param_filter);
      this.delivery_list = r.data;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_delivery_info = resolveComponent("delivery-info");
  const _component_nuxt_link = __nuxt_component_0$2;
  if ($data.delivery_list) {
    _push(`<section${ssrRenderAttrs(mergeProps({ class: "grid" }, _attrs))} data-v-3292bce1><article style="${ssrRenderStyle({ "padding": "3%", "display": "flex", "height": "auto", "min-height": "300px" })}" data-v-3292bce1><div class="filter" data-v-3292bce1><p data-v-3292bce1>\u0424\u0438\u043B\u044C\u0440\u0430\u0446\u0438\u044F</p><div class="flex jus-sp" data-v-3292bce1><button class="btn min" data-v-3292bce1>\u041D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435</button><button class="btn min" data-v-3292bce1>\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</button><button class="btn min" data-v-3292bce1>\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D</button><button class="btn min" data-v-3292bce1>\u041E\u0436\u0438\u0434\u0430\u0435\u0442 \u0432 \u043F\u0443\u043D\u043A\u0442\u0435 \u0432\u044B\u0434\u0430\u0447\u0438</button><button class="btn min" data-v-3292bce1>\u041F\u0440\u0438\u043D\u044F\u0442</button><button class="btn min" data-v-3292bce1>\u041E\u0442\u043C\u0435\u043D\u0435\u043D</button></div></div></article><!--[-->`);
    ssrRenderList($data.delivery_list, (delivery) => {
      _push(`<article style="${ssrRenderStyle({ "display": "block", "padding": "3%" })}" data-v-3292bce1>`);
      _push(ssrRenderComponent(_component_delivery_info, { delivery }, null, _parent));
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "/admin/delivery/" + delivery.id
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="btn" data-v-3292bce1${_scopeId}><span data-v-3292bce1${_scopeId}>\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435</span></button>`);
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
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-3292bce1"]]);

export { index as default };
//# sourceMappingURL=index-feb06f2d.mjs.map
