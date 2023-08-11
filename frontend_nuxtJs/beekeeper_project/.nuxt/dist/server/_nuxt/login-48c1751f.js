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
const login_scss_vue_type_style_index_0_src_4d926333_scoped_4d926333_lang = "";
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
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "login_main" }, _attrs))} data-v-4d926333><div class="sot-ob" data-v-4d926333><div class="wrapper flex" data-v-4d926333><div class="login-page flex" data-v-4d926333>`);
  _push(ssrRenderComponent(_component_AuthImageForm, null, null, _parent));
  _push(`<div class="form" data-v-4d926333><p class="small login-p" data-v-4d926333>Войти в аккаунт</p><div class="flex h_sto" data-v-4d926333><div class="login-form auto" data-v-4d926333><div class="error_list" data-v-4d926333>`);
  if ($data.login_401) {
    _push(`<div data-v-4d926333> Нету учетной записи с введенными данными </div>`);
  } else {
    _push(`<!---->`);
  }
  if ($data.message) {
    _push(`<div data-v-4d926333>${ssrInterpolate($data.message)}</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><input type="text" placeholder="username"${ssrRenderAttr("value", $data.username)} data-v-4d926333><input type="password" placeholder="password"${ssrRenderAttr("value", $data.password)} data-v-4d926333><button data-v-4d926333>login</button><p class="message" data-v-4d926333> Not registered? <a href="#" data-v-4d926333>Create an account</a></p></div></div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-4d926333"]]);
export {
  login as default
};
//# sourceMappingURL=login-48c1751f.js.map
