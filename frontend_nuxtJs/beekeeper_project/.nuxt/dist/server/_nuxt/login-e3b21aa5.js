import { _ as __nuxt_component_0 } from "./ImageForm-a3b5780e.js";
import axios from "axios";
import { a as api_root, _ as _export_sfc, r as redirect } from "../server.mjs";
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
const login_scss_vue_type_style_index_0_src_0a45c4cc_scoped_0a45c4cc_lang = "";
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
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "login_main" }, _attrs))} data-v-0a45c4cc><div class="sot-ob" data-v-0a45c4cc><div class="wrapper flex" data-v-0a45c4cc><div class="login-page flex" data-v-0a45c4cc>`);
  _push(ssrRenderComponent(_component_AuthImageForm, null, null, _parent));
  _push(`<div class="form" data-v-0a45c4cc><p class="small login-p" data-v-0a45c4cc>Войти в аккаунт</p><div class="flex h_sto" data-v-0a45c4cc><div class="login-form auto" data-v-0a45c4cc><div class="error_list" data-v-0a45c4cc>`);
  if ($data.login_401) {
    _push(`<div data-v-0a45c4cc> Нету учетной записи с введенными данными </div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><input type="text" placeholder="username"${ssrRenderAttr("value", $data.username)} data-v-0a45c4cc><input type="password" placeholder="password"${ssrRenderAttr("value", $data.password)} data-v-0a45c4cc><button data-v-0a45c4cc>login</button><p class="message" data-v-0a45c4cc> Not registered? <a href="#" data-v-0a45c4cc>Create an account</a></p></div></div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-0a45c4cc"]]);
export {
  login as default
};
//# sourceMappingURL=login-e3b21aa5.js.map
