import { useSSRContext, resolveComponent, mergeProps, withCtx, createVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import { F as FavoriteComp, A as AddBasket } from './FavoriteComp-ed45f3a2.mjs';
import { _ as _export_sfc, u as useHead } from '../server.mjs';
import './FavoriteComp-5b75aa9c.mjs';
import 'axios';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'destr';
import 'h3';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'ufo';
import 'cookie-es';
import 'ohash';
import 'defu';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'klona';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';

const __default__ = {
  el: "#favorite_main",
  name: "FavoriteBase",
  components: {
    AddBasket,
    FavoriteComp
  },
  data() {
    return {
      USER_STATE: this.$store.getUser
    };
  },
  created() {
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "\u041F\u0447\u0435\u043B\u0438\u043D\u0430\u044F \u0430\u0440\u0442\u0435\u043B\u044C - \u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-4c560c47><div class="wrapper flex" data-v-4c560c47><div class="user_card flex auto" data-v-4c560c47><div class="interactiv user_card_div auto" id="favorite_main" data-v-4c560c47><div class="w-sto kor" data-v-4c560c47><p class="small-big VAG" data-v-4c560c47>\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435</p><div class="w-sto flex" data-v-4c560c47><div class="w-sto" data-v-4c560c47><!--[-->`);
      ssrRenderList(_ctx.USER_STATE.favorite_product, (b) => {
        _push(`<div class="tovar w-sto flex" data-v-4c560c47><div class="tovar_kor_img_div" data-v-4c560c47><img class="tovar_kor_img"${ssrRenderAttr("src", _ctx.$api_root + b.productItem.product.image)} alt="" data-v-4c560c47></div><div class="info_tovar_kor flex jus-sp" data-v-4c560c47><div class="info_tovar_kor_osnov" data-v-4c560c47><p class="normal-small tovar_kor_name" data-v-4c560c47>${ssrInterpolate(b.productItem.product.name)} ${ssrInterpolate(b.productItem.weight ? "[" + b.productItem.weight.weight + "\u0433\u0440]" : "")}</p><p class="normal-small info_in_tovar_kor description" data-v-4c560c47>${ssrInterpolate(b.productItem.product.price)} ${ssrInterpolate(b.productItem.product.price_currency)}</p><div style="${ssrRenderStyle({ "width": "45%" })}" class="flex" data-v-4c560c47>`);
        _push(ssrRenderComponent(FavoriteComp, {
          id: b.productItem.id
        }, null, _parent));
        _push(ssrRenderComponent(AddBasket, {
          id: b.productItem.id
        }, null, _parent));
        _push(`</div></div><div class="size_tovar_div" data-v-4c560c47><div class="size_tovar_kor" data-v-4c560c47><div class="select_size" data-v-4c560c47><button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "height": "32px", "border": "none", "border-radius": "6px" })}" onclick="alert(&#39;\u0432 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435&#39;)" data-v-4c560c47>\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C</button></div></div></div></div></div>`);
      });
      _push(`<!--]-->`);
      if (!_ctx.USER_STATE.favorite_product.length) {
        _push(`<div style="${ssrRenderStyle({ "width": "50%", "margin": "auto", "margin-top": "10%" })}" data-v-4c560c47><p style="${ssrRenderStyle({ "font-size": "28px" })}" class="VAG" data-v-4c560c47>\u0421\u043F\u0438\u0441\u043E\u043A \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0433\u043E \u043F\u0443\u0441\u0442 :(</p><div class="select_size" data-v-4c560c47>`);
        _push(ssrRenderComponent(_component_router_link, { to: "/catalog" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}" data-v-4c560c47${_scopeId}> \u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 \u043A\u0430\u0442\u0430\u043B\u043E\u0433 </button>`);
            } else {
              return [
                createVNode("button", { style: { "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" } }, " \u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 \u043A\u0430\u0442\u0430\u043B\u043E\u0433 ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/favorite.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const favorite = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4c560c47"]]);

export { favorite as default };
//# sourceMappingURL=favorite-842db731.mjs.map
