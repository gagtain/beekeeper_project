import { _ as _export_sfc, D as DialogWindow, a as _imports_0 } from "../server.mjs";
import { resolveComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr } from "vue/server-renderer";
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
import "axios";
import "defu";
const about_us_vue_vue_type_style_index_0_lang = "";
const _sfc_main = {
  components: {
    DialogWindow
  },
  methods: {
    showData() {
      console.log("asdasd");
      let a = document.getElementById("dialog-data");
      a.showModal();
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_DialogWindow = resolveComponent("DialogWindow");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_DialogWindow, { id: "dialog-data" }, null, _parent));
  _push(`<div class="wrapper-product w-sto flex"><div class="interactiv auto back"><div class="about_us"><div class="flex w-sto"><p class="small-big VAG auto">О нас</p></div><div class="flex w-sto inf"><div class="to_info"><div class="img flex"><img style="${ssrRenderStyle({ "width": "200px", "height": "200px", "margin": "auto" })}"${ssrRenderAttr("src", _imports_0)} alt=""></div><div class="desk m2"><p class="small">Пчелиная артель</p><p class="small">Основатель: Козлов Андрей Викторович</p></div></div><div class="big_info"><p class="small VAG auto">Реквизиты компании</p><p class="normal-small">Название юр. лица: ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ &quot;ТАМБОВСКАЯ ПАСЕКА &quot;ПЧЕЛИНАЯ АРТЕЛЬ&quot;</p><p class="normal-small">ОГРН: 1196820006888</p><p class="normal-small">ИНН: 6830007878</p><p class="small VAG auto">Контакты</p><p class="normal-small">Почтовый адрес: Тамбовская обл, г. Уварово, пер. Большой Садовый, д. 28А</p><p class="normal-small">Номер телефона: 89153502162</p><p class="normal-small">Контактная почта: pcel.artel@gmail.com</p></div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about_us.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const about_us = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  about_us as default
};
//# sourceMappingURL=about_us-2cba4c7e.js.map
