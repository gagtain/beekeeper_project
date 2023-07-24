import axios from 'axios';
import { a as api_root } from './main-cf4969ae.mjs';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { useSSRContext } from 'vue';
import { _ as _export_sfc } from '../server.mjs';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import 'ufo';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'defu';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'klona';
import 'ohash';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'http-graceful-shutdown';

async function newsGetList(from, size) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/news/list?size=${size}&from=${from}`,
      method: "get",
      headers: {
        //     "Authorization": `Bearer ${useCookie('assess').value}`
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main = {
  data() {
    return {
      news: null
    };
  },
  async mounted() {
    let r = await newsGetList(0, 10);
    this.news = r.data;
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  if ($data.news) {
    _push(`<div${ssrRenderAttrs(_attrs)} data-v-443da084><section class="grid" data-v-443da084><article style="${ssrRenderStyle({ "padding": "3%", "display": "flex", "height": "auto", "min-height": "300px" })}" data-v-443da084><p data-v-443da084>\u041F\u0440\u0438\u0432\u0435\u0442 ${ssrInterpolate($data.news[0].id)}</p></article><!--[-->`);
    ssrRenderList($data.news, (news_item) => {
      _push(`<article style="${ssrRenderStyle({ "display": "block", "height": "auto" })}" data-v-443da084><p class="news_title" data-v-443da084>${ssrInterpolate(news_item.title)}</p><p data-v-443da084>${ssrInterpolate(_ctx.$api_root + news_item.main_image)}</p><div data-v-443da084>${news_item.context}</div><button class="btn" data-v-443da084>\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435</button></article>`);
    });
    _push(`<!--]--></section></div>`);
  } else {
    _push(`<!---->`);
  }
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/news/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-443da084"]]);

export { index as default };
//# sourceMappingURL=index-6fc8d842.mjs.map
