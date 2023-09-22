import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import "hookable";
import "destr";
import "devalue";
import "klona";
import { U as UserBasket } from "./UserBasket-0f775124.js";
import { _ as _export_sfc, u as useHead } from "../server.mjs";
import "./BasketInfo-7bc07d4e.js";
import "./LoadingComp-34c86e82.js";
import "./FavoriteComp-bfd510a6.js";
import "./FavoriteComp-f62eb513.js";
import "axios";
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
const account_css_vue_type_style_index_0_src_8780e718_scoped_8780e718_lang = "";
const __default__ = {
  el: "basket_main",
  name: "BasketBase",
  components: {
    UserBasket
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Пчелиная артель - Корзина"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-8780e718><div class="wrapper flex" data-v-8780e718><div class="user_card flex auto" data-v-8780e718><div class="interactiv user_card_div auto" id="basket_main" data-v-8780e718>`);
      _push(ssrRenderComponent(UserBasket, null, null, _parent));
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/basket.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const basket = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8780e718"]]);
export {
  basket as default
};
//# sourceMappingURL=basket-63a1334d.js.map
