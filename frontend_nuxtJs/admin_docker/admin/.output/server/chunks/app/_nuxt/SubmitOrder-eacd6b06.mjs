import { mergeProps, useSSRContext, resolveComponent } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderSlot, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc } from '../server.mjs';
import axios from 'axios';
import { a as api_root } from './main-cf4969ae.mjs';

const _sfc_main$3 = {
  el: "#orderProductList",
  setup() {
  },
  props: ["orderList"]
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "orderProductList" }, _attrs))} data-v-5f0a009e><!--[-->`);
  ssrRenderList($props.orderList, (orderItem, index) => {
    _push(`<div class="product_order_info" data-v-5f0a009e><div class="w-sto flex jus-sp" data-v-5f0a009e><p data-v-5f0a009e>${ssrInterpolate(index + 1)}</p> <p data-v-5f0a009e>${ssrInterpolate(orderItem.productItem.product.price * orderItem.count)} ${ssrInterpolate(orderItem.productItem.product.price_currency)}</p></div><div class="flex" data-v-5f0a009e><div class="img_order_product_div" data-v-5f0a009e><img class="img_order_product"${ssrRenderAttr("src", _ctx.$api_root + orderItem.productItem.product.image)} alt="" data-v-5f0a009e></div><div class="info_order_product_div" data-v-5f0a009e><div class="name_order_product" data-v-5f0a009e>${ssrInterpolate(orderItem.productItem.product.name)} [${ssrInterpolate(orderItem.productItem.weight.weight)} \u0433\u0440]</div><p data-v-5f0a009e>${ssrInterpolate(orderItem.productItem.product.price)} ${ssrInterpolate(orderItem.productItem.product.price_currency)}</p><p data-v-5f0a009e>${ssrInterpolate(orderItem.count)} \u0448\u0442</p></div></div>`);
    ssrRenderSlot(_ctx.$slots, "default", { orderItem }, null, _push, _parent);
    _push(`</div>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminComp/OderItemList.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const OrderItemList = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-5f0a009e"]]);
async function deliveryAddTrackNumber(id, data) {
  console.log(data);
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/delivery/${id}/track_number`,
      method: "post",
      headers: {
        //     "Authorization": `Bearer ${useCookie('assess').value}`
      },
      data
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main$2 = {
  props: ["delivery"],
  methods: {
    async submit() {
      let data = new FormData(document.getElementById("DeliveryInfoSubmitFrom"));
      let r = await deliveryAddTrackNumber(this.delivery.id, data);
      console.log(this.delivery);
      this.$emit("delivery_info_submit", r.data);
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<form${ssrRenderAttrs(mergeProps({
    id: "DeliveryInfoSubmitFrom",
    action: "",
    method: "get"
  }, _attrs))} data-v-c0ccb281><input type="text" name="track_number" value="" placeholder="\u0422\u0440\u0435\u043A \u043D\u043E\u043C\u0435\u0440" data-v-c0ccb281><button style="${ssrRenderStyle({ "margin-top": "2%" })}" class="btn" data-v-c0ccb281>\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</button></form>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminComp/DeliveryInfoSubmit.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const DeliveryInfoSubmit = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-c0ccb281"]]);
async function searchCountOrders$1(id, description) {
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
const _sfc_main$1 = {
  props: ["order"],
  data() {
    return {
      closed_order_s: false,
      cause: ""
    };
  },
  methods: {
    async submit() {
    },
    async closed_order() {
      if (this.closed_order_s) {
        let r = await searchCountOrders$1(this.order.id, this.cause);
        this.$emit("order_status_closed", r.data);
      } else {
        this.closed_order_s = true;
      }
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<form${ssrRenderAttrs(mergeProps({
    id: "DeliveryInfoSubmitFrom",
    action: "",
    method: "get"
  }, _attrs))} data-v-31a9d5b2>`);
  if ($data.closed_order_s) {
    _push(`<input type="text" name="track_number"${ssrRenderAttr("value", $data.cause)} placeholder="\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u043E\u0442\u043A\u0430\u0437\u0430" data-v-31a9d5b2>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<button style="${ssrRenderStyle({ "margin-top": "2%" })}" data-v-31a9d5b2>\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437</button></form>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminComp/OrderStatusClosed.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const OrderStatusClosed = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-31a9d5b2"]]);
const _sfc_main = {
  components: { DeliveryInfoSubmit, OrderStatusClosed },
  props: ["order", "delivery"],
  methods: {
    async submit_waiting() {
      this.$emit("submit_waiting");
    },
    delivery_info_submit(data) {
      this.$emit("delivery_info_submit", data);
    },
    async submit_order() {
      this.$emit("submit_order");
    },
    order_status_closed(event) {
      console.log(event);
      this.delivery.order_delivery_transaction[0] = event;
      this.delivery.status = "\u041E\u0442\u043C\u0435\u043D\u0435\u043D";
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_delivery_info_submit = resolveComponent("delivery-info-submit");
  const _component_order_status_closed = resolveComponent("order-status-closed");
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-a2f3b552>`);
  if ($props.delivery.status == "\u041D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435" && $props.order.status == "\u041E\u0434\u043E\u0431\u0440\u0435\u043D") {
    _push(`<button class="btn" data-v-a2f3b552> \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0443 </button>`);
  } else {
    _push(`<!---->`);
  }
  if ($props.order.status == "\u041D\u0435 \u043E\u0434\u043E\u0431\u0440\u0435\u043D\u043D\u044B\u0439") {
    _push(`<button class="btn" data-v-a2f3b552> \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437 </button>`);
  } else if ($props.delivery.status == "\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438") {
    _push(ssrRenderComponent(_component_delivery_info_submit, {
      onDelivery_info_submit: ($event) => $options.delivery_info_submit($event),
      delivery: $props.delivery,
      style: { "margin-top": "2%" }
    }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  if ($props.delivery.status == "\u041D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435" && $props.order.status != "\u041E\u0434\u043E\u0431\u0440\u0435\u043D") {
    _push(ssrRenderComponent(_component_order_status_closed, {
      style: { "margin-top": "3%" },
      onOrder_status_closed: $options.order_status_closed,
      order: $props.order
    }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  if ($props.delivery.status == "\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D") {
    _push(`<button class="btn" data-v-a2f3b552> \u041E\u0442\u0441\u043B\u0435\u0434\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437 </button>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminComp/OrderSettings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const OrderSettings = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-a2f3b552"]]);
async function searchCountOrders(id) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/orders/${id}/approved`,
      method: "post",
      headers: {
        //     "Authorization": `Bearer ${useCookie('assess').value}`
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

export { OrderItemList as O, OrderSettings as a, searchCountOrders as s };
//# sourceMappingURL=SubmitOrder-eacd6b06.mjs.map
