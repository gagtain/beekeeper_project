import { useSSRContext, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import axios from 'axios';
import { _ as _export_sfc, u as useHead, a as api_root } from '../server.mjs';
import { L as LoadingComp } from './LoadingComp-34c86e82.mjs';
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

async function newsGet(id) {
  console.log(123);
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/news/${id}`,
      method: "get",
      headers: {},
      withCredentials: true
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const __default__ = {
  components: { LoadingComp },
  data() {
    return {
      news: null
    };
  },
  async created() {
    let r = await newsGet(this.$route.params.id);
    let data = r.data;
    data.context = data.context.replace('src="', `src="${this.$api_root}media/`);
    console.log(data);
    this.news = data;
    console.log(this.news);
    let width = window.screen.width;
    if (width <= 900) {
      data.context = data.context.replace(/width: \d{1,2}%/, `width: 100%`);
    }
    useHead({
      title: `\u041F\u0447\u0435\u043B\u0438\u043D\u0430\u044F \u0430\u0440\u0442\u0435\u043B\u044C - \u041D\u043E\u0432\u043E\u0441\u0442\u044C ${this.news.title}`
    });
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "\u041F\u0447\u0435\u043B\u0438\u043D\u0430\u044F \u0430\u0440\u0442\u0435\u043B\u044C - \u041D\u043E\u0432\u043E\u0441\u0442\u044C"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-349b28b4><div class="wrapper flex w-sto" data-v-349b28b4><div class="interactiv auto back" data-v-349b28b4><div class="flex w-sto product_div" data-v-349b28b4>`);
      if (_ctx.news != null) {
        _push(`<div class="card w-sto" data-v-349b28b4><div class="card-header VAG small" style="${ssrRenderStyle({ "text-align": "center" })}" data-v-349b28b4>${ssrInterpolate(_ctx.news.title)}</div><div class="card-body" data-v-349b28b4>${_ctx.news.context}</div></div>`);
      } else {
        _push(ssrRenderComponent(LoadingComp, null, null, _parent));
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-349b28b4"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-9fda4313.mjs.map
