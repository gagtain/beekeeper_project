import axios from 'axios';
import { _ as _export_sfc, D as DialogWindow, u as useHead, b as api_root } from '../server.mjs';
import { useSSRContext, resolveComponent, mergeProps, withCtx, createVNode, openBlock, createBlock } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { L as LoadingComp } from './LoadingComp-34c86e82.mjs';
import { O as OrderProductList } from './OrderProductList-4295d0ed.mjs';
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
import 'ipx';

async function searchCountOrders(id, description) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/orders/${id}/closed`,
      method: "post",
      headers: {},
      withCredentials: true,
      data: {
        description
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main$2 = {
  props: ["order_id"],
  data() {
    return {
      description: "",
      status: false
    };
  },
  methods: {
    async submit_closed_order() {
      console.log(this.order_id);
      await searchCountOrders(this.order_id, this.description);
      this.status = true;
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  if (!$data.status) {
    _push(`<div${ssrRenderAttrs(_attrs)}><p class="normal-small VAG">\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u043F\u0440\u0438\u0447\u0438\u043D\u0443 \u0432\u0430\u0448\u0435\u0433\u043E \u043E\u0442\u043A\u0430\u0437\u0430</p><textarea style="${ssrRenderStyle({ "width": "100%" })}" rows="10">${ssrInterpolate($data.description)}</textarea><button style="${ssrRenderStyle({ "background": "rgb(255, 175, 70)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "5%" })}"> \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C </button></div>`);
  } else {
    _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-sto h_sto flex" }, _attrs))}><p class="normal-small VAG">\u0423\u0441\u043F\u0435\u0448\u043D\u043E</p></div>`);
  }
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Orders/OrdersCanceled.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
async function getListOrder() {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/order/list`,
      method: "get",
      headers: {},
      withCredentials: true
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
async function addRatingProduct(product_id, rating) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/product/${product_id}/rating/create`,
      method: "post",
      headers: {},
      withCredentials: true,
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
async function restartOrder(id) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/orders/${id}/restart`,
      method: "post",
      headers: {},
      withCredentials: true
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main = {
  components: { LoadingComp, OrderProductList, DialogWindow, RatingChoise, OrdersCanceled: __nuxt_component_0 },
  el: "orders_main",
  name: "BasketBase",
  data() {
    return {
      list_order: [null],
      select_order: null,
      select_rating_product_id: null,
      rating_list: true,
      rating_list_obj: null
    };
  },
  async mounted() {
    let response_list_order = await getListOrder();
    this.list_order = response_list_order.data;
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
      let a = document.getElementById("product_rating");
      a.showModal();
    },
    order_canceled(order_id) {
      this.select_order = order_id;
      let a = document.getElementById("order_canceled");
      a.showModal();
    },
    async order_restart(id) {
      await restartOrder(id);
      this.$router.push("/basket");
    },
    order_redirect_payments(url) {
      window.location.href = url;
    }
  },
  setup() {
    useHead({
      title: "\u041F\u0447\u0435\u043B\u0438\u043D\u0430\u044F \u0430\u0440\u0442\u0435\u043B\u044C - \u0417\u0430\u043A\u0430\u0437\u044B",
      meta: [
        { name: "description", content: "My amazing site." }
      ]
    });
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_DialogWindow = resolveComponent("DialogWindow");
  const _component_OrderProductList = resolveComponent("OrderProductList");
  const _component_RatingChoise = resolveComponent("RatingChoise");
  const _component_OrdersCanceled = __nuxt_component_0;
  const _component_order_product_list = resolveComponent("order-product-list");
  const _component_router_link = resolveComponent("router-link");
  const _component_LoadingComp = resolveComponent("LoadingComp");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-c2d092f2><div class="wrapper flex" data-v-c2d092f2>`);
  _push(ssrRenderComponent(_component_DialogWindow, { id: "product_rating" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        if ($data.rating_list) {
          _push2(ssrRenderComponent(_component_OrderProductList, { orderList: $data.rating_list_obj }, {
            default: withCtx((slotProps, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-c2d092f2${_scopeId2}> \u0412\u044B\u0431\u0440\u0430\u0442\u044C </button>`);
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
          _push2(`<div data-v-c2d092f2${_scopeId}><div class="flex" data-v-c2d092f2${_scopeId}>`);
          _push2(ssrRenderComponent(_component_RatingChoise, {
            product_id: $data.select_rating_product_id,
            onSubmit: ($event) => $options.RatingSubmit($event)
          }, null, _parent2, _scopeId));
          _push2(`</div><p class="VAG" align="center" data-v-c2d092f2${_scopeId}>\u0412\u0430\u0448 \u043E\u0442\u0437\u044B\u0432</p></div>`);
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
  _push(ssrRenderComponent(_component_DialogWindow, {
    id: "order_canceled",
    style: { "width": "fit-content", "max-width": "none" }
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_OrdersCanceled, { order_id: $data.select_order }, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_OrdersCanceled, { order_id: $data.select_order }, null, 8, ["order_id"])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<div class="user_card flex auto" data-v-c2d092f2><div class="interactiv user_card_div auto" id="orders_main" data-v-c2d092f2><div class="kor w-sto relative" data-v-c2d092f2><p class="small-big VAG" data-v-c2d092f2>\u0417\u0430\u043A\u0430\u0437\u044B</p><div class="w-sto h_sto" data-v-c2d092f2>`);
  if ($data.list_order[0]) {
    _push(`<div class="product_order_list" data-v-c2d092f2><!--[-->`);
    ssrRenderList($data.list_order, (order) => {
      var _a, _b, _c, _d, _e, _f;
      _push(`<div${ssrRenderAttr("id", `order_${order.id}`)} class="order m-2" data-v-c2d092f2><div class="${ssrRenderClass(order.status == "\u0417\u0430\u043A\u0440\u044B\u0442\u044B\u0439" ? "not-active" : "")}" data-v-c2d092f2><div class="flex w-sto jus-sp" data-v-c2d092f2><p align="left" data-v-c2d092f2>\u0417\u0430\u043A\u0430\u0437 \u043D\u043E\u043C\u0435\u0440 ${ssrInterpolate(order.id)}</p><div class="select_size" data-v-c2d092f2><button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-c2d092f2> \u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u043E\u0442\u0437\u044B\u0432 </button></div></div><div class="order_warp w-sto h_sto flex jus-sp" data-v-c2d092f2><div class="product_order m-2" data-v-c2d092f2>`);
      _push(ssrRenderComponent(_component_order_product_list, {
        orderList: order.product_list_transaction
      }, null, _parent));
      _push(`</div><div class="order_description" data-v-c2d092f2><div class="flex w-sto m-2" data-v-c2d092f2><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>\u041A\u043E\u0433\u0434\u0430</p></div><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>${ssrInterpolate($options.getDateFormat(new Date(order.datetime)))}</p></div></div><div class="flex w-sto m-2" data-v-c2d092f2><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>\u041A\u0443\u0434\u0430</p></div><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>${ssrInterpolate(order.order_address)} ${ssrInterpolate(order.order_index)}</p></div></div><div class="flex w-sto m-2" data-v-c2d092f2><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>\u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B</p></div><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>${ssrInterpolate((_a = order == null ? void 0 : order.payment) == null ? void 0 : _a.type)} ${ssrInterpolate(order.amount)}</p></div></div><div class="flex w-sto m-2" data-v-c2d092f2><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C</p></div><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>${ssrInterpolate(order.user.FIO)} ${ssrInterpolate(order.user.email)}</p></div></div><div class="flex w-sto m-2" data-v-c2d092f2><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044C</p></div><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>${ssrInterpolate(order.user.FIO)} ${ssrInterpolate(order.user.email)}</p></div></div><div class="flex w-sto m-2" data-v-c2d092f2><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</p></div><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>${ssrInterpolate((_b = order == null ? void 0 : order.delivery) == null ? void 0 : _b.price)}</p></div></div>`);
      if (order.delivery != null) {
        _push(`<div class="flex w-sto m-2" data-v-c2d092f2><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>\u0421\u0442\u0430\u0442\u0443\u0441 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</p></div><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>${ssrInterpolate(order.delivery.status)}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex w-sto m-2" data-v-c2d092f2><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>\u0421\u0442\u0430\u0442\u0443\u0441 \u043E\u043F\u043B\u0430\u0442\u044B</p></div><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>${ssrInterpolate((_c = order == null ? void 0 : order.payment) == null ? void 0 : _c.status)}</p></div></div><div class="flex w-sto m-2" data-v-c2d092f2><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>\u0421\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u043A\u0430\u0437\u0430</p></div><div class="w-50" data-v-c2d092f2><p data-v-c2d092f2>${ssrInterpolate(order.status)}</p></div></div></div></div><div class="order_menu m-2" data-v-c2d092f2>`);
      if ((((_d = order == null ? void 0 : order.payment) == null ? void 0 : _d.status) == "pending" || ((_e = order == null ? void 0 : order.payment) == null ? void 0 : _e.status) == void 0) && ((_f = order == null ? void 0 : order.payment) == null ? void 0 : _f.type) != "\u041B\u0438\u0447\u043D\u0430\u044F \u043E\u043F\u043B\u0430\u0442\u0430" && order.status != "\u0417\u0430\u043A\u0440\u044B\u0442\u044B\u0439") {
        _push(`<div data-v-c2d092f2><p data-v-c2d092f2>\u0417\u0430\u043A\u0430\u0437 \u0431\u0443\u0434\u0435\u0442 \u043E\u0442\u043C\u0435\u043D\u0435\u043D \u0447\u0435\u0440\u0435\u0437 30 \u043C\u0438\u043D\u0443\u0442, \u0432 \u0441\u043B\u0443\u0447\u0430\u0435 \u0435\u0441\u043B\u0438 \u043E\u043D \u043D\u0435 \u0431\u0443\u0434\u0435\u0442 \u043E\u043F\u043B\u0430\u0447\u0435\u043D</p><button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-c2d092f2> \u041E\u043F\u043B\u0430\u0442\u0438\u0442\u044C </button><button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-c2d092f2> \u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (order.status == "\u0417\u0430\u043A\u0440\u044B\u0442\u044B\u0439") {
        _push(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-c2d092f2> \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437 </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    });
    _push(`<!--]--></div>`);
  } else if ($data.list_order.length == 0) {
    _push(`<div class="w-sto h_sto flex auto" data-v-c2d092f2><div class="auto" data-v-c2d092f2><p style="${ssrRenderStyle({ "font-size": "28px" })}" class="VAG" data-v-c2d092f2>\u0421\u043F\u0438\u0441\u043E\u043A \u0437\u0430\u043A\u0430\u0437\u043E\u0432 \u043F\u0443\u0441\u0442 :(</p><div class="select_size" data-v-c2d092f2>`);
    _push(ssrRenderComponent(_component_router_link, { to: "/basket" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}" data-v-c2d092f2${_scopeId}> \u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443 </button>`);
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
const orders = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-c2d092f2"]]);

export { orders as default };
//# sourceMappingURL=orders-3783bd52.mjs.map
