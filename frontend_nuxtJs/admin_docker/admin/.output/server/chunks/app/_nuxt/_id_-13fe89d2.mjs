import { D as DeliveryInfo } from './DeliveryInfo-bad117ec.mjs';
import axios from 'axios';
import { _ as _export_sfc, b as api_root } from '../server.mjs';
import { O as OrderItemList, a as OrderSettings, P as PaymentInfo, g as getInfoDelivery, s as searchCountOrders, i as initDeviverySdek } from './initDeliverySdek-5d1879fe.mjs';
import { O as OrderInfo } from './OrderInfo-39aa70cf.mjs';
import { resolveComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import 'ufo';
import 'cookie-es';
import 'destr';
import 'ohash';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
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
  components: {
    DeliveryInfo,
    OrderItemList,
    OrderInfo,
    OrderSettings,
    PaymentInfo
  },
  data() {
    return {
      order: null,
      dilevery_auto: false,
      dilevery_info: null,
      openContent: null
    };
  },
  async mounted() {
    let r = await getOrder(this.$route.params.id);
    this.order = r.data;
    let r1 = await getInfoDelivery(this.order.delivery.id);
    this.dilevery_info = r1.data;
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
    },
    showContent(p) {
      if (p.number == this.openContent) {
        this.openContent = null;
      } else {
        this.openContent = p.number;
      }
    },
    addpackages() {
      this.dilevery_info.packages.push({
        number: `\u0423\u043F\u0430\u043A\u043E\u0432\u043A\u0430 \u2116${this.dilevery_info.packages.length + 1}`,
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        items: [
          {
            name: "",
            ware_key: "5",
            payment: {
              value: 0
            },
            cost: 0,
            weight: 0,
            amount: 0
          }
        ]
      });
    },
    additem(packeg) {
      console.log(packeg);
      packeg.items.push({
        name: "",
        ware_key: "5",
        payment: {
          value: 0
        },
        cost: 0,
        weight: 0,
        amount: 0
      });
    },
    async deliveryInit() {
      let r = await initDeviverySdek(this.order.delivery.id, this.dilevery_info);
      if (r.status == 200) {
        alert("\u0417\u0430\u043F\u0440\u043E\u0441 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u0443\u0441\u043F\u0435\u0448\u043D\u043E");
        location.reload();
      }
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_delivery_info = resolveComponent("delivery-info");
  const _component_order_info = resolveComponent("order-info");
  const _component_payment_info = resolveComponent("payment-info");
  const _component_order_item_list = resolveComponent("order-item-list");
  const _component_order_settings = resolveComponent("order-settings");
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-ad6e3734><section class="grid" data-v-ad6e3734><article style="${ssrRenderStyle({ "height": "auto", "min-height": "300px" })}" class="flex" data-v-ad6e3734>`);
  if ($data.order != null) {
    _push(`<div style="${ssrRenderStyle({ "width": "40%" })}" class="delivery_info auto flex jus-sp" data-v-ad6e3734>`);
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
    _push(`<div style="${ssrRenderStyle({ "grid-column": "1 / -1", "min-height": "300px", "justify-content": "space-between" })}" class="flex" data-v-ad6e3734><div style="${ssrRenderStyle({ "width": "46%", "padding": "3%", "background": "#fff" })}" data-v-ad6e3734><p align="center" data-v-ad6e3734>\u0422\u043E\u0432\u0430\u0440\u044B \u0437\u0430\u043A\u0430\u0437\u0430</p>`);
    _push(ssrRenderComponent(_component_order_item_list, {
      orderList: $data.order.product_list_transaction
    }, null, _parent));
    _push(`</div><div style="${ssrRenderStyle({ "width": "46%", "padding": "3%", "background": "#fff" })}" data-v-ad6e3734>`);
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
  _push(`</section><div style="${ssrRenderStyle({ "height": "auto", "min-height": "300px", "width": "100%", "background-color": "#fff", "margin-top": "30px", "padding": "2% 3%" })}" class="flex" data-v-ad6e3734>`);
  if (!$data.dilevery_auto) {
    _push(`<button class="btn" data-v-ad6e3734> \u0410\u0432\u0442\u043E\u0437\u0430\u043F\u043E\u043B\u0435\u043D\u0435\u043D\u0438\u0435 </button>`);
  } else if ($data.dilevery_info) {
    _push(`<div style="${ssrRenderStyle({ "width": "100%", "height": "100%" })}" data-v-ad6e3734><p align="center" data-v-ad6e3734>\u0418\u043D\u0444\u043E \u043E \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0435</p><p data-v-ad6e3734>\u041F\u0443\u043D\u043A\u0442 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</p><input disabled${ssrRenderAttr("value", $data.dilevery_info.delivery_point)} type="text" name="" id="" style="${ssrRenderStyle({ "margin-top": "10px" })}" data-v-ad6e3734><p align="center" data-v-ad6e3734>\u0423\u043F\u0430\u043A\u043E\u0432\u043A\u0438</p><!--[-->`);
    ssrRenderList($data.dilevery_info.packages, (pack) => {
      _push(`<div style="${ssrRenderStyle({ "width": "100%" })}" data-v-ad6e3734><br data-v-ad6e3734><div class="spoiler_title" align="center" data-v-ad6e3734>${ssrInterpolate(pack.number)} <span class="${ssrRenderClass([{ open: $data.openContent == pack.number }, "spoiler_arrow"])}" data-v-ad6e3734><svg viewBox="-122.9 121.1 105.9 61.9" data-v-ad6e3734><path d="M-63.2 180.3l43.5-43.5c1.7-1.7 2.7-4 2.7-6.5s-1-4.8-2.7-6.5c-1.7-1.7-4-2.7-6.5-2.7s-4.8 1-6.5 2.7L-69.9 161l-37.2-37.2c-1.7-1.7-4-2.7-6.5-2.7s-4.8 1-6.5 2.6c-1.9 1.8-2.8 4.2-2.8 6.6 0 2.3.9 4.6 2.6 6.5 11.4 11.5 41 41.2 43 43.3l.2.2c3.6 3.6 10.3 3.6 13.9 0z" data-v-ad6e3734></path></svg></span></div><div class="${ssrRenderClass([{ open: $data.openContent == pack.number }, "spoiler_content"])}" data-v-ad6e3734><p data-v-ad6e3734>\u0412\u044B\u0441\u043E\u0442\u0430</p><input${ssrRenderAttr("value", pack.height)} type="text" data-v-ad6e3734><p data-v-ad6e3734>\u0414\u043B\u0438\u043D\u0430</p><input${ssrRenderAttr("value", pack.length)} type="text" data-v-ad6e3734><p data-v-ad6e3734>\u0412\u0435\u0441</p><input${ssrRenderAttr("value", pack.weight)} type="text" data-v-ad6e3734><p data-v-ad6e3734>\u0428\u0438\u0440\u0438\u043D\u0430</p><input${ssrRenderAttr("value", pack.width)} type="text" data-v-ad6e3734><p align="center" data-v-ad6e3734>\u0422\u043E\u0432\u0430\u0440\u044B</p><!--[-->`);
      ssrRenderList(pack.items, (item) => {
        _push(`<div style="${ssrRenderStyle({ "width": "100%" })}" data-v-ad6e3734><p data-v-ad6e3734>\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E</p><input disabled${ssrRenderAttr("value", item.amount)} type="text" data-v-ad6e3734><p data-v-ad6e3734>\u0426\u0435\u043D\u0430</p><input disabled${ssrRenderAttr("value", item.cost)} type="text" data-v-ad6e3734><p data-v-ad6e3734>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</p><input disabled${ssrRenderAttr("value", item.name)} type="text" data-v-ad6e3734><p data-v-ad6e3734>\u041E\u043F\u043B\u0430\u0442\u0430</p><input disabled${ssrRenderAttr("value", item.payment.value)} type="text" data-v-ad6e3734><p data-v-ad6e3734>\u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u0442\u043E\u0432\u0430\u0440\u0430</p><input disabled${ssrRenderAttr("value", item.ware_key)} type="text" data-v-ad6e3734><p data-v-ad6e3734>\u0412\u0435\u0441 \u0442\u043E\u0432\u0430\u0440\u0430</p><input disabled${ssrRenderAttr("value", item.weight)} type="text" data-v-ad6e3734><br data-v-ad6e3734><hr data-v-ad6e3734><br data-v-ad6e3734></div>`);
      });
      _push(`<!--]--><button disabled class="btn" data-v-ad6e3734>\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u043E\u0432\u0430\u0440</button></div></div>`);
    });
    _push(`<!--]--><button disabled class="btn" data-v-ad6e3734>\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0443\u043F\u0430\u043A\u043E\u0432\u043A\u0443</button><p data-v-ad6e3734>\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044C</p><input disabled${ssrRenderAttr("value", $data.dilevery_info.recipient.name)} type="text" data-v-ad6e3734><!--[-->`);
    ssrRenderList($data.dilevery_info.recipient.phones, (phone) => {
      _push(`<input disabled${ssrRenderAttr("value", phone.number)} type="text" data-v-ad6e3734>`);
    });
    _push(`<!--]--><p data-v-ad6e3734>\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u0435\u043B\u044C</p><input${ssrRenderAttr("value", $data.dilevery_info.sender.company)} type="text" data-v-ad6e3734><input${ssrRenderAttr("value", $data.dilevery_info.sender.name)} type="text" data-v-ad6e3734><p data-v-ad6e3734>\u041C\u0435\u0441\u0442\u043E \u043E\u0442\u0433\u0440\u0443\u0437\u043A\u0438</p><input disabled${ssrRenderAttr("value", $data.dilevery_info.shipment_point)} type="text" data-v-ad6e3734><p data-v-ad6e3734>\u0422\u0430\u0440\u0438\u0444\u043D\u044B\u0439 \u043A\u043E\u0434</p><input disabled${ssrRenderAttr("value", $data.dilevery_info.tariff_code)} type="text" data-v-ad6e3734><p data-v-ad6e3734>\u0422\u0438\u043F</p><input disabled${ssrRenderAttr("value", $data.dilevery_info.type)} type="text" data-v-ad6e3734><button style="${ssrRenderStyle({ "background-color": "green" })}" class="btn" data-v-ad6e3734>\u041E\u0444\u043E\u0440\u043C\u0438\u0442\u044C \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0443</button></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/orders/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-ad6e3734"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-13fe89d2.mjs.map
