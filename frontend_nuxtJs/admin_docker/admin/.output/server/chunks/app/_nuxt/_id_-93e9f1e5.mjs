import { D as DeliveryInfo, a as api_root } from './main-2a14514f.mjs';
import axios from 'axios';
import { useSSRContext, resolveComponent, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from '../server.mjs';
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

async function getDelivery(id) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/delivery/${id}`,
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
async function deliverySubmitWaiting(id) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/delivery/${id}/submit/waiting`,
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
const _sfc_main$2 = {
  el: "#orderProductList",
  setup() {
  },
  props: ["orderList"]
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "orderProductList" }, _attrs))}><!--[-->`);
  ssrRenderList($props.orderList, (orderItem, index) => {
    _push(`<div class="product_order_info"><div class="w-sto flex jus-sp"><p>${ssrInterpolate(index + 1)}</p> <p>${ssrInterpolate(orderItem.productItem.product.price * orderItem.count)} ${ssrInterpolate(orderItem.productItem.product.price_currency)}</p></div><div class="flex"><div class="img_order_product_div"><img class="img_order_product"${ssrRenderAttr("src", _ctx.$api_root + orderItem.productItem.product.image)} alt=""></div><div class="info_order_product_div"><div class="name_order_product">${ssrInterpolate(orderItem.productItem.product.name)} [${ssrInterpolate(orderItem.productItem.weight.weight)} \u0433\u0440]</div><p>${ssrInterpolate(orderItem.productItem.product.price)} ${ssrInterpolate(orderItem.productItem.product.price_currency)}</p><p>${ssrInterpolate(orderItem.count)} \u0448\u0442</p></div></div>`);
    ssrRenderSlot(_ctx.$slots, "default", { orderItem }, null, _push, _parent);
    _push(`</div>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminComp/OderItemList.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const OrderItemList = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
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
const _sfc_main$1 = {
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
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<form${ssrRenderAttrs(mergeProps({
    id: "DeliveryInfoSubmitFrom",
    action: "",
    method: "get"
  }, _attrs))} data-v-5457b8c8><input type="text" name="track_number" value="" placeholder="\u0422\u0440\u0435\u043A \u043D\u043E\u043C\u0435\u0440" data-v-5457b8c8><button style="${ssrRenderStyle({ "margin-top": "2%" })}" class="btn" data-v-5457b8c8>\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</button></form>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminComp/DeliveryInfoSubmit.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const DeliveryInfoSubmit = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-5457b8c8"]]);
const _sfc_main = {
  components: { DeliveryInfo, OrderItemList, DeliveryInfoSubmit },
  data() {
    return {
      delivery: null
    };
  },
  async mounted() {
    let r = await getDelivery(this.$route.params.id);
    this.delivery = r.data;
    console.log(this.delivery);
  },
  methods: {
    async submit_waiting() {
      let r = await deliverySubmitWaiting(this.delivery.id);
      this.delivery = r.data;
    },
    delivery_info_submit(data) {
      this.delivery = data;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_delivery_info = resolveComponent("delivery-info");
  const _component_order_item_list = resolveComponent("order-item-list");
  const _component_delivery_info_submit = resolveComponent("delivery-info-submit");
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "grid" }, _attrs))}><article style="${ssrRenderStyle({ "height": "auto", "min-height": "300px" })}" class="flex">`);
  if ($data.delivery != null) {
    _push(`<div class="delivery_info auto">`);
    _push(ssrRenderComponent(_component_delivery_info, { delivery: $data.delivery }, null, _parent));
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</article>`);
  if ($data.delivery != null) {
    _push(`<div style="${ssrRenderStyle({ "grid-column": "1 / -1", "min-height": "300px", "justify-content": "space-between" })}" class="flex"><div style="${ssrRenderStyle({ "width": "46%", "padding": "3%", "background": "#fff" })}"><p align="center">\u0422\u043E\u0432\u0430\u0440\u044B \u0437\u0430\u043A\u0430\u0437\u0430</p>`);
    _push(ssrRenderComponent(_component_order_item_list, {
      orderList: $data.delivery.order_delivery_transaction[0].product_list_transaction
    }, null, _parent));
    _push(`</div><div style="${ssrRenderStyle({ "width": "46%", "padding": "3%", "background": "#fff" })}">`);
    if ($data.delivery.status == "\u041D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435") {
      _push(`<button class="btn">\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437</button>`);
    } else if ($data.delivery.status == "\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438") {
      _push(ssrRenderComponent(_component_delivery_info_submit, {
        onDelivery_info_submit: ($event) => $options.delivery_info_submit($event),
        delivery: $data.delivery,
        style: { "margin-top": "2%" }
      }, null, _parent));
    } else {
      _push(`<!---->`);
    }
    _push(`<button class="btn">\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437</button>`);
    if ($data.delivery.status == "\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D") {
      _push(`<button class="btn">\u041E\u0442\u0441\u043B\u0435\u0434\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437</button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</section>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/delivery/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _id_ as default };
//# sourceMappingURL=_id_-93e9f1e5.mjs.map
