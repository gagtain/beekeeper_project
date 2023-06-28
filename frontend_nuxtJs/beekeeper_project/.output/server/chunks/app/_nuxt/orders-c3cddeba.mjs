import { resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { _ as _export_sfc, a as api_root, u as useCookie } from '../server.mjs';
import axios from 'axios';
import { L as LoadingComp } from './LoadingComp-34c86e82.mjs';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
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

async function getListOrder() {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/order/list`,
      method: "get",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main = {
  components: { LoadingComp },
  el: "orders_main",
  name: "BasketBase",
  data() {
    return {
      list_order: [
        { loading: true, no_order: false },
        // свойство для проверки загрузки 
        {
          id: null,
          amount: null,
          user: {
            FIO: null,
            email: null
          },
          product_list_transaction: [{
            id: null,
            productItem: {
              id: null,
              product: {
                name: null,
                description: null,
                image: null,
                price_currency: null,
                price: null
              },
              weight: {
                id: null,
                weight: null
              },
              type_packaging: {
                id: null,
                name: null
              }
            },
            count: null
          }],
          datetime: null
        }
      ]
    };
  },
  async mounted() {
    let response_list_order = await getListOrder();
    if (response_list_order.status != 404) {
      this.list_order = response_list_order.data;
    } else {
      this.list_order[0].no_order = true;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  const _component_LoadingComp = resolveComponent("LoadingComp");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-2c72354e><div class="wrapper flex" data-v-2c72354e><div class="user_card flex auto" data-v-2c72354e><div class="interactiv user_card_div auto" id="orders_main" data-v-2c72354e><div class="kor w-sto relative" data-v-2c72354e><p class="small-big VAG" data-v-2c72354e>\u0417\u0430\u043A\u0430\u0437\u044B</p><div class="w-sto h_sto" data-v-2c72354e>`);
  if (!$data.list_order[0].loading) {
    _push(`<div class="product_order_list" data-v-2c72354e><!--[-->`);
    ssrRenderList($data.list_order, (order) => {
      _push(`<div class="order m-2" data-v-2c72354e><p align="left" data-v-2c72354e>\u0417\u0430\u043A\u0430\u0437 \u043D\u043E\u043C\u0435\u0440 ${ssrInterpolate(order.id)}</p><div class="w-sto h_sto flex" data-v-2c72354e><div class="product_order m-2" data-v-2c72354e><!--[-->`);
      ssrRenderList(order.product_list_transaction, (orderItem) => {
        _push(`<div class="product_order_info" data-v-2c72354e><div class="img_order_product_div" data-v-2c72354e><img class="img_order_product"${ssrRenderAttr("src", _ctx.$api_root + orderItem.productItem.product.image)} alt="" data-v-2c72354e></div><div class="info_order_product_div" data-v-2c72354e><div class="name_order_product" data-v-2c72354e>${ssrInterpolate(orderItem.productItem.product.name)} [${ssrInterpolate(orderItem.productItem.weight.weight)} \u0433\u0440, ${ssrInterpolate(orderItem.productItem.type_packaging.name)}]</div><p data-v-2c72354e>${ssrInterpolate(orderItem.productItem.product.price)} ${ssrInterpolate(orderItem.productItem.product.price_currency)}</p><p data-v-2c72354e>${ssrInterpolate(orderItem.count)} \u0448\u0442</p></div></div>`);
      });
      _push(`<!--]--></div><div class="order_description" data-v-2c72354e><div class="flex w-sto m-2" data-v-2c72354e><div class="w-50" data-v-2c72354e><p data-v-2c72354e>\u041A\u043E\u0433\u0434\u0430</p></div><div class="w-50" data-v-2c72354e><p data-v-2c72354e>\u041A\u043E\u0433\u0434\u0430</p></div></div><div class="flex w-sto m-2" data-v-2c72354e><div class="w-50" data-v-2c72354e><p data-v-2c72354e>\u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B</p></div><div class="w-50" data-v-2c72354e><p data-v-2c72354e>\u041E\u043D\u043B\u0430\u0439\u043D ${ssrInterpolate(order.amount)}</p></div></div><div class="flex w-sto m-2" data-v-2c72354e><div class="w-50" data-v-2c72354e><p data-v-2c72354e>\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C</p></div><div class="w-50" data-v-2c72354e><p data-v-2c72354e>${ssrInterpolate(order.user.FIO)} ${ssrInterpolate(order.user.email)}</p></div></div><div class="flex w-sto m-2" data-v-2c72354e><div class="w-50" data-v-2c72354e><p data-v-2c72354e>\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044C</p></div><div class="w-50" data-v-2c72354e><p data-v-2c72354e>${ssrInterpolate(order.user.FIO)} ${ssrInterpolate(order.user.email)}</p></div></div><div class="flex w-sto m-2" data-v-2c72354e><div class="w-50" data-v-2c72354e><p data-v-2c72354e>\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</p></div><div class="w-50" data-v-2c72354e><p data-v-2c72354e>* \u0432 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435 *</p></div></div></div></div></div>`);
    });
    _push(`<!--]--></div>`);
  } else if ($data.list_order[0].no_order) {
    _push(`<div class="w-sto h_sto flex auto" data-v-2c72354e><div class="auto" data-v-2c72354e><p style="${ssrRenderStyle({ "font-size": "28px" })}" class="VAG" data-v-2c72354e>\u0421\u043F\u0438\u0441\u043E\u043A \u0437\u0430\u043A\u0430\u0437\u043E\u0432 \u043F\u0443\u0441\u0442 :(</p><div class="select_size" data-v-2c72354e>`);
    _push(ssrRenderComponent(_component_router_link, { to: "/basket" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}" data-v-2c72354e${_scopeId}> \u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443 </button>`);
        } else {
          return [
            createVNode("button", { style: { "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" } }, " \u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443 ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div></div></div>`);
  } else {
    _push(ssrRenderComponent(_component_LoadingComp, null, null, _parent));
  }
  _push(`</div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/orders.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const orders = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-2c72354e"]]);

export { orders as default };
//# sourceMappingURL=orders-c3cddeba.mjs.map
