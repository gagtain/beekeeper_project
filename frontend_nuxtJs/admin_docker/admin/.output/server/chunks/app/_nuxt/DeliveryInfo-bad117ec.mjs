import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { useSSRContext } from 'vue';
import { _ as _export_sfc } from '../server.mjs';

const _sfc_main = {
  props: ["delivery"]
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-bcb560e2><p data-v-bcb560e2>\u041D\u043E\u043C\u0435\u0440 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0435: ${ssrInterpolate($props.delivery.uuid)}</p><p data-v-bcb560e2>\u0422\u0440\u0435\u043A \u043D\u043E\u043C\u0435\u0440 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438: ${ssrInterpolate($props.delivery.track_number)}</p><p data-v-bcb560e2>\u0421\u0442\u0430\u0442\u0443\u0441 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438: ${ssrInterpolate($props.delivery.status)}</p><p data-v-bcb560e2>\u0424\u043E\u0440\u043C\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438: ${ssrInterpolate($props.delivery.delivery_method)}</p><p data-v-bcb560e2>\u041A\u0443\u0434\u0430: ${ssrInterpolate($props.delivery.where)}</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminComp/DeliveryInfo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DeliveryInfo = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-bcb560e2"]]);

export { DeliveryInfo as D };
//# sourceMappingURL=DeliveryInfo-bad117ec.mjs.map
