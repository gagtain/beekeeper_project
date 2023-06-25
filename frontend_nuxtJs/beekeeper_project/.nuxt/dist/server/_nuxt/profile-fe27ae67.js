import { mergeProps, useSSRContext } from "vue";
import "vue-router";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
import { U as UserBasket } from "./UserBasket-136b769c.js";
import "ofetch";
import "#internal/nitro";
import "hookable";
import "unctx";
import "@vue/devtools-api";
import "destr";
import "devalue";
import "klona";
import "h3";
import "@unhead/ssr";
import "unhead";
import "@unhead/shared";
import "ufo";
import "cookie-es";
import "ohash";
import "axios";
import "defu";
import "./FavoriteComp-b5d57204.js";
import "./removeFavorite-c9297cac.js";
const _imports_0 = "" + __buildAssetsURL("2.85504193.png");
const account_css_vue_type_style_index_0_src_96b62040_scoped_96b62040_lang = "";
const _sfc_main$2 = {
  el: "#UserInfoRen",
  name: "UserInfoRen"
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "user_kor_zak",
    id: "UserInfoRen"
  }, _attrs))} data-v-96b62040><div class="user_kor flex relative" data-v-96b62040><div class="w-sto h_sto s flex absolute" data-v-96b62040><div class="auto edit-user_info h_sto" data-v-96b62040><button onclick="alert(&#39;В разработке&#39;)" class="edit-user_info_btn auto" data-v-96b62040> Изменить данные </button></div></div><div class="auto edit_block w-sto" style="${ssrRenderStyle({ "filter": "blur(10px)" })}" data-v-96b62040><input type="text" class="user_form_input" placeholder="username" data-v-96b62040><input type="password" class="user_form_input" placeholder="password" data-v-96b62040><button class="edit-user_info_btn auto" data-v-96b62040>Подтвердить</button></div></div><div class="user_zak" onclick="alert(&#39;В разработке&#39;)" data-v-96b62040><p class="small" data-v-96b62040>Последний заказ</p><div class="end_zakaz" data-v-96b62040><div class="end_zakaz_img flex" data-v-96b62040><img width="100%" style="${ssrRenderStyle({ "aspect-ratio": "1/1" })}" class="auto"${ssrRenderAttr("src", _imports_0)} alt="" data-v-96b62040></div><div class="end_zakaz_info flex" data-v-96b62040><div class="auto end_zakaz_info_p_all" data-v-96b62040><div class="block w-sto" data-v-96b62040><p class="normal-small end_zakaz_info_p" data-v-96b62040>Цена:</p><span class="info_end_zakaz_span" data-v-96b62040>400 р</span></div><div class="block w-sto" data-v-96b62040><p class="normal-small end_zakaz_info_p" data-v-96b62040> Дата офомления: </p><span class="info_end_zakaz_span" data-v-96b62040>20-10-23</span></div><div class="block" data-v-96b62040><p class="normal-small end_zakaz_info_p" data-v-96b62040>Статус:</p><span class="info_end_zakaz_span" data-v-96b62040>В пути</span></div></div></div></div></div></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/UserInfoRen.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const UserInfoRen = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-96b62040"]]);
const account_css_vue_type_style_index_0_src_8006981a_scoped_8006981a_lang = "";
const UserInfo_vue_vue_type_style_index_1_lang = "";
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
      console.log("корзина изменен");
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "user_info_menu" }, _attrs))} data-v-8006981a><div class="user_info auto h_sto" id="user_info" data-v-8006981a><div class="user_img_profile" data-v-8006981a><img${ssrRenderAttr("src", _ctx.$api_root + $data.USER_STATE.image)} alt="" data-v-8006981a></div><p class="small user_name_profile" data-v-8006981a>${ssrInterpolate($data.USER_STATE.username)}</p><p class="small user_name_profile" data-v-8006981a>${ssrInterpolate($data.USER_STATE.FIO)}</p><div class="menu_user flex jus-sp auto" data-v-8006981a><div class="favorite" data-v-8006981a><img class="user_menu_img" height="100%"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/favorite/favorite_add.png")} alt="" data-v-8006981a><p class="very-small" data-v-8006981a>Избранное</p></div></div></div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/UserInfo.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const UserInfoVue = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-8006981a"]]);
const account_css_vue_type_style_index_0_src_46b2dfab_scoped_46b2dfab_lang = "";
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
export {
  profile as default
};
//# sourceMappingURL=profile-fe27ae67.js.map
