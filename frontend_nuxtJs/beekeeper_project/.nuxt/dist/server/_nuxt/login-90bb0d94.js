import { r as redirect, _ as __nuxt_component_0 } from "./redirect-978c9e2e.js";
import axios from "axios";
import { a as api_root, _ as _export_sfc } from "../server.mjs";
import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr } from "vue/server-renderer";
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
import "vue-router";
import "ufo";
import "cookie-es";
import "ohash";
import "defu";
async function login$1(data) {
  try {
    var response = await axios({
      url: `${api_root}api/token/`,
      method: "post",
      data,
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const login_scss_vue_type_style_index_0_src_7ecd6837_scoped_7ecd6837_lang = "";
const _sfc_main = {
  el: "#login_main",
  methods: {
    set_cookie(response) {
      var now = /* @__PURE__ */ new Date();
      var time = now.getTime();
      var expireTime = time + 1e3 * 3600;
      now.setTime(expireTime);
      document.cookie = "assess=" + response.data.access + ";expires=" + now.toUTCString() + ";path=/", document.cookie = "refresh=" + response.data.refresh + ";expires=" + now.toUTCString() + ";path=/";
    },
    async login_request(event) {
      event.preventDefault;
      let obj = {
        username: this.username,
        password: this.password
      };
      let response = await login$1(JSON.stringify(obj));
      console.log(response);
      if (response.status == 200) {
        this.set_cookie(response);
        redirect(this, {
          path: "/profile"
        });
      } else if (response.status == 401) {
        console.log("asd");
        this.login_401 = true;
      } else if (response == 404) {
        alert("сайт на проверке, подождите 5 минут");
      }
      return false;
    }
  },
  data() {
    return {
      username: "gag",
      password: "13",
      login_401: false
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AuthImageForm = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "login_main" }, _attrs))} data-v-7ecd6837><div class="sot-ob" data-v-7ecd6837><div class="wrapper flex" data-v-7ecd6837><div class="login-page flex" data-v-7ecd6837>`);
  _push(ssrRenderComponent(_component_AuthImageForm, null, null, _parent));
  _push(`<div class="form" data-v-7ecd6837><p class="small login-p" data-v-7ecd6837>Войти в аккаунт</p><div class="flex h_sto" data-v-7ecd6837><div class="login-form auto" data-v-7ecd6837><div class="error_list" data-v-7ecd6837>`);
  if ($data.login_401) {
    _push(`<div data-v-7ecd6837> Нету учетной записи с введенными данными </div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><input type="text" placeholder="username"${ssrRenderAttr("value", $data.username)} data-v-7ecd6837><input type="password" placeholder="password"${ssrRenderAttr("value", $data.password)} data-v-7ecd6837><button data-v-7ecd6837>login</button><p class="message" data-v-7ecd6837> Not registered? <a href="#" data-v-7ecd6837>Create an account</a></p></div></div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-7ecd6837"]]);
export {
  login as default
};
//# sourceMappingURL=login-90bb0d94.js.map
