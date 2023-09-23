import { _ as _export_sfc, b as api_root, a as __nuxt_component_0$2 } from '../server.mjs';
import { s as searchCountDelivery } from './SearchCountDelivery-42eb8224.mjs';
import axios from 'axios';
import { D as DeliveryInfo } from './DeliveryInfo-bad117ec.mjs';
import { resolveComponent, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrRenderComponent, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
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

async function searchDelivery(params, from, size) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/delivery/search?${params}from=${from}&size=${size}`,
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
  components: { DeliveryInfo },
  data() {
    return {
      delivery_list: null,
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
      this.getPaginationDelivery(this.params, this.page);
    }
  },
  async mounted() {
    let default_filter = this.$route.query.filter;
    let add_str = "";
    if (!default_filter) {
      default_filter = "";
    } else {
      add_str = "&";
    }
    await this.getPaginationDelivery(default_filter + add_str, this.page);
    let countDilivery = await searchCountDelivery(default_filter);
    this.total = Math.ceil(countDilivery.data.count / 2);
  },
  methods: {
    async filter(param_filter) {
      this.page = 1;
      await this.getPaginationDelivery(param_filter, this.page);
      let countDilivery = await searchCountDelivery(param_filter);
      this.total = Math.ceil(countDilivery.data.count / 2);
    },
    async getPaginationDelivery(params, number) {
      this.params = params;
      let r = await searchDelivery(params, number * 2 - 2, 2);
      this.delivery_list = r.data;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_delivery_info = resolveComponent("delivery-info");
  const _component_nuxt_link = __nuxt_component_0$2;
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-dc87c814>`);
  if ($data.delivery_list) {
    _push(`<section class="grid" data-v-dc87c814><article style="${ssrRenderStyle({ "padding": "3%", "display": "flex", "height": "auto", "min-height": "300px" })}" data-v-dc87c814><div class="filter" data-v-dc87c814><p data-v-dc87c814>\u0424\u0438\u043B\u044C\u0440\u0430\u0446\u0438\u044F</p><div class="flex jus-sp" data-v-dc87c814><button class="btn min" data-v-dc87c814>\u041D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435</button><button class="btn min" data-v-dc87c814>\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</button><button class="btn min" data-v-dc87c814>\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D</button><button class="btn min" data-v-dc87c814>\u041E\u0436\u0438\u0434\u0430\u0435\u0442 \u0432 \u043F\u0443\u043D\u043A\u0442\u0435 \u0432\u044B\u0434\u0430\u0447\u0438</button><button class="btn min" data-v-dc87c814>\u041F\u0440\u0438\u043D\u044F\u0442</button><button class="btn min" data-v-dc87c814>\u041E\u0442\u043C\u0435\u043D\u0435\u043D</button></div></div></article><!--[-->`);
    ssrRenderList($data.delivery_list, (delivery) => {
      _push(`<article style="${ssrRenderStyle({ "display": "block", "padding": "3%" })}" data-v-dc87c814>`);
      _push(ssrRenderComponent(_component_delivery_info, { delivery }, null, _parent));
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "/admin/delivery/" + delivery.id
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="btn" data-v-dc87c814${_scopeId}><span data-v-dc87c814${_scopeId}>\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435</span></button>`);
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
    _push(`<div class="paginator" data-v-dc87c814>`);
    if ($data.page > 1) {
      _push(`<button class="button" data-v-dc87c814>\u041D\u0430\u0437\u0430\u0434</button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<button class="${ssrRenderClass([{ active: $data.page == 1 }, "button"])}" data-v-dc87c814>${ssrInterpolate(1)}</button><!--[-->`);
    ssrRenderList($data.total - 1, (t) => {
      _push(`<!--[-->`);
      if (t <= $data.page + 2 && t >= $data.page - 2 && t != 1) {
        _push(`<button class="${ssrRenderClass([{ active: $data.page == t }, "button"])}" data-v-dc87c814>${ssrInterpolate(t)}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    });
    _push(`<!--]--><button class="${ssrRenderClass([{ active: $data.page == $data.total }, "button"])}" data-v-dc87c814>${ssrInterpolate($data.total)}</button>`);
    if ($data.page !== $data.total) {
      _push(`<button class="button" data-v-dc87c814>\u0412\u043F\u0435\u0440\u0435\u0434</button>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/delivery/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-dc87c814"]]);

export { index as default };
//# sourceMappingURL=index-828ebf5b.mjs.map
