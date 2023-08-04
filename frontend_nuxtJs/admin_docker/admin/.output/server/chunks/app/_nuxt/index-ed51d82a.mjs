import { _ as _export_sfc, a as __nuxt_component_0$2 } from '../server.mjs';
import axios from 'axios';
import { a as api_root } from './main-cf4969ae.mjs';
import { s as searchCountOrders } from './SearchCountOrders-e19df010.mjs';
import { O as OrderInfo } from './OrderInfo-39aa70cf.mjs';
import { resolveComponent, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrRenderComponent, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
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

async function searchOrders(params, from, size) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/orders/search/?${params}from=${from}&size=${size}`,
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
      order_list: null,
      page: 1,
      total: null,
      params: ""
    };
  },
  watch: {
    page() {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?page=${this.page}`
      );
      this.getPaginationOrder(this.params, this.page);
    }
  },
  async mounted() {
    let filter = "";
    let add_str = "";
    if (this.$route.query.filter) {
      filter = this.$route.query.filter;
      add_str = "&";
    }
    await this.getPaginationOrder(filter + add_str, this.page);
    let countDilivery = await searchCountOrders(filter);
    this.total = Math.ceil(countDilivery.data.count / 2);
  },
  methods: {
    async filter(param_filter) {
      this.page = 1;
      await this.getPaginationOrder(param_filter, this.page);
      let countOrder = await searchCountOrders(param_filter);
      this.total = Math.ceil(countOrder.data.count / 2);
    },
    async getPaginationOrder(params, number) {
      this.params = params;
      console.log(params);
      let ord = await searchOrders(params, number * 2 - 2, 2);
      this.order_list = ord.data;
      console.log(ord.data);
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_order_info = resolveComponent("order-info");
  const _component_nuxt_link = __nuxt_component_0$2;
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-e9bd03d2>`);
  if ($data.order_list) {
    _push(`<section class="grid" data-v-e9bd03d2><article style="${ssrRenderStyle({ "padding": "3%", "display": "flex", "height": "auto", "min-height": "300px" })}" data-v-e9bd03d2><div class="filter" data-v-e9bd03d2><p data-v-e9bd03d2>\u0424\u0438\u043B\u044C\u0440\u0430\u0446\u0438\u044F</p><div class="flex jus-sp" data-v-e9bd03d2><button class="btn min" data-v-e9bd03d2>\u041E\u0434\u043E\u0431\u0440\u0435\u043D</button><button class="btn min" data-v-e9bd03d2>\u041D\u0435 \u043E\u0434\u043E\u0431\u0440\u0435\u043D\u043D\u044B\u0439</button><button class="btn min" data-v-e9bd03d2>\u0417\u0430\u043A\u0440\u044B\u0442\u044B\u0439</button></div></div></article><!--[-->`);
    ssrRenderList($data.order_list, (order) => {
      _push(`<article style="${ssrRenderStyle({ "display": "block", "padding": "3%" })}" data-v-e9bd03d2>`);
      _push(ssrRenderComponent(_component_order_info, { order }, null, _parent));
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "/admin/orders/" + order.id
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="btn" data-v-e9bd03d2${_scopeId}><span data-v-e9bd03d2${_scopeId}>\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435</span></button>`);
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
  if ($data.total > 1) {
    _push(`<div class="paginator" data-v-e9bd03d2>`);
    if ($data.page > 1) {
      _push(`<button class="button" data-v-e9bd03d2>\u041D\u0430\u0437\u0430\u0434</button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<button class="${ssrRenderClass([{ active: $data.page == 1 }, "button"])}" data-v-e9bd03d2>${ssrInterpolate(1)}</button><!--[-->`);
    ssrRenderList($data.total - 1, (t) => {
      _push(`<!--[-->`);
      if (t <= $data.page + 2 && t >= $data.page - 2 && t != 1) {
        _push(`<button class="${ssrRenderClass([{ active: $data.page == t }, "button"])}" data-v-e9bd03d2>${ssrInterpolate(t)}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    });
    _push(`<!--]--><button class="${ssrRenderClass([{ active: $data.page == $data.total }, "button"])}" data-v-e9bd03d2>${ssrInterpolate($data.total)}</button>`);
    if ($data.page !== $data.total) {
      _push(`<button class="button" data-v-e9bd03d2>\u0412\u043F\u0435\u0440\u0435\u0434</button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/orders/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-e9bd03d2"]]);

export { index as default };
//# sourceMappingURL=index-ed51d82a.mjs.map
