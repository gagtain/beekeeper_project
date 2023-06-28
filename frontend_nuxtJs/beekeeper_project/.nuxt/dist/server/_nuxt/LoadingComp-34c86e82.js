import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
const LoadingComp_vue_vue_type_style_index_0_scoped_56decb65_lang = "";
const _sfc_main = {
  el: "#loader",
  name: "LoadingComp"
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "spinner",
    id: "loader"
  }, _attrs))} data-v-56decb65><div class="blob top" data-v-56decb65></div><div class="blob bottom" data-v-56decb65></div><div class="blob left" data-v-56decb65></div><div class="blob move-blob" data-v-56decb65></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/LoadingComp.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LoadingComp = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-56decb65"]]);
export {
  LoadingComp as L
};
//# sourceMappingURL=LoadingComp-34c86e82.js.map
