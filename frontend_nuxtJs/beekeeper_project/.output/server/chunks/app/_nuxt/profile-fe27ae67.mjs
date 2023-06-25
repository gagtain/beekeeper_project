import { b as buildAssetsURL } from '../../handlers/renderer.mjs';
import { useSSRContext, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from '../server.mjs';
import { U as UserBasket } from './UserBasket-136b769c.mjs';
import 'vue-bundle-renderer/runtime';
import 'h3';
import 'devalue';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'ofetch';
import 'unenv/runtime/fetch/index';
import 'hookable';
import 'scule';
import 'klona';
import 'defu';
import 'ohash';
import 'ufo';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'unctx';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'cookie-es';
import 'axios';
import './FavoriteComp-b5d57204.mjs';
import './removeFavorite-c9297cac.mjs';

const _imports_0 = "" + buildAssetsURL("2.85504193.png");
const _sfc_main$2 = {
  el: "#UserInfoRen",
  name: "UserInfoRen"
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "user_kor_zak",
    id: "UserInfoRen"
  }, _attrs))} data-v-96b62040><div class="user_kor flex relative" data-v-96b62040><div class="w-sto h_sto s flex absolute" data-v-96b62040><div class="auto edit-user_info h_sto" data-v-96b62040><button onclick="alert(&#39;\u0412 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435&#39;)" class="edit-user_info_btn auto" data-v-96b62040> \u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 </button></div></div><div class="auto edit_block w-sto" style="${ssrRenderStyle({ "filter": "blur(10px)" })}" data-v-96b62040><input type="text" class="user_form_input" placeholder="username" data-v-96b62040><input type="password" class="user_form_input" placeholder="password" data-v-96b62040><button class="edit-user_info_btn auto" data-v-96b62040>\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C</button></div></div><div class="user_zak" onclick="alert(&#39;\u0412 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435&#39;)" data-v-96b62040><p class="small" data-v-96b62040>\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u0437\u0430\u043A\u0430\u0437</p><div class="end_zakaz" data-v-96b62040><div class="end_zakaz_img flex" data-v-96b62040><img width="100%" style="${ssrRenderStyle({ "aspect-ratio": "1/1" })}" class="auto"${ssrRenderAttr("src", _imports_0)} alt="" data-v-96b62040></div><div class="end_zakaz_info flex" data-v-96b62040><div class="auto end_zakaz_info_p_all" data-v-96b62040><div class="block w-sto" data-v-96b62040><p class="normal-small end_zakaz_info_p" data-v-96b62040>\u0426\u0435\u043D\u0430:</p><span class="info_end_zakaz_span" data-v-96b62040>400 \u0440</span></div><div class="block w-sto" data-v-96b62040><p class="normal-small end_zakaz_info_p" data-v-96b62040> \u0414\u0430\u0442\u0430 \u043E\u0444\u043E\u043C\u043B\u0435\u043D\u0438\u044F: </p><span class="info_end_zakaz_span" data-v-96b62040>20-10-23</span></div><div class="block" data-v-96b62040><p class="normal-small end_zakaz_info_p" data-v-96b62040>\u0421\u0442\u0430\u0442\u0443\u0441:</p><span class="info_end_zakaz_span" data-v-96b62040>\u0412 \u043F\u0443\u0442\u0438</span></div></div></div></div></div></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/UserInfoRen.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const UserInfoRen = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-96b62040"]]);
const _sfc_main$1 = {
  el: "#user_info",
  name: "UserInfo",
  data() {
    return {
      USER_STATE: this.$store.getUser
    };
  },
  setup() {
  },
  watch: {
    "USER_STATE.basket"() {
      console.log("\u043A\u043E\u0440\u0437\u0438\u043D\u0430 \u0438\u0437\u043C\u0435\u043D\u0435\u043D");
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "user_info_menu" }, _attrs))} data-v-8006981a><div class="user_info auto h_sto" id="user_info" data-v-8006981a><div class="user_img_profile" data-v-8006981a><img${ssrRenderAttr("src", _ctx.$api_root + $data.USER_STATE.image)} alt="" data-v-8006981a></div><p class="small user_name_profile" data-v-8006981a>${ssrInterpolate($data.USER_STATE.username)}</p><p class="small user_name_profile" data-v-8006981a>${ssrInterpolate($data.USER_STATE.FIO)}</p><div class="menu_user flex jus-sp auto" data-v-8006981a><div class="favorite" data-v-8006981a><img class="user_menu_img" height="100%"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/favorite/favorite_add.png")} alt="" data-v-8006981a><p class="very-small" data-v-8006981a>\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435</p></div></div></div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/UserInfo.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const UserInfoVue = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-8006981a"]]);
const __default__ = {
  components: {
    UserInfoVue,
    UserInfoRen,
    UserBasket
  },
  el: "#user_wrap",
  name: "WrapperUser",
  setup() {
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-46b2dfab><div class="wrapper flex" data-v-46b2dfab><div class="user_card flex auto" id="user_wrap" data-v-46b2dfab><div class="interactiv user_card_div auto" data-v-46b2dfab><div class="flex jus-sp card" data-v-46b2dfab>`);
      _push(ssrRenderComponent(UserInfoVue, null, null, _parent));
      _push(ssrRenderComponent(UserInfoRen, null, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(UserBasket, null, null, _parent));
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const profile = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-46b2dfab"]]);

export { profile as default };
//# sourceMappingURL=profile-fe27ae67.mjs.map
