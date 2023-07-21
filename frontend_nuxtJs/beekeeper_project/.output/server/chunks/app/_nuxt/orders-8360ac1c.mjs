import { useSSRContext, resolveComponent, mergeProps, withCtx, createVNode, openBlock, createBlock } from 'vue';
import { _ as _export_sfc, a as api_root, u as useCookie } from '../server.mjs';
import axios from 'axios';
import { L as LoadingComp } from './LoadingComp-34c86e82.mjs';
import { O as OrderProductList } from './OrderProductList-da497256.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrInterpolate, ssrRenderSlot, ssrRenderAttr } from 'vue/server-renderer';
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
const _sfc_main$2 = {
  el: "#dialog"
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<dialog${ssrRenderAttrs(mergeProps({
    id: "dialog",
    class: "absolute auto",
    style: { "pointer-events": "auto" }
  }, _attrs))} data-v-04b307c5>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`<button onclick="window.dialog.close();" aria-label="close" class="x" data-v-04b307c5> \u274C </button></dialog>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/Dialog.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const DialogWindow = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-04b307c5"]]);
async function addRatingProduct(product_id, rating) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/product/${product_id}/rating/create`,
      method: "post",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      },
      data: {
        rating
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main$1 = {
  el: "#rating-area",
  props: ["product_id"],
  methods: {
    async submits(rating) {
      let response_rating_create = await addRatingProduct(this.product_id, rating);
      if (response_rating_create.status == 400) {
        this.$emit("submit", 400);
      } else {
        this.$emit("submit", 201);
      }
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: "rating-area",
    class: "rating-area w-sto"
  }, _attrs))} data-v-42d45eee><!--[-->`);
  ssrRenderList([5, 4, 3, 2, 1], (number) => {
    _push(`<span for="star-1"${ssrRenderAttr("title", "\u041E\u0446\u0435\u043D\u043A\u0430 " + number)} data-v-42d45eee></span>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tovar/RatingChoise.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const RatingChoise = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-42d45eee"]]);
const _sfc_main = {
  components: { LoadingComp, OrderProductList, DialogWindow, RatingChoise },
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
          datetime: null,
          order_address: null,
          order_index: null
        }
      ],
      rating_list: true,
      select_rating_product_id: null,
      rating_list_obj: []
    };
  },
  async mounted() {
    let response_list_order = await getListOrder();
    if (response_list_order.status != 404) {
      this.list_order = response_list_order.data;
    } else {
      this.list_order[0].no_order = true;
    }
  },
  methods: {
    select_rating_product(id) {
      this.select_rating_product_id = id, this.rating_list = false;
    },
    RatingSubmit(status) {
      console.log(status);
      if (status == 201) {
        this.rating_list = true;
      } else {
        this.rating_list = true;
        alert("\u0412\u044B \u0443\u0436\u0435 \u043E\u0441\u0442\u0430\u0432\u043B\u044F\u043B\u0438 \u043E\u0442\u0437\u044B\u0432");
      }
    },
    getDateFormat(date) {
      return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
    },
    ratingDialog(rating_list_obj) {
      this.rating_list_obj = rating_list_obj;
      window.dialog.showModal();
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_DialogWindow = resolveComponent("DialogWindow");
  const _component_OrderProductList = resolveComponent("OrderProductList");
  const _component_RatingChoise = resolveComponent("RatingChoise");
  const _component_order_product_list = resolveComponent("order-product-list");
  const _component_router_link = resolveComponent("router-link");
  const _component_LoadingComp = resolveComponent("LoadingComp");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-9e9f265f><div class="wrapper flex" data-v-9e9f265f>`);
  _push(ssrRenderComponent(_component_DialogWindow, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        if ($data.rating_list) {
          _push2(ssrRenderComponent(_component_OrderProductList, { orderList: $data.rating_list_obj }, {
            default: withCtx((slotProps, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-9e9f265f${_scopeId2}> \u0412\u044B\u0431\u0440\u0430\u0442\u044C </button>`);
              } else {
                return [
                  createVNode("button", {
                    onClick: ($event) => $options.select_rating_product(slotProps.orderItem.productItem.product.id),
                    style: { "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" }
                  }, " \u0412\u044B\u0431\u0440\u0430\u0442\u044C ", 8, ["onClick"])
                ];
              }
            }),
            _: 1
          }, _parent2, _scopeId));
        } else {
          _push2(`<div data-v-9e9f265f${_scopeId}><div class="flex" data-v-9e9f265f${_scopeId}>`);
          _push2(ssrRenderComponent(_component_RatingChoise, {
            product_id: $data.select_rating_product_id,
            onSubmit: ($event) => $options.RatingSubmit($event)
          }, null, _parent2, _scopeId));
          _push2(`</div><p class="VAG" align="center" data-v-9e9f265f${_scopeId}>\u0412\u0430\u0448 \u043E\u0442\u0437\u044B\u0432</p></div>`);
        }
      } else {
        return [
          $data.rating_list ? (openBlock(), createBlock(_component_OrderProductList, {
            key: 0,
            orderList: $data.rating_list_obj
          }, {
            default: withCtx((slotProps) => [
              createVNode("button", {
                onClick: ($event) => $options.select_rating_product(slotProps.orderItem.productItem.product.id),
                style: { "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" }
              }, " \u0412\u044B\u0431\u0440\u0430\u0442\u044C ", 8, ["onClick"])
            ]),
            _: 1
          }, 8, ["orderList"])) : (openBlock(), createBlock("div", { key: 1 }, [
            createVNode("div", { class: "flex" }, [
              createVNode(_component_RatingChoise, {
                product_id: $data.select_rating_product_id,
                onSubmit: ($event) => $options.RatingSubmit($event)
              }, null, 8, ["product_id", "onSubmit"])
            ]),
            createVNode("p", {
              class: "VAG",
              align: "center"
            }, "\u0412\u0430\u0448 \u043E\u0442\u0437\u044B\u0432")
          ]))
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<div class="user_card flex auto" data-v-9e9f265f><div class="interactiv user_card_div auto" id="orders_main" data-v-9e9f265f><div class="kor w-sto relative" data-v-9e9f265f><p class="small-big VAG" data-v-9e9f265f>\u0417\u0430\u043A\u0430\u0437\u044B</p><div class="w-sto h_sto" data-v-9e9f265f>`);
  if (!$data.list_order[0].loading) {
    _push(`<div class="product_order_list" data-v-9e9f265f><!--[-->`);
    ssrRenderList($data.list_order, (order) => {
      _push(`<div class="order m-2" data-v-9e9f265f><div class="flex w-sto jus-sp" data-v-9e9f265f><p align="left" data-v-9e9f265f>\u0417\u0430\u043A\u0430\u0437 \u043D\u043E\u043C\u0435\u0440 ${ssrInterpolate(order.id)}</p><div class="select_size" data-v-9e9f265f><button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-9e9f265f> \u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u043E\u0442\u0437\u044B\u0432 </button></div></div><div class="order_warp w-sto h_sto flex jus-sp" data-v-9e9f265f><div class="product_order m-2" data-v-9e9f265f>`);
      _push(ssrRenderComponent(_component_order_product_list, {
        orderList: order.product_list_transaction
      }, null, _parent));
      _push(`</div><div class="order_description" data-v-9e9f265f><div class="flex w-sto m-2" data-v-9e9f265f><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>\u041A\u043E\u0433\u0434\u0430</p></div><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>${ssrInterpolate($options.getDateFormat(new Date(order.datetime)))}</p></div></div><div class="flex w-sto m-2" data-v-9e9f265f><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>\u041A\u0443\u0434\u0430</p></div><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>${ssrInterpolate(order.order_address)} ${ssrInterpolate(order.order_index)}</p></div></div><div class="flex w-sto m-2" data-v-9e9f265f><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>\u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B</p></div><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>\u041E\u043D\u043B\u0430\u0439\u043D ${ssrInterpolate(order.amount)}</p></div></div><div class="flex w-sto m-2" data-v-9e9f265f><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C</p></div><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>${ssrInterpolate(order.user.FIO)} ${ssrInterpolate(order.user.email)}</p></div></div><div class="flex w-sto m-2" data-v-9e9f265f><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044C</p></div><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>${ssrInterpolate(order.user.FIO)} ${ssrInterpolate(order.user.email)}</p></div></div><div class="flex w-sto m-2" data-v-9e9f265f><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</p></div><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>* \u0432 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435 *</p></div></div>`);
      if (order.delivery != null) {
        _push(`<div class="flex w-sto m-2" data-v-9e9f265f><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>\u0421\u0442\u0430\u0442\u0443\u0441 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</p></div><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>${ssrInterpolate(order.delivery.status)}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex w-sto m-2" data-v-9e9f265f><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>\u0421\u0442\u0430\u0442\u0443\u0441 \u043E\u043F\u043B\u0430\u0442\u044B</p></div><div class="w-50" data-v-9e9f265f><p data-v-9e9f265f>${ssrInterpolate(order.payment.status)}</p></div></div></div></div><button onclick="alert(&#39;\u0412 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435&#39;)" style="${ssrRenderStyle({ "background": "yellow", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-9e9f265f> \u041E\u0442\u0441\u043B\u0435\u0434\u0438\u0442\u044C </button>`);
      if (order.delivery.status == "\u041D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435") {
        _push(`<button onclick="alert(&#39;\u0412 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435&#39;)" style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-9e9f265f> \u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    });
    _push(`<!--]--></div>`);
  } else if ($data.list_order[0].no_order) {
    _push(`<div class="w-sto h_sto flex auto" data-v-9e9f265f><div class="auto" data-v-9e9f265f><p style="${ssrRenderStyle({ "font-size": "28px" })}" class="VAG" data-v-9e9f265f>\u0421\u043F\u0438\u0441\u043E\u043A \u0437\u0430\u043A\u0430\u0437\u043E\u0432 \u043F\u0443\u0441\u0442 :(</p><div class="select_size" data-v-9e9f265f>`);
    _push(ssrRenderComponent(_component_router_link, { to: "/basket" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}" data-v-9e9f265f${_scopeId}> \u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443 </button>`);
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
const orders = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-9e9f265f"]]);

export { orders as default };
//# sourceMappingURL=orders-8360ac1c.mjs.map
