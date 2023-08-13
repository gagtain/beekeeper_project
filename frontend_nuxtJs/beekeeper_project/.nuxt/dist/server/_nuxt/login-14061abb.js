import { _ as __nuxt_component_0 } from "./ImageForm-b2aae3d6.js";
import axios from "axios";
import { a as api_root, _ as _export_sfc, u as useHead } from "../server.mjs";
import { mergeProps, useSSRContext } from "vue";
import "hookable";
import "destr";
import "devalue";
import "klona";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
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
async function login$1(data) {
  try {
    var response = await axios({
      url: `${api_root}api/token/`,
      method: "post",
      data,
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const login_scss_vue_type_style_index_0_src_aa443296_scoped_aa443296_lang = "";
const _sfc_main = {
  el: "#login_main",
  methods: {
    async login_request(event) {
      let obj = {
        username: this.username,
        password: this.password
      };
      let response = await login$1(JSON.stringify(obj));
      if (response.status == 200) {
        await this.$router.push("/profile");
      } else if (response.status == 401) {
        this.login_401 = true;
      } else if (response == 404) {
        alert("сайт на проверке, подождите 5 минут");
      }
    }
  },
  mounted() {
    this.message = this.$route.query.message;
  },
  data() {
    return {
      username: "gag",
      password: "13",
      login_401: false,
      message: null
    };
  },
  setup() {
    useHead({
      title: "Пчелиная артель - Вход",
      meta: [
        { name: "description", content: "My amazing site." }
      ]
    });
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AuthImageForm = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "login_main" }, _attrs))} data-v-aa443296><div class="sot-ob" data-v-aa443296><div class="wrapper flex" data-v-aa443296><div class="login-page flex" data-v-aa443296>`);
  _push(ssrRenderComponent(_component_AuthImageForm, null, null, _parent));
  _push(`<div class="form" data-v-aa443296><p class="small login-p" data-v-aa443296>Войти в аккаунт </p><div class="flex h_sto" data-v-aa443296><div class="login-form auto" data-v-aa443296><div class="error_list" data-v-aa443296>`);
  if ($data.login_401) {
    _push(`<div data-v-aa443296> Нету учетной записи с введенными данными </div>`);
  } else {
    _push(`<!---->`);
  }
  if ($data.message) {
    _push(`<div data-v-aa443296>${ssrInterpolate($data.message)}</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><input type="text" placeholder="username"${ssrRenderAttr("value", $data.username)} data-v-aa443296><input type="password" placeholder="password"${ssrRenderAttr("value", $data.password)} data-v-aa443296><button data-v-aa443296>login</button><p class="message" data-v-aa443296> Not registered? <a href="#" data-v-aa443296>Create an account</a></p></div></div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-aa443296"]]);
export {
  login as default
};
//# sourceMappingURL=login-14061abb.js.map
