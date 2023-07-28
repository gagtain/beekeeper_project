import axios from 'axios';
import { a as api_root } from './main-cf4969ae.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
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

async function newsCreate(id) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/news/${id}`,
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
  async mounted() {
    let r = await newsCreate(this.$route.params.id);
    let data = r.data;
    try {
      data.context = data.context.replace('src="', `src="${this.$api_root}media/`);
      console.log(data.context);
      let width = window.screen.width;
      if (width <= 900) {
        data.context = data.context.replace(/width: \d{1,2}%/, "width: 100%");
      }
    } catch {
    }
    this.news = data;
    console.log(this.news);
  },
  data() {
    return {
      news: null
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  if ($data.news) {
    _push(`<div${ssrRenderAttrs(mergeProps({
      class: "news_container",
      style: { "padding": "3%" }
    }, _attrs))} data-v-17f537d6><h1 class="news_title" data-v-17f537d6>${ssrInterpolate($data.news.title)}</h1><br data-v-17f537d6><p class="news_text" data-v-17f537d6>${$data.news.context}</p></div>`);
  } else {
    _push(`<!---->`);
  }
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/news/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-17f537d6"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-77943725.mjs.map
