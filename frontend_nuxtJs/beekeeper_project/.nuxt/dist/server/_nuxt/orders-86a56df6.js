import { mergeProps, useSSRContext, resolveComponent, withCtx, createVNode, openBlock, createBlock } from "vue";
import "hookable";
import { a as api_root, u as useCookie, _ as _export_sfc } from "../server.mjs";
import "devalue";
import "klona";
import axios from "axios";
import { L as LoadingComp } from "./LoadingComp-34c86e82.js";
import { O as OrderProductList } from "./OrderProductList-ddab04e2.js";
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderList, ssrRenderAttr, ssrRenderComponent, ssrRenderStyle, ssrInterpolate } from "vue/server-renderer";
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
const checkbox_scss_vue_type_style_index_0_src_04b307c5_scoped_04b307c5_lang = "";
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
  _push(`<button onclick="window.dialog.close();" aria-label="close" class="x" data-v-04b307c5> ❌ </button></dialog>`);
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
const RatingChoise_vue_vue_type_style_index_0_scoped_250d4233_lang = "";
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
  }, _attrs))} data-v-250d4233><!--[-->`);
  ssrRenderList([5, 4, 3, 2, 1], (number) => {
    _push(`<span for="star-1"${ssrRenderAttr("title", "Оценка " + number)} data-v-250d4233></span>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tovar/RatingChoise.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const RatingChoise = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-250d4233"]]);
const account_css_vue_type_style_index_0_src_d9fe1114_scoped_d9fe1114_lang = "";
const orders_vue_vue_type_style_index_1_scoped_d9fe1114_lang = "";
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
        alert("Вы уже оставляли отзыв");
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
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-d9fe1114><div class="wrapper flex" data-v-d9fe1114>`);
  _push(ssrRenderComponent(_component_DialogWindow, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        if ($data.rating_list) {
          _push2(ssrRenderComponent(_component_OrderProductList, { orderList: $data.rating_list_obj }, {
            default: withCtx((slotProps, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-d9fe1114${_scopeId2}> Выбрать </button>`);
              } else {
                return [
                  createVNode("button", {
                    onClick: ($event) => $options.select_rating_product(slotProps.orderItem.productItem.product.id),
                    style: { "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" }
                  }, " Выбрать ", 8, ["onClick"])
                ];
              }
            }),
            _: 1
          }, _parent2, _scopeId));
        } else {
          _push2(`<div data-v-d9fe1114${_scopeId}><div class="flex" data-v-d9fe1114${_scopeId}>`);
          _push2(ssrRenderComponent(_component_RatingChoise, {
            product_id: $data.select_rating_product_id,
            onSubmit: ($event) => $options.RatingSubmit($event)
          }, null, _parent2, _scopeId));
          _push2(`</div><p class="VAG" align="center" data-v-d9fe1114${_scopeId}>Ваш отзыв</p></div>`);
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
              }, " Выбрать ", 8, ["onClick"])
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
            }, "Ваш отзыв")
          ]))
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<div class="user_card flex auto" data-v-d9fe1114><div class="interactiv user_card_div auto" id="orders_main" data-v-d9fe1114><div class="kor w-sto relative" data-v-d9fe1114><p class="small-big VAG" data-v-d9fe1114>Заказы</p><div class="w-sto h_sto" data-v-d9fe1114>`);
  if (!$data.list_order[0].loading) {
    _push(`<div class="product_order_list" data-v-d9fe1114><!--[-->`);
    ssrRenderList($data.list_order, (order) => {
      _push(`<div class="order m-2" data-v-d9fe1114><div class="flex w-sto jus-sp" data-v-d9fe1114><p align="left" data-v-d9fe1114>Заказ номер ${ssrInterpolate(order.id)}</p><div class="select_size" data-v-d9fe1114><button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-d9fe1114> Оставить отзыв </button></div></div><div class="w-sto h_sto flex jus-sp" data-v-d9fe1114><div class="product_order m-2" data-v-d9fe1114>`);
      _push(ssrRenderComponent(_component_order_product_list, {
        orderList: order.product_list_transaction
      }, null, _parent));
      _push(`</div><div class="order_description" data-v-d9fe1114><div class="flex w-sto m-2" data-v-d9fe1114><div class="w-50" data-v-d9fe1114><p data-v-d9fe1114>Когда</p></div><div class="w-50" data-v-d9fe1114><p data-v-d9fe1114>${ssrInterpolate($options.getDateFormat(new Date(order.datetime)))}</p></div></div><div class="flex w-sto m-2" data-v-d9fe1114><div class="w-50" data-v-d9fe1114><p data-v-d9fe1114>Куда</p></div><div class="w-50" data-v-d9fe1114><p data-v-d9fe1114>${ssrInterpolate(order.order_address)} ${ssrInterpolate(order.order_index)}</p></div></div><div class="flex w-sto m-2" data-v-d9fe1114><div class="w-50" data-v-d9fe1114><p data-v-d9fe1114>Способ оплаты</p></div><div class="w-50" data-v-d9fe1114><p data-v-d9fe1114>Онлайн ${ssrInterpolate(order.amount)}</p></div></div><div class="flex w-sto m-2" data-v-d9fe1114><div class="w-50" data-v-d9fe1114><p data-v-d9fe1114>Покупатель</p></div><div class="w-50" data-v-d9fe1114><p data-v-d9fe1114>${ssrInterpolate(order.user.FIO)} ${ssrInterpolate(order.user.email)}</p></div></div><div class="flex w-sto m-2" data-v-d9fe1114><div class="w-50" data-v-d9fe1114><p data-v-d9fe1114>Получатель</p></div><div class="w-50" data-v-d9fe1114><p data-v-d9fe1114>${ssrInterpolate(order.user.FIO)} ${ssrInterpolate(order.user.email)}</p></div></div><div class="flex w-sto m-2" data-v-d9fe1114><div class="w-50" data-v-d9fe1114><p data-v-d9fe1114>Стоимости доставки</p></div><div class="w-50" data-v-d9fe1114><p data-v-d9fe1114>* в разработке *</p></div></div></div></div></div>`);
    });
    _push(`<!--]--></div>`);
  } else if ($data.list_order[0].no_order) {
    _push(`<div class="w-sto h_sto flex auto" data-v-d9fe1114><div class="auto" data-v-d9fe1114><p style="${ssrRenderStyle({ "font-size": "28px" })}" class="VAG" data-v-d9fe1114>Список заказов пуст :(</p><div class="select_size" data-v-d9fe1114>`);
    _push(ssrRenderComponent(_component_router_link, { to: "/basket" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}" data-v-d9fe1114${_scopeId}> Перейти в корзину </button>`);
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
const orders = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-d9fe1114"]]);
export {
  orders as default
};
//# sourceMappingURL=orders-86a56df6.js.map
