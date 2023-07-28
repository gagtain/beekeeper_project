import { _ as _export_sfc, a as __nuxt_component_0$2 } from '../server.mjs';
import axios from 'axios';
import { a as api_root } from './main-cf4969ae.mjs';
import { withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
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
      news: null,
      maxLength: 30
    };
  },
  async mounted() {
    let r = await newsGetList(0, 10);
    this.news = r.data;
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$2;
  if ($data.news) {
    _push(`<div${ssrRenderAttrs(_attrs)} data-v-c1ecafc5><section class="grid" data-v-c1ecafc5><article style="${ssrRenderStyle({ "padding": "3%", "display": "flex", "height": "auto", "min-height": "300px" })}" data-v-c1ecafc5><div class="container" data-v-c1ecafc5><h4 class="main_news_title" data-v-c1ecafc5>${ssrInterpolate($data.news[0].title)}</h4><br data-v-c1ecafc5><p class="main_element" data-v-c1ecafc5>${ssrInterpolate($data.news[0].main_text)}</p><div class="button" data-v-c1ecafc5>`);
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: "/admin/news/" + $data.news[0].id
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button class="btn" data-v-c1ecafc5${_scopeId}><span data-v-c1ecafc5${_scopeId}>\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435</span></button>`);
        } else {
          return [
            createVNode("button", { class: "btn" }, [
              createVNode("span", null, "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435")
            ])
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div></div></article><!--[-->`);
    ssrRenderList($data.news.slice(1), (news_item) => {
      _push(`<article style="${ssrRenderStyle({ "display": "block", "height": "auto", "padding": "3%" })}" data-v-c1ecafc5><div class="container" data-v-c1ecafc5><h4 class="news_title" data-v-c1ecafc5>${ssrInterpolate(news_item.title)}</h4><br data-v-c1ecafc5><p class="element" data-v-c1ecafc5>${ssrInterpolate(news_item.main_text.slice(0, 300))}...</p><div class="button" data-v-c1ecafc5>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "/admin/news/" + news_item.id
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="btn" data-v-c1ecafc5${_scopeId}><span data-v-c1ecafc5${_scopeId}>\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435</span></button>`);
          } else {
            return [
              createVNode("button", { class: "btn" }, [
                createVNode("span", null, "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435")
              ])
            ];
          }
        }),
        _: 2
      }, _parent));
      _push(`</div></div></article>`);
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
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-c1ecafc5"]]);

export { index as default };
//# sourceMappingURL=index-1c5dd9ee.mjs.map
