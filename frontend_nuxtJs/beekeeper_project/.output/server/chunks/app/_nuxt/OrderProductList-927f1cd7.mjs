import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from '../server.mjs';

const _sfc_main = {
  el: "#orderProductList",
  setup() {
  },
  props: ["orderList"]
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "orderProductList" }, _attrs))} data-v-ca6503ee><!--[-->`);
  ssrRenderList($props.orderList, (orderItem, index) => {
    _push(`<div class="product_order_info" data-v-ca6503ee><div class="w-sto flex jus-sp" data-v-ca6503ee><p class="VAG" data-v-ca6503ee>${ssrInterpolate(index + 1)}</p> <p class="VAG" data-v-ca6503ee>${ssrInterpolate(orderItem.productItem.price * orderItem.count)} ${ssrInterpolate(orderItem.productItem.price_currency)}</p></div><div class="flex" data-v-ca6503ee><div class="img_order_product_div" data-v-ca6503ee><img class="img_order_product"${ssrRenderAttr("src", _ctx.$api_root + orderItem.productItem.product.image.slice(1))} alt="" data-v-ca6503ee></div><div class="info_order_product_div" data-v-ca6503ee><div class="name_order_product" data-v-ca6503ee>${ssrInterpolate(orderItem.productItem.product.name)} ${ssrInterpolate(orderItem.productItem.weight ? "[" + orderItem.productItem.weight.weight + "\u0433\u0440]" : "")}</div><p data-v-ca6503ee>${ssrInterpolate(orderItem.productItem.price)} ${ssrInterpolate(orderItem.productItem.price_currency)}</p><p data-v-ca6503ee>${ssrInterpolate(orderItem.count)} \u0448\u0442</p></div></div>`);
    ssrRenderSlot(_ctx.$slots, "default", { orderItem }, null, _push, _parent);
    _push(`</div>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/OrderProductList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const OrderProductList = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-ca6503ee"]]);

export { OrderProductList as O };
//# sourceMappingURL=OrderProductList-927f1cd7.mjs.map
