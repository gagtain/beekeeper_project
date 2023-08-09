import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderSlot } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
const checkbox_scss_vue_type_style_index_0_src_463ab7ef_scoped_463ab7ef_lang = "";
const OrderProductList_vue_vue_type_style_index_1_lang = "";
const _sfc_main = {
  el: "#orderProductList",
  setup() {
  },
  props: ["orderList"]
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "orderProductList" }, _attrs))} data-v-463ab7ef><!--[-->`);
  ssrRenderList($props.orderList, (orderItem, index) => {
    _push(`<div class="product_order_info" data-v-463ab7ef><div class="w-sto flex jus-sp" data-v-463ab7ef><p class="VAG" data-v-463ab7ef>${ssrInterpolate(index + 1)}</p> <p class="VAG" data-v-463ab7ef>${ssrInterpolate(orderItem.productItem.price * orderItem.count)} ${ssrInterpolate(orderItem.productItem.price_currency)}</p></div><div class="flex" data-v-463ab7ef><div class="img_order_product_div" data-v-463ab7ef><img class="img_order_product"${ssrRenderAttr("src", _ctx.$api_root + orderItem.productItem.product.image)} alt="" data-v-463ab7ef></div><div class="info_order_product_div" data-v-463ab7ef><div class="name_order_product" data-v-463ab7ef>${ssrInterpolate(orderItem.productItem.product.name)} ${ssrInterpolate(orderItem.productItem.weight ? "[" + orderItem.productItem.weight.weight + "гр]" : "")}</div><p data-v-463ab7ef>${ssrInterpolate(orderItem.productItem.price)} ${ssrInterpolate(orderItem.productItem.price_currency)}</p><p data-v-463ab7ef>${ssrInterpolate(orderItem.count)} шт</p></div></div>`);
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
const OrderProductList = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-463ab7ef"]]);
export {
  OrderProductList as O
};
//# sourceMappingURL=OrderProductList-48bace03.js.map