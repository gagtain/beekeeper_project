import { D as DeliveryInfo } from './DeliveryInfo-bad117ec.mjs';
import axios from 'axios';
import { a as api_root } from './main-cf4969ae.mjs';
import { O as OrderItemList, a as OrderSettings, P as PaymentInfo, s as searchCountOrders } from './PaymentInfo-f13f3cf7.mjs';
import { O as OrderInfo } from './OrderInfo-39aa70cf.mjs';
import { resolveComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
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

async function getOrder(id) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/orders/${id}`,
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
const _sfc_main = {
  components: { DeliveryInfo, OrderItemList, OrderInfo, OrderSettings, PaymentInfo },
  data() {
    return {
      order: null
    };
  },
  async mounted() {
    let r = await getOrder(this.$route.params.id);
    this.order = r.data;
  },
  methods: {
    delivery_info_submit(data) {
      this.order.delivery = data;
    },
    async submit_order() {
      let r = await searchCountOrders(this.order.id);
      this.order = r.data;
    },
    async submit_waiting() {
      console.log(123);
      let r = await deliverySubmitWaiting(this.order.delivery.id);
      this.order.delivery = r.data;
    },
    order_status_closed(event) {
      this.order = event;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_delivery_info = resolveComponent("delivery-info");
  const _component_order_info = resolveComponent("order-info");
  const _component_payment_info = resolveComponent("payment-info");
  const _component_order_item_list = resolveComponent("order-item-list");
  const _component_order_settings = resolveComponent("order-settings");
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "grid" }, _attrs))} data-v-b6e3aafe><article style="${ssrRenderStyle({ "height": "auto", "min-height": "300px" })}" class="flex" data-v-b6e3aafe>`);
  if ($data.order != null) {
    _push(`<div style="${ssrRenderStyle({ "width": "40%" })}" class="delivery_info auto flex jus-sp" data-v-b6e3aafe>`);
    _push(ssrRenderComponent(_component_delivery_info, {
      delivery: $data.order.delivery
    }, null, _parent));
    _push(ssrRenderComponent(_component_order_info, { order: $data.order }, null, _parent));
    _push(ssrRenderComponent(_component_payment_info, {
      payment: $data.order.payment
    }, null, _parent));
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</article>`);
  if ($data.order != null) {
    _push(`<div style="${ssrRenderStyle({ "grid-column": "1 / -1", "min-height": "300px", "justify-content": "space-between" })}" class="flex" data-v-b6e3aafe><div style="${ssrRenderStyle({ "width": "46%", "padding": "3%", "background": "#fff" })}" data-v-b6e3aafe><p align="center" data-v-b6e3aafe>\u0422\u043E\u0432\u0430\u0440\u044B \u0437\u0430\u043A\u0430\u0437\u0430</p>`);
    _push(ssrRenderComponent(_component_order_item_list, {
      orderList: $data.order.product_list_transaction
    }, null, _parent));
    _push(`</div><div style="${ssrRenderStyle({ "width": "46%", "padding": "3%", "background": "#fff" })}" data-v-b6e3aafe>`);
    _push(ssrRenderComponent(_component_order_settings, {
      onDelivery_info_submit: $options.delivery_info_submit,
      onSubmit_order: $options.submit_order,
      onSubmit_waiting: $options.submit_waiting,
      onOrder_status_closed: $options.order_status_closed,
      delivery: $data.order.delivery,
      order: $data.order
    }, null, _parent));
    _push(`</div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</section>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/orders/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-b6e3aafe"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-d52d9ffe.mjs.map
