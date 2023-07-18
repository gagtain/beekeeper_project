import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
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
const news_vue_vue_type_style_index_0_lang = "";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-fluid" }, _attrs))}><div class="row"><div class="col-md-4 col-lg-3 navbar-container bg-light"><nav class="navbar navbar-expand-md navbar-light"><a class="navbar-brand" href="#">Navbar</a><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navbar"><ul class="navbar-nav"><li class="nav-item"><a class="nav-link" href="#link-1">Ссылка 1</a></li><li class="nav-item"><a class="nav-link" href="#link-2">Ссылка 2</a></li><li class="nav-item"><a class="nav-link" href="#link-3">Ссылка 3</a></li><li class="nav-item"><a class="nav-link" href="#link-4">Ссылка 4</a></li><li class="nav-item"><a class="nav-link" href="#link-5">Ссылка 5</a></li></ul></div></nav></div><div class="col-md-8 col-lg-9 content-container" style="${ssrRenderStyle({ "background-color": "#ffe0b2" })}"> ... </div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/news.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const news = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  news as default
};
//# sourceMappingURL=news-c38eb214.js.map
