import { b as buildAssetsURL } from '../../handlers/renderer.mjs';
import { _ as _export_sfc, u as useHead, e as __nuxt_component_0$1, a as api_root, b as useCookie } from '../server.mjs';
import { useSSRContext, mergeProps, withCtx, createVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import axios from 'axios';
import { C as CatalogProduct } from './CatalogProduct-ec41acc4.mjs';
import { L as LoadingComp } from './LoadingComp-34c86e82.mjs';
import 'vue-bundle-renderer/runtime';
import 'h3';
import 'devalue';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'ofetch';
import 'unenv/runtime/fetch/index';
import 'hookable';
import 'scule';
import 'klona';
import 'defu';
import 'ohash';
import 'ufo';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'unctx';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'cookie-es';
import './FavoriteComp-5b75aa9c.mjs';

const _imports_0 = "" + buildAssetsURL("filter.b252e476.png");
async function getProductList(size) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/product?size=${size}`,
      method: "get",
      headers: {},
      withCredentials: true
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
async function getCategoryList() {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/category`,
      method: "get",
      headers: {
        "Authorization": useCookie("assess").value != void 0 ? `Bearer ${useCookie("assess").value}` : void 0
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main$2 = {
  el: "#filter",
  name: "FilterCatalog",
  data() {
    return {
      filter_catalog: [],
      filter_class_name: [],
      filter_packaging_name: [],
      cat_list: [],
      category_list: []
    };
  },
  async mounted() {
    let r = await getCategoryList();
    this.category_list = r.data;
  },
  methods: {
    add(event, params) {
      if (this.addClassActive(event.srcElement)) {
        this.$store.ADD_CATALOG_PARAMS(params);
      } else {
        this.$store.REMOVE_CATALOG_PARAMS(params);
      }
    },
    addClassActive(event) {
      console.log(event);
      if (event.classList.contains("active")) {
        event.classList.remove("active");
        return false;
      } else {
        event.classList.add("active");
        return true;
      }
    }
  },
  setup() {
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "filter" }, _attrs))} data-v-cfe92613><p class="filter-p small" data-v-cfe92613>\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F</p><ul class="filter-ul" data-v-cfe92613><!--[-->`);
  ssrRenderList($data.category_list, (cat, index) => {
    _push(`<li class="filter-li normal-small" data-v-cfe92613>${ssrInterpolate(cat.name)}</li>`);
  });
  _push(`<!--]--></ul></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Catalog/FilterCatalog.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const FilterCatalog = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-cfe92613"]]);
const _sfc_main$1 = {
  el: "#sorted",
  name: "SortedCatalog",
  data() {
    return {
      sorted_list: [],
      sorteredAlf: false,
      sorteredMonet: false,
      sorteredNew: false
    };
  },
  props: ["catalog_list"],
  methods: {
    async sorteredAlfFunc() {
      this.$store.ADD_ORDER_BY_CATALOG_PARAMS("order_by=name", ["order_by=price_min", "order_by=pk"]);
      this.sorteredAlf = !this.sorteredAlf;
      this.sorteredMonet = false;
      this.sorteredNew = false;
    },
    async sorteredMoneyFUnc() {
      this.$store.ADD_ORDER_BY_CATALOG_PARAMS("order_by=price_min", ["order_by=name", "order_by=pk"]);
      this.sorteredMonet = !this.sorteredMonet;
      this.sorteredAlf = false;
      this.sorteredNew = false;
    },
    async sorteredNewFUnc() {
      this.$store.ADD_ORDER_BY_CATALOG_PARAMS("order_by=pk", ["order_by=name", "order_by=price_min"]);
      this.sorteredNew = !this.sorteredNew;
      this.sorteredMonet = false;
      this.sorteredAlf = false;
    }
  },
  setup() {
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "sorted-product flex jus-sp",
    id: "sorted"
  }, _attrs))} data-v-96beec27><p class="${ssrRenderClass([$data.sorteredAlf ? "act_sorted-p" : "", "sorted-p small"])}" data-v-96beec27> \u041F\u043E \u0438\u043C\u0435\u043D\u0438 </p><p class="${ssrRenderClass([$data.sorteredMonet ? "act_sorted-p" : "", "sorted-p small"])}" data-v-96beec27> \u041F\u043E \u0446\u0435\u043D\u0435 </p><p class="${ssrRenderClass([$data.sorteredNew ? "act_sorted-p" : "", "sorted-p small"])}" data-v-96beec27> \u041D\u043E\u0432\u043E\u0435 </p></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Catalog/SortedCatalog.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const SortedCatalog = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-96beec27"]]);
async function getSearchProduct(params) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/product/search?${params}`,
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
  el: "#catalog",
  name: "CatalogItem",
  components: {
    FilterCatalog,
    SortedCatalog,
    CatalogProduct,
    LoadingComp
  },
  data() {
    return {
      catalog_list: [],
      filter_teleport: false,
      category_list: [],
      type_packaging: [],
      CATALOG_LIST_STATE: this.$store.getCatalog_list,
      filters: false,
      catalog_loads: false,
      data: this.$store.getCatalog_params
    };
  },
  async mounted() {
    if (this.$route.query.filter) {
      this.$store.ADD_CATALOG_PARAMS(`name=${JSON.parse(this.$route.query.filter).name}`);
    } else {
      this.getCatalog();
    }
  },
  methods: {
    async clear_filter() {
      await this.$router.replace({ "query": null });
      this.$store.CLEAR_CATALOG_PARAMS();
      this.getCatalog();
      this.data = this.$store.getCatalog_params;
    },
    async restartCatalog() {
      var _a;
      this.catalog_loads = false;
      let catalog_response = null;
      if ((_a = this.$route.query) == null ? void 0 : _a.filter) {
        catalog_response = await getSearchProduct(`name=${JSON.parse(this.$route.query.filter).name}`);
        this.filters = true;
      } else {
        catalog_response = await getProductList(50);
      }
      console.log(catalog_response, 342);
      this.catalog_list = catalog_response.data;
      this.catalog_list_sorted = this.catalog_list.slice();
      this.$store.REFACTOR_CATALOG_LIST(this.catalog_list);
      this.catalog_loads = true;
    },
    async filterReg() {
      let category_response = await getCategoryList();
      this.category_list = category_response.data;
    },
    async getCatalog() {
      this.catalog_loads = false;
      let r = await getSearchProduct(this.$store.getCatalog_params.join("&"));
      this.catalog_list = r.data;
      this.catalog_loads = true;
    }
  },
  watch: {
    "$route.query": async function() {
      if (this.$route.query.filter) {
        this.$store.ADD_CATALOG_PARAMS(`name=${JSON.parse(this.$route.query.filter).name}`);
      }
    },
    data: {
      handler(val, oldVal) {
        console.log(213);
        this.getCatalog();
      },
      deep: true
    }
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "\u041F\u0447\u0435\u043B\u0438\u043D\u0430\u044F \u0430\u0440\u0442\u0435\u043B\u044C - \u041A\u0430\u0442\u0430\u043B\u043E\u0433"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "catalog" }, _attrs))} data-v-0112214e><div class="absolute flex w-sto h_sto" style="${ssrRenderStyle({ "pointer-events": "none" })}" data-v-0112214e><dialog id="dialog" class="absolute auto" style="${ssrRenderStyle({ "pointer-events": "auto" })}" data-v-0112214e>`);
      _push(ssrRenderComponent(FilterCatalog, {
        category_list: _ctx.category_list,
        catalog_list: _ctx.catalog_list,
        onUpdateClassFiler: _ctx.filterClassReg
      }, null, _parent));
      _push(`<button class="btn w-sto btn-green" onclick="window.dialog.close();" data-v-0112214e>\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C</button><button onclick="window.dialog.close();" aria-label="close" class="x" data-v-0112214e> \u274C </button></dialog></div><div class="sot-ob" data-v-0112214e><div class="wrapper-product w-sto flex" data-v-0112214e><div class="interactiv auto back" data-v-0112214e>`);
      if (_ctx.$route.query.filter) {
        _push(`<p style="${ssrRenderStyle({ "margin-left": "5%" })}" class="small" data-v-0112214e>${ssrInterpolate(JSON.parse(_ctx.$route.query.filter).name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex w-sto product_div" data-v-0112214e><div class="block filter_div" data-v-0112214e><div class="filter-product" id="filter_desk" data-v-0112214e>`);
      _push(ssrRenderComponent(FilterCatalog, {
        category_list: _ctx.category_list,
        catalog_list: _ctx.catalog_list
      }, null, _parent));
      _push(`</div></div><div class="product_osnov relative" data-v-0112214e><div class="sorted_div flex jus-sp" data-v-0112214e>`);
      _push(ssrRenderComponent(SortedCatalog, { catalog_list: _ctx.catalog_list }, null, _parent));
      _push(`<div class="mob_filter flex" data-v-0112214e><img onclick="window.dialog.showModal();" class="open_filter_mob auto"${ssrRenderAttr("src", _imports_0)} alt="" data-v-0112214e></div></div>`);
      if (_ctx.catalog_list.length) {
        _push(`<div class="w-sto product-list flex" data-v-0112214e><!--[-->`);
        ssrRenderList(_ctx.catalog_list, (pr) => {
          _push(ssrRenderComponent(CatalogProduct, {
            key: pr.id,
            pr
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else if (!_ctx.catalog_loads) {
        _push(ssrRenderComponent(LoadingComp, null, null, _parent));
      } else {
        _push(`<div style="${ssrRenderStyle({ "width": "50%", "margin": "auto", "margin-top": "10%" })}" data-v-0112214e><div style="${ssrRenderStyle({ "text-align": "center" })}" class="flex w-sto" data-v-0112214e><p style="${ssrRenderStyle({ "font-size": "28px" })}" class="VAG auto" data-v-0112214e>\u0422\u043E\u0432\u0430\u0440\u043E\u0432 \u0441 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u043C\u0438 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0430\u043C\u0438 \u043D\u0435\u0442\u0443 :(</p></div><div class="select_size" data-v-0112214e>`);
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/catalog" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button style="${ssrRenderStyle({ "background": "rgb(255, 188, 65)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}" data-v-0112214e${_scopeId}> \u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 </button>`);
            } else {
              return [
                createVNode("button", {
                  onClick: ($event) => _ctx.clear_filter(),
                  style: { "background": "rgb(255, 188, 65)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" }
                }, " \u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 ", 8, ["onClick"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      }
      _push(`</div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/catalog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const catalog = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0112214e"]]);

export { catalog as default };
//# sourceMappingURL=catalog-79c1d0b6.mjs.map
