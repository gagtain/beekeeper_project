import { _ as __nuxt_component_0 } from "./ImageForm-b2aae3d6.js";
import { reactive, computed, mergeProps, useSSRContext } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { helpers, required, email, minLength, sameAs } from "@vuelidate/validators";
import { b as api_root, _ as _export_sfc, u as useHead, r as redirect } from "../server.mjs";
import axios from "axios";
import "hookable";
import "destr";
import "devalue";
import "klona";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
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
async function register$1(data) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/user/register`,
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
const login_scss_vue_type_style_index_0_src_d31c2d28_scoped_d31c2d28_lang = "";
const _sfc_main = {
  el: "#registry",
  data() {
    return {
      width: 0,
      login_img_active: false
    };
  },
  setup() {
    useHead({
      title: "Пчелиная артель - Регистрация",
      meta: [
        { name: "description", content: "My amazing site." }
      ]
    });
    const state = reactive({
      username: {
        label: "Логин",
        name: "username",
        value: ""
      },
      FIO: {
        label: "ФИО",
        name: "FIO",
        value: ""
      },
      email: {
        label: "почта",
        name: "email",
        value: ""
      },
      password: {
        label: "Пароль",
        name: "password",
        value: ""
      },
      password2: {
        label: "Подтверждение пароля",
        name: "password2",
        value: ""
      }
    });
    const rules = {
      username: {
        value: {
          required: helpers.withMessage("Требуется", required)
        }
      },
      FIO: {
        value: {
          required: helpers.withMessage("Требуется", required)
        }
      },
      email: {
        value: {
          required: helpers.withMessage("Требуется", required),
          email: helpers.withMessage("Неверная почта", email)
        }
      },
      password: {
        value: {
          minLength: helpers.withMessage("Длинна не менее 8-ми символов", minLength(8)),
          required: helpers.withMessage("Требуется", required)
        }
      },
      password2: {
        value: {
          minLength: helpers.withMessage("Длинна не менее 8-ми символов", minLength(8)),
          required: helpers.withMessage("Требуется", required),
          sameAsPassword: helpers.withMessage("Пароли не совпадают", sameAs(computed(() => state.password.value)))
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
          alert("сайт на проверке, подождите 5 минут");
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
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-d31c2d28><div class="wrapper flex" data-v-d31c2d28><div class="login-page flex" id="registry" data-v-d31c2d28>`);
  _push(ssrRenderComponent(_component_AuthImageForm, null, null, _parent));
  _push(`<div class="form" data-v-d31c2d28><p class="small login-p" data-v-d31c2d28>Создать аккаунт</p><div class="flex h_sto" data-v-d31c2d28><form class="register-form auto" id="form" data-v-d31c2d28><div class="error_list" data-v-d31c2d28><!--[-->`);
  ssrRenderList($setup.v$.username.value.$errors, (element) => {
    _push(`<div data-v-d31c2d28>${ssrInterpolate(element.$message)}</div>`);
  });
  _push(`<!--]--></div><input type="text"${ssrRenderAttr("placeholder", $setup.state.username.label)}${ssrRenderAttr("name", $setup.state.username.name)}${ssrRenderAttr("value", $setup.v$.username.value.$model)} data-v-d31c2d28><div class="error_list" data-v-d31c2d28><!--[-->`);
  ssrRenderList($setup.v$.FIO.value.$errors, (element) => {
    _push(`<div data-v-d31c2d28>${ssrInterpolate(element.$message)}</div>`);
  });
  _push(`<!--]--></div><input type="text"${ssrRenderAttr("placeholder", $setup.state.FIO.label)}${ssrRenderAttr("name", $setup.state.FIO.name)}${ssrRenderAttr("value", $setup.v$.FIO.value.$model)} data-v-d31c2d28><div class="error_list" data-v-d31c2d28><!--[-->`);
  ssrRenderList($setup.v$.email.value.$errors, (element) => {
    _push(`<div data-v-d31c2d28>${ssrInterpolate(element.$message)}</div>`);
  });
  _push(`<!--]--></div><input type="text"${ssrRenderAttr("placeholder", $setup.state.email.label)}${ssrRenderAttr("name", $setup.state.email.name)}${ssrRenderAttr("value", $setup.v$.email.value.$model)} data-v-d31c2d28><div class="error_list" data-v-d31c2d28><!--[-->`);
  ssrRenderList($setup.v$.password.value.$errors, (element) => {
    _push(`<div data-v-d31c2d28>${ssrInterpolate(element.$message)}</div>`);
  });
  _push(`<!--]--></div><input type="text"${ssrRenderAttr("placeholder", $setup.state.password.label)}${ssrRenderAttr("name", $setup.state.password.name)}${ssrRenderAttr("value", $setup.v$.password.value.$model)} data-v-d31c2d28><div class="error_list flex jus-sp-ar" data-v-d31c2d28><!--[-->`);
  ssrRenderList($setup.v$.password2.value.$errors, (element) => {
    _push(`<div data-v-d31c2d28>${ssrInterpolate(element.$message)}</div>`);
  });
  _push(`<!--]--></div><input type="text"${ssrRenderAttr("placeholder", $setup.state.password2.label)}${ssrRenderAttr("name", $setup.state.password2.name)}${ssrRenderAttr("value", $setup.v$.password2.value.$model)} data-v-d31c2d28><button data-v-d31c2d28>create</button><p class="message" data-v-d31c2d28>Already registered? <a href="#" data-v-d31c2d28>Sign In</a></p></form></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const register = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-d31c2d28"]]);
export {
  register as default
};
//# sourceMappingURL=register-9c1506e6.js.map
