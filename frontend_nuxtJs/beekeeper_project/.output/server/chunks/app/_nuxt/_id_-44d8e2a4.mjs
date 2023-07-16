import { resolveComponent, mergeProps, useSSRContext } from 'vue';
import { _ as _export_sfc, a as api_root, u as useCookie } from '../server.mjs';
import axios from 'axios';
import { L as LoadingComp } from './LoadingComp-34c86e82.mjs';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/news/${id}`,
      method: "get",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main = {
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
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_loading_comp = resolveComponent("loading-comp");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-a3996713><div class="wrapper flex w-sto" data-v-a3996713><div class="interactiv auto back" data-v-a3996713><div class="flex w-sto product_div" data-v-a3996713>`);
  if ($data.news != null) {
    _push(`<div class="card w-sto" data-v-a3996713><div class="card-header VAG small" style="${ssrRenderStyle({ "text-align": "center" })}" data-v-a3996713>${ssrInterpolate($data.news.title)}</div><div class="card-body" data-v-a3996713>${$data.news.context}</div></div>`);
  } else {
    _push(ssrRenderComponent(_component_loading_comp, null, null, _parent));
  }
  _push(`</div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-a3996713"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-44d8e2a4.mjs.map
