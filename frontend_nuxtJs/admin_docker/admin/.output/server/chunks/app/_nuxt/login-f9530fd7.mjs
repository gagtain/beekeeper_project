import axios from 'axios';
import { _ as _export_sfc, b as api_root } from '../server.mjs';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { useSSRContext } from 'vue';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import 'ufo';
import 'cookie-es';
import 'destr';
import 'ohash';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
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
import 'http-graceful-shutdown';

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
  data() {
    return {
      username: null,
      password: null,
      error: false,
      is_code: false,
      code: ""
    };
  },
  methods: {
    async validation() {
      var _a;
      if (this.is_code) {
        let log_result = await login$1({
          "username": this.username,
          "password": this.password,
          "is_admin": true,
          "token": this.code
        });
        if (log_result.status == 200) {
          this.$router.push("/admin");
        } else {
          this.error = true;
        }
      } else {
        let log_result = await login$1({
          "username": this.username,
          "password": this.password,
          "is_admin": true
        });
        if ((log_result == null ? void 0 : log_result.status) == 400 && ((_a = log_result == null ? void 0 : log_result.data) == null ? void 0 : _a.error) == "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E \u043F\u043E\u043B\u0435 token") {
          await set_token({
            "username": this.username,
            "password": this.password
          });
          this.is_code = true;
        } else if (log_result.status == 200) {
          this.$router.push("/admin");
        } else {
          this.error = true;
        }
      }
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<body${ssrRenderAttrs(_attrs)} data-v-b17522c6><div class="login" data-v-b17522c6><div class="login-screen" data-v-b17522c6><div class="app-title" data-v-b17522c6><h1 data-v-b17522c6>Login</h1>`);
  if ($data.error) {
    _push(`<p class="form-error" data-v-b17522c6>\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435</p>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="login-form" data-v-b17522c6>`);
  if (!$data.is_code) {
    _push(`<div class="control-group" data-v-b17522c6><input${ssrRenderAttr("value", $data.username)} type="text" class="login-field" placeholder="username" id="login-name" data-v-b17522c6><label class="login-field-icon fui-user" for="login-name" data-v-b17522c6></label></div>`);
  } else {
    _push(`<!---->`);
  }
  if (!$data.is_code) {
    _push(`<div class="control-group" data-v-b17522c6><input${ssrRenderAttr("value", $data.password)} type="password" class="login-field" placeholder="password" id="login-pass" data-v-b17522c6><label class="login-field-icon fui-lock" for="login-pass" data-v-b17522c6></label></div>`);
  } else {
    _push(`<div class="control-group" data-v-b17522c6><input${ssrRenderAttr("value", $data.code)} type="text" class="login-field" placeholder="code" id="login-pass" data-v-b17522c6><label class="login-field-icon fui-lock" for="login-pass" data-v-b17522c6></label></div>`);
  }
  _push(`<a class="btn btn-primary btn-large btn-block" data-v-b17522c6>login</a></div></div></div></body>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-b17522c6"]]);

export { login as default };
//# sourceMappingURL=login-f9530fd7.mjs.map
