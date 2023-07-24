import { _ as _export_sfc, a as __nuxt_component_0$2 } from '../server.mjs';
import axios from 'axios';
import { a as api_root } from './main-cf4969ae.mjs';
import { O as OrderInfo } from './OrderInfo-39aa70cf.mjs';
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

async function searchOrders(params) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/orders/search/?${params}`,
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
const _sfc_main = {
  components: { OrderInfo },
  data() {
    return {
      order_list: null
    };
  },
  async mounted() {
    let filter = "";
    if (this.$route.query.status) {
      filter = `status=${this.$route.query.status}`;
    }
    let r = await searchOrders(filter);
    this.order_list = r.data;
  },
  methods: {
    async filter(param_filter) {
      let r = await searchOrders(param_filter);
      this.order_list = r.data;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_order_info = resolveComponent("order-info");
  const _component_nuxt_link = __nuxt_component_0$2;
  if ($data.order_list) {
    _push(`<section${ssrRenderAttrs(mergeProps({ class: "grid" }, _attrs))} data-v-69057b7b><article style="${ssrRenderStyle({ "padding": "3%", "display": "flex", "height": "auto", "min-height": "300px" })}" data-v-69057b7b><div class="filter" data-v-69057b7b><p data-v-69057b7b>\u0424\u0438\u043B\u044C\u0440\u0430\u0446\u0438\u044F</p><div class="flex jus-sp" data-v-69057b7b><button class="btn min" data-v-69057b7b>\u041E\u0434\u043E\u0431\u0440\u0435\u043D</button><button class="btn min" data-v-69057b7b>\u041D\u0435 \u043E\u0434\u043E\u0431\u0440\u0435\u043D\u043D\u044B\u0439</button><button class="btn min" data-v-69057b7b>\u0417\u0430\u043A\u0440\u044B\u0442\u044B\u0439</button></div></div></article><!--[-->`);
    ssrRenderList($data.order_list, (order) => {
      _push(`<article style="${ssrRenderStyle({ "display": "block", "padding": "3%" })}" data-v-69057b7b>`);
      _push(ssrRenderComponent(_component_order_info, { order }, null, _parent));
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "/admin/orders/" + order.id
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="btn" data-v-69057b7b${_scopeId}><span data-v-69057b7b${_scopeId}>\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435</span></button>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/orders/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-69057b7b"]]);

export { index as default };
//# sourceMappingURL=index-82cfb2f8.mjs.map
