import { _ as _export_sfc, D as DialogWindow, a as _imports_0$1 } from '../server.mjs';
import { g as getTextList } from './getTexts-bf5b12db.mjs';
import { resolveComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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
import 'axios';
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

const _sfc_main = {
  components: {
    DialogWindow
  },
  data() {
    return {
      data_text_list: []
    };
  },
  async mounted() {
    let r_ = await getTextList();
    this.data_text_list = r_.data;
  },
  methods: {
    get_obj_text(type, field) {
      let obj = this.data_text_list.filter((f) => f.type == type);
      console.log(obj[field], obj);
      try {
        return obj[0][field];
      } catch {
        return "";
      }
    },
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
  _push(`<div class="wrapper-product w-sto flex"><div class="interactiv auto back"><div class="about_us"><div class="flex w-sto"><p class="small-big VAG auto">\u041E \u043D\u0430\u0441</p></div><div class="flex w-sto inf"><div class="to_info"><div class="img flex"><img style="${ssrRenderStyle({ "width": "200px", "height": "200px", "margin": "auto" })}"${ssrRenderAttr("src", _imports_0$1)} alt=""></div><div class="desk m2"><p class="small">\u041F\u0447\u0435\u043B\u0438\u043D\u0430\u044F \u0430\u0440\u0442\u0435\u043B\u044C</p><p class="small">\u041E\u0441\u043D\u043E\u0432\u0430\u0442\u0435\u043B\u044C: ${ssrInterpolate($options.get_obj_text("5", "director"))}</p></div></div><div class="big_info"><p class="small VAG auto">\u0420\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438</p><p class="normal-small">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u044E\u0440. \u043B\u0438\u0446\u0430: \u041E\u0411\u0429\u0415\u0421\u0422\u0412\u041E \u0421 \u041E\u0413\u0420\u0410\u041D\u0418\u0427\u0415\u041D\u041D\u041E\u0419 \u041E\u0422\u0412\u0415\u0422\u0421\u0422\u0412\u0415\u041D\u041D\u041E\u0421\u0422\u042C\u042E &quot;\u0422\u0410\u041C\u0411\u041E\u0412\u0421\u041A\u0410\u042F \u041F\u0410\u0421\u0415\u041A\u0410 &quot;\u041F\u0427\u0415\u041B\u0418\u041D\u0410\u042F \u0410\u0420\u0422\u0415\u041B\u042C&quot;</p><p class="normal-small">\u041E\u0413\u0420\u041D: 1196820006888</p><p class="normal-small">\u0418\u041D\u041D: 6830007878</p><p class="small VAG auto">\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B</p><p class="normal-small">\u041F\u043E\u0447\u0442\u043E\u0432\u044B\u0439 \u0430\u0434\u0440\u0435\u0441: \u0422\u0430\u043C\u0431\u043E\u0432\u0441\u043A\u0430\u044F \u043E\u0431\u043B, \u0433. \u0423\u0432\u0430\u0440\u043E\u0432\u043E, \u043F\u0435\u0440. \u0411\u043E\u043B\u044C\u0448\u043E\u0439 \u0421\u0430\u0434\u043E\u0432\u044B\u0439, \u0434. 28\u0410</p><p class="normal-small">\u041D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430: ${ssrInterpolate($options.get_obj_text("5", "number"))}</p><p class="normal-small">\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u0430\u044F \u043F\u043E\u0447\u0442\u0430: ${ssrInterpolate($options.get_obj_text("5", "email"))}</p></div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about_us.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const about_us = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { about_us as default };
//# sourceMappingURL=about_us-9e69cd74.mjs.map
