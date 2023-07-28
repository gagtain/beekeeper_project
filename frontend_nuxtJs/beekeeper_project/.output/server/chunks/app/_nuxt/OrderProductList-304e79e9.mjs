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
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "orderProductList" }, _attrs))} data-v-311d7cd4><!--[-->`);
  ssrRenderList($props.orderList, (orderItem, index) => {
    _push(`<div class="product_order_info" data-v-311d7cd4><div class="w-sto flex jus-sp" data-v-311d7cd4><p class="VAG" data-v-311d7cd4>${ssrInterpolate(index + 1)}</p> <p class="VAG" data-v-311d7cd4>${ssrInterpolate(orderItem.productItem.price * orderItem.count)} ${ssrInterpolate(orderItem.productItem.price_currency)}</p></div><div class="flex" data-v-311d7cd4><div class="img_order_product_div" data-v-311d7cd4><img class="img_order_product"${ssrRenderAttr("src", _ctx.$api_root + orderItem.productItem.product.image)} alt="" data-v-311d7cd4></div><div class="info_order_product_div" data-v-311d7cd4><div class="name_order_product" data-v-311d7cd4>${ssrInterpolate(orderItem.productItem.product.name)} [${ssrInterpolate(orderItem.productItem.weight.weight)} \u0433\u0440]</div><p data-v-311d7cd4>${ssrInterpolate(orderItem.productItem.price)} ${ssrInterpolate(orderItem.productItem.price_currency)}</p><p data-v-311d7cd4>${ssrInterpolate(orderItem.count)} \u0448\u0442</p></div></div>`);
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
const OrderProductList = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-311d7cd4"]]);

export { OrderProductList as O };
//# sourceMappingURL=OrderProductList-304e79e9.mjs.map
