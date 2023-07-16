import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderSlot } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
const checkbox_scss_vue_type_style_index_0_src_8d1bc19e_scoped_8d1bc19e_lang = "";
const OrderProductList_vue_vue_type_style_index_1_lang = "";
const _sfc_main = {
  el: "#orderProductList",
  setup() {
  },
  props: ["orderList"]
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "orderProductList" }, _attrs))} data-v-8d1bc19e><!--[-->`);
  ssrRenderList($props.orderList, (orderItem, index) => {
    _push(`<div class="product_order_info" data-v-8d1bc19e><div class="w-sto flex jus-sp" data-v-8d1bc19e><p class="VAG" data-v-8d1bc19e>${ssrInterpolate(index + 1)}</p> <p class="VAG" data-v-8d1bc19e>${ssrInterpolate(orderItem.productItem.product.price * orderItem.count)} ${ssrInterpolate(orderItem.productItem.product.price_currency)}</p></div><div class="flex" data-v-8d1bc19e><div class="img_order_product_div" data-v-8d1bc19e><img class="img_order_product"${ssrRenderAttr("src", _ctx.$api_root + orderItem.productItem.product.image)} alt="" data-v-8d1bc19e></div><div class="info_order_product_div" data-v-8d1bc19e><div class="name_order_product" data-v-8d1bc19e>${ssrInterpolate(orderItem.productItem.product.name)} [${ssrInterpolate(orderItem.productItem.weight.weight)} гр]</div><p data-v-8d1bc19e>${ssrInterpolate(orderItem.productItem.product.price)} ${ssrInterpolate(orderItem.productItem.product.price_currency)}</p><p data-v-8d1bc19e>${ssrInterpolate(orderItem.count)} шт</p></div></div>`);
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
const OrderProductList = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-8d1bc19e"]]);
export {
  OrderProductList as O
};
//# sourceMappingURL=OrderProductList-80da8424.js.map
