import { _ as __nuxt_component_0 } from './ImageForm-a3b5780e.mjs';
import { reactive, computed, mergeProps, useSSRContext } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, email, minLength, sameAs } from '@vuelidate/validators';
import { _ as _export_sfc, r as redirect, a as api_root } from '../server.mjs';
import axios from 'axios';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
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

async function register$1(data) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/register`,
      method: "post",
      data
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main = {
  el: "#registry",
  data() {
    return {
      width: 0,
      login_img_active: false
    };
  },
  setup() {
    const state = reactive({
      username: {
        label: "\u041B\u043E\u0433\u0438\u043D",
        name: "username",
        value: ""
      },
      FIO: {
        label: "\u0424\u0418\u041E",
        name: "FIO",
        value: ""
      },
      email: {
        label: "\u043F\u043E\u0447\u0442\u0430",
        name: "email",
        value: ""
      },
      password: {
        label: "\u041F\u0430\u0440\u043E\u043B\u044C",
        name: "password",
        value: ""
      },
      password2: {
        label: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u043F\u0430\u0440\u043E\u043B\u044F",
        name: "password2",
        value: ""
      }
    });
    const rules = {
      username: {
        value: {
          required: helpers.withMessage("\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F", required)
        }
      },
      FIO: {
        value: {
          required: helpers.withMessage("\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F", required)
        }
      },
      email: {
        value: {
          required: helpers.withMessage("\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F", required),
          email: helpers.withMessage("\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u043F\u043E\u0447\u0442\u0430", email)
        }
      },
      password: {
        value: {
          minLength: helpers.withMessage("\u0414\u043B\u0438\u043D\u043D\u0430 \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 8-\u043C\u0438 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432", minLength(8)),
          required: helpers.withMessage("\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F", required)
        }
      },
      password2: {
        value: {
          minLength: helpers.withMessage("\u0414\u043B\u0438\u043D\u043D\u0430 \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 8-\u043C\u0438 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432", minLength(8)),
          required: helpers.withMessage("\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F", required),
          sameAsPassword: helpers.withMessage("\u041F\u0430\u0440\u043E\u043B\u0438 \u043D\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442", sameAs(computed(() => state.password.value)))
        }
      }
    };
    const v$ = useVuelidate(rules, state);
    return { state, v$ };
  },
  mounted() {
    this.updateWidth();
    window.addEventListener("resize", this.updateWidth);
  },
  methods: {
    async refisterSubmit(event) {
      this.v$.$touch();
      event.preventDefault();
      if (!this.v$.$error) {
        let response = await register$1(new FormData(document.getElementById("form")));
        if (response.status == 201) {
          console.log("success");
          redirect(this, {
            path: "/profile"
          });
        } else if (response.status == 400) {
          console.log("error");
        } else if (response.status == 404) {
          alert("\u0441\u0430\u0439\u0442 \u043D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435, \u043F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435 5 \u043C\u0438\u043D\u0443\u0442");
        }
      }
      return false;
    },
    updateWidth() {
      this.width = window.innerWidth;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AuthImageForm = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-2a4df219><div class="wrapper flex" data-v-2a4df219><div class="login-page flex" id="registry" data-v-2a4df219>`);
  _push(ssrRenderComponent(_component_AuthImageForm, null, null, _parent));
  _push(`<div class="form" data-v-2a4df219><p class="small login-p" data-v-2a4df219>\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442</p><div class="flex h_sto" data-v-2a4df219><form class="register-form auto" id="form" data-v-2a4df219><div class="error_list" data-v-2a4df219><!--[-->`);
  ssrRenderList($setup.v$.username.value.$errors, (element) => {
    _push(`<div data-v-2a4df219>${ssrInterpolate(element.$message)}</div>`);
  });
  _push(`<!--]--></div><input type="text"${ssrRenderAttr("placeholder", $setup.state.username.label)}${ssrRenderAttr("name", $setup.state.username.name)}${ssrRenderAttr("value", $setup.v$.username.value.$model)} data-v-2a4df219><div class="error_list" data-v-2a4df219><!--[-->`);
  ssrRenderList($setup.v$.FIO.value.$errors, (element) => {
    _push(`<div data-v-2a4df219>${ssrInterpolate(element.$message)}</div>`);
  });
  _push(`<!--]--></div><input type="text"${ssrRenderAttr("placeholder", $setup.state.FIO.label)}${ssrRenderAttr("name", $setup.state.FIO.name)}${ssrRenderAttr("value", $setup.v$.FIO.value.$model)} data-v-2a4df219><div class="error_list" data-v-2a4df219><!--[-->`);
  ssrRenderList($setup.v$.email.value.$errors, (element) => {
    _push(`<div data-v-2a4df219>${ssrInterpolate(element.$message)}</div>`);
  });
  _push(`<!--]--></div><input type="text"${ssrRenderAttr("placeholder", $setup.state.email.label)}${ssrRenderAttr("name", $setup.state.email.name)}${ssrRenderAttr("value", $setup.v$.email.value.$model)} data-v-2a4df219><div class="error_list" data-v-2a4df219><!--[-->`);
  ssrRenderList($setup.v$.password.value.$errors, (element) => {
    _push(`<div data-v-2a4df219>${ssrInterpolate(element.$message)}</div>`);
  });
  _push(`<!--]--></div><input type="text"${ssrRenderAttr("placeholder", $setup.state.password.label)}${ssrRenderAttr("name", $setup.state.password.name)}${ssrRenderAttr("value", $setup.v$.password.value.$model)} data-v-2a4df219><div class="error_list flex jus-sp-ar" data-v-2a4df219><!--[-->`);
  ssrRenderList($setup.v$.password2.value.$errors, (element) => {
    _push(`<div data-v-2a4df219>${ssrInterpolate(element.$message)}</div>`);
  });
  _push(`<!--]--></div><input type="text"${ssrRenderAttr("placeholder", $setup.state.password2.label)}${ssrRenderAttr("name", $setup.state.password2.name)}${ssrRenderAttr("value", $setup.v$.password2.value.$model)} data-v-2a4df219><button data-v-2a4df219>create</button><p class="message" data-v-2a4df219>Already registered? <a href="#" data-v-2a4df219>Sign In</a></p></form></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const register = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-2a4df219"]]);

export { register as default };
//# sourceMappingURL=register-c63012a2.mjs.map
