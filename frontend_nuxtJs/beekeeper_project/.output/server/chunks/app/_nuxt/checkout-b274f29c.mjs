import { useSSRContext, mergeProps, resolveComponent, withCtx, createVNode, createTextVNode, defineComponent, ref, createElementBlock } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { B as BasketInfo, P as ProductListInfo } from './BasketInfo-c3e99e9d.mjs';
import axios from 'axios';
import { u as useHead, _ as _export_sfc, a as api_root } from '../server.mjs';
import { O as OrderProductList } from './OrderProductList-927f1cd7.mjs';
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

const __nuxt_component_0 = /* @__PURE__ */ defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  // eslint-disable-next-line vue/require-prop-types
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_, { slots, attrs }) {
    const mounted = ref(false);
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
async function createOrderPayment(payment_data) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/payments/create/`,
      method: "post",
      headers: {},
      withCredentials: true,
      data: {
        ...payment_data
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
async function addOrder(delivery_price) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/order/create`,
      method: "post",
      headers: {},
      withCredentials: true,
      data: {
        delivery_price
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
async function createDeliveryLait(data) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/delivery/create/lait`,
      method: "post",
      headers: {},
      withCredentials: true,
      data
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main$1 = {
  el: "#sub_order",
  props: ["items", "forms_validate", "delivery_info"],
  data() {
    return {
      order_create: null
    };
  },
  methods: {
    async submin_order() {
      await this.$emit("forms_validate_met");
      if (this.forms_validate.status) {
        let response_order = await addOrder(this.delivery_info.price);
        this.order_create = response_order.data;
        let created_delivery = await this.create_delivery_lait();
        if (created_delivery) {
          await this.create_payment();
        } else {
          alert("\u0421 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u043E\u0439 \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0430, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443");
        }
      } else {
        alert(this.forms_validate.message);
      }
    },
    async create_payment() {
      let response_payment = await createOrderPayment({
        "payment_service": "yookassa",
        "order_service": "online_shop",
        "order_id": this.order_create.id,
        "currency": "RUB"
      });
      document.location.href = response_payment.data.payment_url;
    },
    async create_delivery_lait() {
      let response_delivery = await createDeliveryLait({
        order_id: this.order_create.id,
        PVZ: this.delivery_info.id,
        price: this.delivery_info.price,
        user_number: this.forms_validate.number.default ? void 0 : this.forms_validate.number.number
      });
      if (response_delivery.status == 200) {
        return true;
      } else {
        return false;
      }
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_RouterLink = resolveComponent("RouterLink");
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: "sub_order",
    class: "w-sto"
  }, _attrs))} data-v-01f8de78>`);
  if ($props.items.length) {
    _push(ssrRenderComponent(_component_RouterLink, { to: "/checkout" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button class="w-sto" data-v-01f8de78${_scopeId}><div class="fon_btn" data-v-01f8de78${_scopeId}></div>\u041E\u043F\u043B\u0430\u0442\u0438\u0442\u044C \u043E\u043D\u043B\u0430\u0439\u043D</button>`);
        } else {
          return [
            createVNode("button", {
              onClick: $options.submin_order,
              class: "w-sto"
            }, [
              createVNode("div", { class: "fon_btn" }),
              createTextVNode("\u041E\u043F\u043B\u0430\u0442\u0438\u0442\u044C \u043E\u043D\u043B\u0430\u0439\u043D")
            ], 8, ["onClick"])
          ];
        }
      }),
      _: 1
    }, _parent));
  } else {
    _push(ssrRenderComponent(_component_RouterLink, { to: "/catalog" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button class="w-sto" data-v-01f8de78${_scopeId}><div class="fon_btn" data-v-01f8de78${_scopeId}></div> \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u043E\u0432\u0430\u0440</button>`);
        } else {
          return [
            createVNode("button", { class: "w-sto" }, [
              createVNode("div", { class: "fon_btn" }),
              createTextVNode(" \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u043E\u0432\u0430\u0440")
            ])
          ];
        }
      }),
      _: 1
    }, _parent));
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/Submit_order.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Submit_order = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-01f8de78"]]);
const __default__ = {
  el: "#checkout",
  components: {
    BasketInfo,
    Checkout,
    ProductListInfo,
    Submit_order,
    OrderProductList
  },
  setup() {
    useHead({
      title: "\u041F\u0447\u0435\u043B\u0438\u043D\u0430\u044F \u0430\u0440\u0442\u0435\u043B\u044C - \u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u043A\u0430\u0437\u0430"
    });
  },
  data() {
    return {
      forms_validate: false,
      delivery_info: {
        price: null
      }
    };
  },
  methods: {
    forms_validate_met() {
      this.forms_validate = this.$refs.checkout_form.order_info_select();
    },
    async delivery_price_select(delivery_info) {
      this.delivery_info = await delivery_info;
    }
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "checkout",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "\u041F\u0447\u0435\u043B\u0438\u043D\u0430\u044F \u0430\u0440\u0442\u0435\u043B\u044C - \u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u043A\u0430\u0437\u0430"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-014630bb><div class="wrapper flex" data-v-014630bb><div class="user_card flex auto" data-v-014630bb><div class="interactiv user_card_div auto" id="checkout" data-v-014630bb><div class="w-sto kor" id="kor" data-v-014630bb><p class="small-big VAG" data-v-014630bb>\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435</p><div class="w-sto flex kor_block jus-sp" data-v-014630bb><div class="w-sto-1000px checkout" data-v-014630bb>`);
      _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
      _push(`<p align="left" class="VAG small" data-v-014630bb>\u0422\u043E\u0432\u0430\u0440\u044B</p>`);
      _push(ssrRenderComponent(OrderProductList, {
        orderList: _ctx.$store.getUser.basket
      }, null, _parent));
      _push(`</div><div class="w-sto-1000px register_zakaz" data-v-014630bb>`);
      _push(ssrRenderComponent(Submit_order, {
        delivery_info: _ctx.delivery_info,
        onForms_validate_met: _ctx.forms_validate_met,
        items: _ctx.$store.getUser.basket,
        forms_validate: _ctx.forms_validate
      }, null, _parent));
      _push(ssrRenderComponent(ProductListInfo, {
        ordered: true,
        items: _ctx.$store.getUser.basket,
        delivery_price: _ctx.delivery_info.price
      }, null, _parent));
      _push(`</div></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/checkout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const checkout = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-014630bb"]]);

export { checkout as default };
//# sourceMappingURL=checkout-b274f29c.mjs.map
