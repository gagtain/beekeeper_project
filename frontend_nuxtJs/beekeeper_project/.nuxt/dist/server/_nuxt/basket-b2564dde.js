import { U as UserBasket } from "./UserBasket-315d4247.js";
import { resolveComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
import "./BasketInfo-c3e99e9d.js";
import "./FavoriteComp-6f7f6213.js";
import "./FavoriteComp-e87b76fb.js";
import "hookable";
import "devalue";
import "klona";
import "axios";
import "destr";
import "ofetch";
import "#internal/nitro";
import "unctx";
import "@vue/devtools-api";
import "h3";
import "@unhead/ssr";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "ufo";
import "cookie-es";
import "ohash";
import "defu";
const account_css_vue_type_style_index_0_src_ac55054c_scoped_ac55054c_lang = "";
const _sfc_main = {
  el: "basket_main",
  name: "BasketBase",
  components: {
    UserBasket
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_UserBasket = resolveComponent("UserBasket");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-ac55054c><div class="wrapper flex" data-v-ac55054c><div class="user_card flex auto" data-v-ac55054c><div class="interactiv user_card_div auto" id="basket_main" data-v-ac55054c>`);
  _push(ssrRenderComponent(_component_UserBasket, null, null, _parent));
  _push(`</div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/basket.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const basket = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-ac55054c"]]);
export {
  basket as default
};
//# sourceMappingURL=basket-b2564dde.js.map
