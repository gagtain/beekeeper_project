import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { useSSRContext } from 'vue';
import { _ as _export_sfc } from '../server.mjs';

const _sfc_main = {
  props: ["delivery"]
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><p>\u041D\u043E\u043C\u0435\u0440 \u0437\u0430\u043A\u0430\u0437\u0430 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0435: ${ssrInterpolate($props.delivery.uuid)}</p><p>\u0422\u0440\u0435\u043A \u043D\u043E\u043C\u0435\u0440 \u0437\u0430\u043A\u0430\u0437\u0430: ${ssrInterpolate($props.delivery.track_number)}</p><p>\u0421\u0443\u043C\u043C\u0430 \u0437\u0430\u043A\u0430\u0437\u0430 \u0441 \u0443\u0447\u0435\u0442\u043E\u043C \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438: ${ssrInterpolate($props.delivery.order_delivery_transaction[0].amount)} ${ssrInterpolate($props.delivery.order_delivery_transaction[0].amount_currency)}</p><p>\u0421\u0442\u0430\u0442\u0443\u0441 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438: ${ssrInterpolate($props.delivery.status)}</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminComp/DeliveryInfo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DeliveryInfo = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
let api_root = "http://localhost:8000/";

export { DeliveryInfo as D, api_root as a };
//# sourceMappingURL=main-2a14514f.mjs.map
