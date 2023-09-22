import { _ as __nuxt_component_0 } from './ImageForm-b2aae3d6.mjs';
import axios from 'axios';
import { _ as _export_sfc, u as useHead, b as api_root } from '../server.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
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
import 'ipx';

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
async function set_token(data) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/user/set_token`,
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
const _sfc_main = {
  el: "#login_main",
  data() {
    return {
      username: "",
      password: "",
      login_401: false,
      message: null,
      is_code: false,
      code: ""
    };
  },
  methods: {
    async login_request(event) {
      var _a;
      if (this.is_code) {
        let obj = {
          username: this.username,
          password: this.password,
          token: this.code
        };
        let response = await login$1(obj);
        this.default_check_status_login(response);
      } else {
        let obj = {
          username: this.username,
          password: this.password
        };
        let response = await login$1(obj);
        if ((response == null ? void 0 : response.status) == 400 && ((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.error) == "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E \u043F\u043E\u043B\u0435 token") {
          await set_token({
            "username": this.username,
            "password": this.password
          });
          this.is_code = true;
        } else {
          this.default_check_status_login(response);
        }
      }
    },
    async default_check_status_login(response) {
      if (response.status == 200) {
        await this.$router.push("/profile");
      } else if (response.status == 401) {
        this.login_401 = true;
      } else if (response == 404) {
        alert("\u0441\u0430\u0439\u0442 \u043D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435, \u043F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435 5 \u043C\u0438\u043D\u0443\u0442");
      }
    }
  },
  mounted() {
    this.message = this.$route.query.message;
  },
  setup() {
    useHead({
      title: "\u041F\u0447\u0435\u043B\u0438\u043D\u0430\u044F \u0430\u0440\u0442\u0435\u043B\u044C - \u0412\u0445\u043E\u0434",
      meta: [
        { name: "description", content: "My amazing site." }
      ]
    });
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AuthImageForm = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "login_main" }, _attrs))} data-v-18aed2fd><div class="sot-ob" data-v-18aed2fd><div class="wrapper flex" data-v-18aed2fd><div class="login-page flex" data-v-18aed2fd>`);
  _push(ssrRenderComponent(_component_AuthImageForm, null, null, _parent));
  _push(`<div class="form" data-v-18aed2fd><p class="small login-p" data-v-18aed2fd>\u0412\u043E\u0439\u0442\u0438 \u0432 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 </p><div class="flex h_sto" data-v-18aed2fd><div class="login-form auto" data-v-18aed2fd><div class="error_list" data-v-18aed2fd>`);
  if ($data.login_401) {
    _push(`<div data-v-18aed2fd> \u041D\u0435\u0442\u0443 \u0443\u0447\u0435\u0442\u043D\u043E\u0439 \u0437\u0430\u043F\u0438\u0441\u0438 \u0441 \u0432\u0432\u0435\u0434\u0435\u043D\u043D\u044B\u043C\u0438 \u0434\u0430\u043D\u043D\u044B\u043C\u0438 </div>`);
  } else {
    _push(`<!---->`);
  }
  if ($data.message) {
    _push(`<div data-v-18aed2fd>${ssrInterpolate($data.message)}</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
  if (!$data.is_code) {
    _push(`<input type="text" placeholder="username"${ssrRenderAttr("value", $data.username)} data-v-18aed2fd>`);
  } else {
    _push(`<!---->`);
  }
  if (!$data.is_code) {
    _push(`<input type="password" placeholder="password"${ssrRenderAttr("value", $data.password)} data-v-18aed2fd>`);
  } else {
    _push(`<div data-v-18aed2fd><p data-v-18aed2fd>\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0439 \u0432\u0430\u043C \u043A\u043E\u0434</p><input type="text" placeholder="code"${ssrRenderAttr("value", $data.code)} data-v-18aed2fd></div>`);
  }
  _push(`<button data-v-18aed2fd>login</button><p class="message" data-v-18aed2fd> Not registered? <a href="#" data-v-18aed2fd>Create an account</a></p></div></div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-18aed2fd"]]);

export { login as default };
//# sourceMappingURL=login-017335ee.mjs.map
