import { resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from "vue";
import "hookable";
import { a as api_root, u as useCookie, _ as _export_sfc } from "../server.mjs";
import "devalue";
import "klona";
import axios from "axios";
import { L as LoadingComp } from "./LoadingComp-34c86e82.js";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrRenderComponent } from "vue/server-renderer";
import "ofetch";
import "#internal/nitro";
import "unctx";
import "@vue/devtools-api";
import "destr";
import "h3";
import "@unhead/ssr";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "ufo";
import "cookie-es";
import "ohash";
import "defu";
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
const account_css_vue_type_style_index_0_src_2c72354e_scoped_2c72354e_lang = "";
const orders_vue_vue_type_style_index_1_scoped_2c72354e_lang = "";
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
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-2c72354e><div class="wrapper flex" data-v-2c72354e><div class="user_card flex auto" data-v-2c72354e><div class="interactiv user_card_div auto" id="orders_main" data-v-2c72354e><div class="kor w-sto relative" data-v-2c72354e><p class="small-big VAG" data-v-2c72354e>Заказы</p><div class="w-sto h_sto" data-v-2c72354e>`);
  if (!$data.list_order[0].loading) {
    _push(`<div class="product_order_list" data-v-2c72354e><!--[-->`);
    ssrRenderList($data.list_order, (order) => {
      _push(`<div class="order m-2" data-v-2c72354e><p align="left" data-v-2c72354e>Заказ номер ${ssrInterpolate(order.id)}</p><div class="w-sto h_sto flex" data-v-2c72354e><div class="product_order m-2" data-v-2c72354e><!--[-->`);
      ssrRenderList(order.product_list_transaction, (orderItem) => {
        _push(`<div class="product_order_info" data-v-2c72354e><div class="img_order_product_div" data-v-2c72354e><img class="img_order_product"${ssrRenderAttr("src", _ctx.$api_root + orderItem.productItem.product.image)} alt="" data-v-2c72354e></div><div class="info_order_product_div" data-v-2c72354e><div class="name_order_product" data-v-2c72354e>${ssrInterpolate(orderItem.productItem.product.name)} [${ssrInterpolate(orderItem.productItem.weight.weight)} гр, ${ssrInterpolate(orderItem.productItem.type_packaging.name)}]</div><p data-v-2c72354e>${ssrInterpolate(orderItem.productItem.product.price)} ${ssrInterpolate(orderItem.productItem.product.price_currency)}</p><p data-v-2c72354e>${ssrInterpolate(orderItem.count)} шт</p></div></div>`);
      });
      _push(`<!--]--></div><div class="order_description" data-v-2c72354e><div class="flex w-sto m-2" data-v-2c72354e><div class="w-50" data-v-2c72354e><p data-v-2c72354e>Когда</p></div><div class="w-50" data-v-2c72354e><p data-v-2c72354e>Когда</p></div></div><div class="flex w-sto m-2" data-v-2c72354e><div class="w-50" data-v-2c72354e><p data-v-2c72354e>Способ оплаты</p></div><div class="w-50" data-v-2c72354e><p data-v-2c72354e>Онлайн ${ssrInterpolate(order.amount)}</p></div></div><div class="flex w-sto m-2" data-v-2c72354e><div class="w-50" data-v-2c72354e><p data-v-2c72354e>Покупатель</p></div><div class="w-50" data-v-2c72354e><p data-v-2c72354e>${ssrInterpolate(order.user.FIO)} ${ssrInterpolate(order.user.email)}</p></div></div><div class="flex w-sto m-2" data-v-2c72354e><div class="w-50" data-v-2c72354e><p data-v-2c72354e>Получатель</p></div><div class="w-50" data-v-2c72354e><p data-v-2c72354e>${ssrInterpolate(order.user.FIO)} ${ssrInterpolate(order.user.email)}</p></div></div><div class="flex w-sto m-2" data-v-2c72354e><div class="w-50" data-v-2c72354e><p data-v-2c72354e>Стоимости доставки</p></div><div class="w-50" data-v-2c72354e><p data-v-2c72354e>* в разработке *</p></div></div></div></div></div>`);
    });
    _push(`<!--]--></div>`);
  } else if ($data.list_order[0].no_order) {
    _push(`<div class="w-sto h_sto flex auto" data-v-2c72354e><div class="auto" data-v-2c72354e><p style="${ssrRenderStyle({ "font-size": "28px" })}" class="VAG" data-v-2c72354e>Список заказов пуст :(</p><div class="select_size" data-v-2c72354e>`);
    _push(ssrRenderComponent(_component_router_link, { to: "/basket" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}" data-v-2c72354e${_scopeId}> Перейти в корзину </button>`);
        } else {
          return [
            createVNode("button", { style: { "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" } }, " Перейти в корзину ")
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
export {
  orders as default
};
//# sourceMappingURL=orders-c3cddeba.js.map
