import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { useSSRContext } from 'vue';
import { _ as _export_sfc } from '../server.mjs';

const _sfc_main = {
  props: ["order"]
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-3aaa3aa4><p data-v-3aaa3aa4>\u041E\u0444\u043E\u0440\u043C\u0438\u043B: ${ssrInterpolate($props.order.user.FIO)}</p><p data-v-3aaa3aa4>\u041F\u043E\u0447\u0442\u0430: ${ssrInterpolate($props.order.user.email)}</p><p data-v-3aaa3aa4>\u041E\u0431\u0449\u0430\u044F \u0441\u0443\u043C\u043C\u0430 \u0437\u0430\u043A\u0430\u0437\u0430: ${ssrInterpolate($props.order.amount)}</p><p data-v-3aaa3aa4>\u0421\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u043A\u0430\u0437\u0430: ${ssrInterpolate($props.order.status)}</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminComp/OrderInfo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const OrderInfo = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-3aaa3aa4"]]);

export { OrderInfo as O };
//# sourceMappingURL=OrderInfo-39aa70cf.mjs.map
