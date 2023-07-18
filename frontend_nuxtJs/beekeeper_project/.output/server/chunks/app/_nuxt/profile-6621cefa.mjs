import { useSSRContext, mergeProps, resolveComponent, withCtx, createVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, a as api_root, u as useCookie } from '../server.mjs';
import axios from 'axios';
import { L as LoadingComp } from './LoadingComp-34c86e82.mjs';
import { U as UserBasket } from './UserBasket-c6187ebc.mjs';
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
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'klona';
import 'defu';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import './BasketInfo-c332dccf.mjs';
import './FavoriteComp-167c184d.mjs';
import './removeFavorite-8c059756.mjs';

async function getLastOrder() {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/order/last`,
      method: "get",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main$2 = {
  components: { LoadingComp },
  el: "#UserInfoRen",
  name: "UserInfoRen",
  data() {
    return {
      last_order: {
        amount: null,
        product_list_transaction: [{
          productItem: {
            product: {
              image: null
            }
          }
        }]
      },
      isLastOrder_loading: true
    };
  },
  async mounted() {
    let response_last_order = await getLastOrder();
    if (response_last_order.code != 400) {
      this.last_order = response_last_order.data;
      console.log(123213);
      this.isLastOrder_loading = false;
    } else {
      this.isLastOrder_loading = false;
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_LoadingComp = resolveComponent("LoadingComp");
  const _component_router_link = resolveComponent("router-link");
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "user_kor_zak",
    id: "UserInfoRen"
  }, _attrs))} data-v-cdd82b49><div class="user_kor flex relative" data-v-cdd82b49><div class="w-sto h_sto s flex absolute" data-v-cdd82b49><div class="auto edit-user_info h_sto" data-v-cdd82b49><button onclick="alert(&#39;\u0412 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435&#39;)" class="edit-user_info_btn auto" data-v-cdd82b49> \u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 </button></div></div><div class="auto edit_block w-sto" style="${ssrRenderStyle({ "filter": "blur(10px)" })}" data-v-cdd82b49><input type="text" class="user_form_input" placeholder="username" data-v-cdd82b49><input type="password" class="user_form_input" placeholder="password" data-v-cdd82b49><button class="edit-user_info_btn auto" data-v-cdd82b49>\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C</button></div></div><div class="user_zak relative" data-v-cdd82b49><p class="small" data-v-cdd82b49>\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u0437\u0430\u043A\u0430\u0437</p>`);
  if ($data.last_order.amount) {
    _push(`<div class="end_zakaz" data-v-cdd82b49><div class="end_zakaz_img flex" data-v-cdd82b49><img style="${ssrRenderStyle({ "aspect-ratio": "1/1" })}" class="auto w-sto"${ssrRenderAttr("src", _ctx.$api_root + $data.last_order.product_list_transaction[0].productItem.product.image)} alt="" data-v-cdd82b49></div><div class="end_zakaz_info flex" data-v-cdd82b49><div class="auto end_zakaz_info_p_all" data-v-cdd82b49><div class="block w-sto" data-v-cdd82b49><p class="normal-small end_zakaz_info_p" data-v-cdd82b49>\u0426\u0435\u043D\u0430:</p><span class="info_end_zakaz_span" data-v-cdd82b49>${ssrInterpolate($data.last_order.amount)}</span></div><div class="block w-sto" data-v-cdd82b49><p class="normal-small end_zakaz_info_p" data-v-cdd82b49> \u0414\u0430\u0442\u0430 \u043E\u0444\u043E\u043C\u043B\u0435\u043D\u0438\u044F: </p><span class="info_end_zakaz_span" data-v-cdd82b49>20-10-23</span></div><div class="block" data-v-cdd82b49><p class="normal-small end_zakaz_info_p" data-v-cdd82b49>\u0421\u0442\u0430\u0442\u0443\u0441:</p><span class="info_end_zakaz_span" data-v-cdd82b49>\u0412 \u043F\u0443\u0442\u0438</span></div></div></div></div>`);
  } else if ($data.isLastOrder_loading) {
    _push(ssrRenderComponent(_component_LoadingComp, null, null, _parent));
  } else {
    _push(`<div class="auto" data-v-cdd82b49><p style="${ssrRenderStyle({ "font-size": "28px" })}" class="VAG" data-v-cdd82b49>\u0421\u043F\u0438\u0441\u043E\u043A \u0437\u0430\u043A\u0430\u0437\u043E\u0432 \u043F\u0443\u0441\u0442 :(</p><div class="select_size" data-v-cdd82b49>`);
    _push(ssrRenderComponent(_component_router_link, { to: "/basket" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}" data-v-cdd82b49${_scopeId}> \u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443 </button>`);
        } else {
          return [
            createVNode("button", { style: { "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" } }, " \u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443 ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div></div>`);
  }
  _push(`</div></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/UserInfoRen.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const UserInfoRen = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-cdd82b49"]]);
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
//# sourceMappingURL=profile-6621cefa.mjs.map
