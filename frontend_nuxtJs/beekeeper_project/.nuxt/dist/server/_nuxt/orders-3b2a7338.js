import axios from "axios";
import { a as api_root, _ as _export_sfc, u as useCookie } from "../server.mjs";
import { mergeProps, useSSRContext, resolveComponent, withCtx, createVNode, openBlock, createBlock } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderSlot, ssrRenderList, ssrRenderAttr, ssrRenderComponent, ssrRenderClass } from "vue/server-renderer";
import "hookable";
import "devalue";
import "klona";
import { L as LoadingComp } from "./LoadingComp-34c86e82.js";
import { O as OrderProductList } from "./OrderProductList-304e79e9.js";
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
async function searchCountOrders(id, description) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/orders/${id}/closed`,
      method: "post",
      headers: {
        //     "Authorization": `Bearer ${useCookie('assess').value}`
      },
      data: {
        description
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main$3 = {
  props: ["order_id"],
  data() {
    return {
      description: "",
      status: false
    };
  },
  methods: {
    submit_closed_order() {
      searchCountOrders(this.order_id, this.description);
      this.status = true;
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  if (!$data.status) {
    _push(`<div${ssrRenderAttrs(_attrs)}><p class="normal-small VAG">Пожалуйста, напишите причину вашего отказа</p><textarea style="${ssrRenderStyle({ "width": "100%" })}" rows="10">${ssrInterpolate($data.description)}</textarea><button style="${ssrRenderStyle({ "background": "rgb(255, 175, 70)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "5%" })}"> Подтвердить </button></div>`);
  } else {
    _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-sto h_sto flex" }, _attrs))}><p class="normal-small VAG">Успешно</p></div>`);
  }
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Orders/OrdersCanceled.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]);
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
const checkbox_scss_vue_type_style_index_0_src_9b230665_scoped_9b230665_lang = "";
const _sfc_main$2 = {
  props: ["id"],
  data() {
    return { ids: null };
  },
  mounted() {
    if (!this.id) {
      this.ids = "dialog";
    } else {
      this.ids = this.id;
    }
  },
  methods: {
    closed() {
      let a = document.getElementById(this.ids);
      a.close();
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<dialog${ssrRenderAttrs(mergeProps({
    id: $data.ids,
    class: "absolute auto",
    style: { "pointer-events": "auto" }
  }, _attrs))} data-v-9b230665>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`<button aria-label="close" class="x" data-v-9b230665> ❌ </button></dialog>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/Dialog.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const DialogWindow = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-9b230665"]]);
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
const RatingChoise_vue_vue_type_style_index_0_scoped_42d45eee_lang = "";
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
    _push(`<span for="star-1"${ssrRenderAttr("title", "Оценка " + number)} data-v-42d45eee></span>`);
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
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const account_css_vue_type_style_index_0_src_6093dae3_scoped_6093dae3_lang = "";
const orders_vue_vue_type_style_index_1_scoped_6093dae3_lang = "";
const _sfc_main = {
  components: { LoadingComp, OrderProductList, DialogWindow, RatingChoise, OrdersCanceled: __nuxt_component_0 },
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
      rating_list_obj: [],
      select_order: null
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
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-6093dae3><div class="wrapper flex" data-v-6093dae3>`);
  _push(ssrRenderComponent(_component_DialogWindow, { id: "product_rating" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        if ($data.rating_list) {
          _push2(ssrRenderComponent(_component_OrderProductList, { orderList: $data.rating_list_obj }, {
            default: withCtx((slotProps, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-6093dae3${_scopeId2}> Выбрать </button>`);
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
          _push2(`<div data-v-6093dae3${_scopeId}><div class="flex" data-v-6093dae3${_scopeId}>`);
          _push2(ssrRenderComponent(_component_RatingChoise, {
            product_id: $data.select_rating_product_id,
            onSubmit: ($event) => $options.RatingSubmit($event)
          }, null, _parent2, _scopeId));
          _push2(`</div><p class="VAG" align="center" data-v-6093dae3${_scopeId}>Ваш отзыв</p></div>`);
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
  _push(`<div class="user_card flex auto" data-v-6093dae3><div class="interactiv user_card_div auto" id="orders_main" data-v-6093dae3><div class="kor w-sto relative" data-v-6093dae3><p class="small-big VAG" data-v-6093dae3>Заказы</p><div class="w-sto h_sto" data-v-6093dae3>`);
  if (!$data.list_order[0].loading) {
    _push(`<div class="product_order_list" data-v-6093dae3><!--[-->`);
    ssrRenderList($data.list_order, (order) => {
      _push(`<div class="order m-2" data-v-6093dae3><div class="${ssrRenderClass(order.status == "Закрытый" ? "not-active" : "")}" data-v-6093dae3><div class="flex w-sto jus-sp" data-v-6093dae3><p align="left" data-v-6093dae3>Заказ номер ${ssrInterpolate(order.id)}</p><div class="select_size" data-v-6093dae3><button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-6093dae3> Оставить отзыв </button></div></div><div class="order_warp w-sto h_sto flex jus-sp" data-v-6093dae3><div class="product_order m-2" data-v-6093dae3>`);
      _push(ssrRenderComponent(_component_order_product_list, {
        orderList: order.product_list_transaction
      }, null, _parent));
      _push(`</div><div class="order_description" data-v-6093dae3><div class="flex w-sto m-2" data-v-6093dae3><div class="w-50" data-v-6093dae3><p data-v-6093dae3>Когда</p></div><div class="w-50" data-v-6093dae3><p data-v-6093dae3>${ssrInterpolate($options.getDateFormat(new Date(order.datetime)))}</p></div></div><div class="flex w-sto m-2" data-v-6093dae3><div class="w-50" data-v-6093dae3><p data-v-6093dae3>Куда</p></div><div class="w-50" data-v-6093dae3><p data-v-6093dae3>${ssrInterpolate(order.order_address)} ${ssrInterpolate(order.order_index)}</p></div></div><div class="flex w-sto m-2" data-v-6093dae3><div class="w-50" data-v-6093dae3><p data-v-6093dae3>Способ оплаты</p></div><div class="w-50" data-v-6093dae3><p data-v-6093dae3>Онлайн ${ssrInterpolate(order.amount)}</p></div></div><div class="flex w-sto m-2" data-v-6093dae3><div class="w-50" data-v-6093dae3><p data-v-6093dae3>Покупатель</p></div><div class="w-50" data-v-6093dae3><p data-v-6093dae3>${ssrInterpolate(order.user.FIO)} ${ssrInterpolate(order.user.email)}</p></div></div><div class="flex w-sto m-2" data-v-6093dae3><div class="w-50" data-v-6093dae3><p data-v-6093dae3>Получатель</p></div><div class="w-50" data-v-6093dae3><p data-v-6093dae3>${ssrInterpolate(order.user.FIO)} ${ssrInterpolate(order.user.email)}</p></div></div><div class="flex w-sto m-2" data-v-6093dae3><div class="w-50" data-v-6093dae3><p data-v-6093dae3>Стоимости доставки</p></div><div class="w-50" data-v-6093dae3><p data-v-6093dae3>* в разработке *</p></div></div>`);
      if (order.delivery != null) {
        _push(`<div class="flex w-sto m-2" data-v-6093dae3><div class="w-50" data-v-6093dae3><p data-v-6093dae3>Статус доставки</p></div><div class="w-50" data-v-6093dae3><p data-v-6093dae3>${ssrInterpolate(order.delivery.status)}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex w-sto m-2" data-v-6093dae3><div class="w-50" data-v-6093dae3><p data-v-6093dae3>Статус оплаты</p></div><div class="w-50" data-v-6093dae3><p data-v-6093dae3>${ssrInterpolate(order.payment.status)}</p></div></div></div></div><div class="order_menu m-2" data-v-6093dae3>`);
      if (order.status == "Одобрен") {
        _push(`<button onclick="alert(&#39;В разработке&#39;)" style="${ssrRenderStyle({ "background": "yellow", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-6093dae3> Отследить </button>`);
      } else {
        _push(`<!---->`);
      }
      if (order.payment.status == "pending" && order.status != "Закрытый") {
        _push(`<div data-v-6093dae3><p data-v-6093dae3>Заказ будет отменен через 30 минут, в случае если он не будет оплачен</p><button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-6093dae3> Оплатить </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (order.status == "Закрытый") {
        _push(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}" data-v-6093dae3> Повторить заказ </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    });
    _push(`<!--]--></div>`);
  } else if ($data.list_order[0].no_order) {
    _push(`<div class="w-sto h_sto flex auto" data-v-6093dae3><div class="auto" data-v-6093dae3><p style="${ssrRenderStyle({ "font-size": "28px" })}" class="VAG" data-v-6093dae3>Список заказов пуст :(</p><div class="select_size" data-v-6093dae3>`);
    _push(ssrRenderComponent(_component_router_link, { to: "/basket" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}" data-v-6093dae3${_scopeId}> Перейти в корзину </button>`);
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
const orders = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-6093dae3"]]);
export {
  orders as default
};
//# sourceMappingURL=orders-3b2a7338.js.map