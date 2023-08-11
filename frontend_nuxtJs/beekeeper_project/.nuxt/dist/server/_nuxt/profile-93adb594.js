import { resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from "vue";
import "vue-router";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import "hookable";
import "destr";
import "devalue";
import "klona";
import axios from "axios";
import { a as api_root, _ as _export_sfc, u as useHead } from "../server.mjs";
import { L as LoadingComp } from "./LoadingComp-34c86e82.js";
import { U as UserBasket } from "./UserBasket-385422ca.js";
import "ofetch";
import "#internal/nitro";
import "unctx";
import "@vue/devtools-api";
import "h3";
import "@unhead/ssr";
import "unhead";
import "@unhead/shared";
import "ufo";
import "cookie-es";
import "ohash";
import "defu";
import "./BasketInfo-c3e99e9d.js";
import "./FavoriteComp-ed45f3a2.js";
import "./FavoriteComp-5b75aa9c.js";
async function getLastOrder() {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/order/last`,
      method: "get",
      headers: {},
      withCredentials: true
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const account_css_vue_type_style_index_0_src_cdd82b49_scoped_cdd82b49_lang = "";
const _sfc_main$3 = {
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
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_LoadingComp = resolveComponent("LoadingComp");
  const _component_router_link = resolveComponent("router-link");
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "user_kor_zak",
    id: "UserInfoRen"
  }, _attrs))} data-v-cdd82b49><div class="user_kor flex relative" data-v-cdd82b49><div class="w-sto h_sto s flex absolute" data-v-cdd82b49><div class="auto edit-user_info h_sto" data-v-cdd82b49><button onclick="alert(&#39;В разработке&#39;)" class="edit-user_info_btn auto" data-v-cdd82b49> Изменить данные </button></div></div><div class="auto edit_block w-sto" style="${ssrRenderStyle({ "filter": "blur(10px)" })}" data-v-cdd82b49><input type="text" class="user_form_input" placeholder="username" data-v-cdd82b49><input type="password" class="user_form_input" placeholder="password" data-v-cdd82b49><button class="edit-user_info_btn auto" data-v-cdd82b49>Подтвердить</button></div></div><div class="user_zak relative" data-v-cdd82b49><p class="small" data-v-cdd82b49>Последний заказ</p>`);
  if ($data.last_order.amount) {
    _push(`<div class="end_zakaz" data-v-cdd82b49><div class="end_zakaz_img flex" data-v-cdd82b49><img style="${ssrRenderStyle({ "aspect-ratio": "1/1" })}" class="auto w-sto"${ssrRenderAttr("src", _ctx.$api_root + $data.last_order.product_list_transaction[0].productItem.product.image)} alt="" data-v-cdd82b49></div><div class="end_zakaz_info flex" data-v-cdd82b49><div class="auto end_zakaz_info_p_all" data-v-cdd82b49><div class="block w-sto" data-v-cdd82b49><p class="normal-small end_zakaz_info_p" data-v-cdd82b49>Цена:</p><span class="info_end_zakaz_span" data-v-cdd82b49>${ssrInterpolate($data.last_order.amount)}</span></div><div class="block w-sto" data-v-cdd82b49><p class="normal-small end_zakaz_info_p" data-v-cdd82b49> Дата офомления: </p><span class="info_end_zakaz_span" data-v-cdd82b49>20-10-23</span></div><div class="block" data-v-cdd82b49><p class="normal-small end_zakaz_info_p" data-v-cdd82b49>Статус:</p><span class="info_end_zakaz_span" data-v-cdd82b49>В пути</span></div></div></div></div>`);
  } else if ($data.isLastOrder_loading) {
    _push(ssrRenderComponent(_component_LoadingComp, null, null, _parent));
  } else {
    _push(`<div class="auto" data-v-cdd82b49><p style="${ssrRenderStyle({ "font-size": "28px" })}" class="VAG" data-v-cdd82b49>Список заказов пуст :(</p><div class="select_size" data-v-cdd82b49>`);
    _push(ssrRenderComponent(_component_router_link, { to: "/basket" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}" data-v-cdd82b49${_scopeId}> Перейти в корзину </button>`);
        } else {
          return [
            createVNode("button", { style: { "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" } }, " Перейти в корзину ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div></div>`);
  }
  _push(`</div></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/UserInfoRen.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const UserInfoRen = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-cdd82b49"]]);
async function image_edit(data) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/user/image_edit`,
      method: "post",
      headers: {},
      withCredentials: true,
      data
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const UserImage_vue_vue_type_style_index_0_lang = "";
const account_css_vue_type_style_index_1_src_bf8adc55_scoped_bf8adc55_lang = "";
const _sfc_main$2 = {
  methods: {
    re_image() {
      document.getElementById("user_image_input").click();
    },
    async image_change() {
      let image = document.getElementById("user_image_input").files[0];
      let data = new FormData();
      data.append("image", image);
      let r = await image_edit(data);
      this.$store.REFACTOR_USER_IMAGE(r.data.image);
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "user_img_profile relative" }, _attrs))} data-v-bf8adc55><img${ssrRenderAttr("src", _ctx.$api_root + _ctx.$store.getUser.image)} alt="" data-v-bf8adc55><div class="absolute w-sto h_sto flex" data-v-bf8adc55><input style="${ssrRenderStyle({ "display": "none" })}" type="file" src="" id="user_image_input" accept="image/*" alt="" data-v-bf8adc55><button class="auto" style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "height": "auto" })}" data-v-bf8adc55> Изменить </button></div></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/UserImage.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const UserImage = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-bf8adc55"]]);
const account_css_vue_type_style_index_0_src_3d278804_scoped_3d278804_lang = "";
const UserInfo_vue_vue_type_style_index_1_lang = "";
const _sfc_main$1 = {
  components: { UserImage },
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
  const _component_user_image = resolveComponent("user-image");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "user_info_menu" }, _attrs))} data-v-3d278804><div class="user_info auto h_sto" id="user_info" data-v-3d278804>`);
  _push(ssrRenderComponent(_component_user_image, null, null, _parent));
  _push(`<p class="small user_name_profile" data-v-3d278804>${ssrInterpolate($data.USER_STATE.username)}</p><p class="small user_name_profile" data-v-3d278804>Пчелиная артель</p><div class="menu_user flex jus-sp auto" data-v-3d278804><div class="favorite" data-v-3d278804><img class="user_menu_img" height="100%"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/favorite/favorite_add.png")} alt="" data-v-3d278804><p class="very-small" data-v-3d278804>Избранное</p></div></div></div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/UserInfo.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const UserInfoVue = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-3d278804"]]);
const account_css_vue_type_style_index_0_src_512fb1dd_scoped_512fb1dd_lang = "";
const __default__ = {
  components: {
    UserInfoVue,
    UserInfoRen,
    UserBasket
  },
  el: "#user_wrap",
  name: "WrapperUser"
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Пчелиная артель - Профиль"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-512fb1dd><div class="wrapper flex" data-v-512fb1dd><div class="user_card flex auto" id="user_wrap" data-v-512fb1dd><div class="interactiv user_card_div auto" data-v-512fb1dd><div class="flex jus-sp card" data-v-512fb1dd>`);
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
const profile = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-512fb1dd"]]);
export {
  profile as default
};
//# sourceMappingURL=profile-93adb594.js.map