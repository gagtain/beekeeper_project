import { a as api_root, _ as _export_sfc, u as useHead, b as __nuxt_component_0 } from "../server.mjs";
import { mergeProps, useSSRContext, withCtx, createVNode } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr } from "vue/server-renderer";
import "hookable";
import "destr";
import "devalue";
import "klona";
import axios from "axios";
import { C as CatalogProduct } from "./CatalogProduct-01554aae.js";
import { L as LoadingComp } from "./LoadingComp-34c86e82.js";
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
import "./FavoriteComp-5b75aa9c.js";
const _imports_0 = "" + __buildAssetsURL("filter.b252e476.png");
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
      headers: {},
      withCredentials: true
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const filter_scss_vue_type_style_index_0_src_cfe92613_scoped_cfe92613_lang = "";
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
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "filter" }, _attrs))} data-v-cfe92613><p class="filter-p small" data-v-cfe92613>Категория</p><ul class="filter-ul" data-v-cfe92613><!--[-->`);
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
const SortedCatalog_vue_vue_type_style_index_0_scoped_96beec27_lang = "";
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
  }, _attrs))} data-v-96beec27><p class="${ssrRenderClass([$data.sorteredAlf ? "act_sorted-p" : "", "sorted-p small"])}" data-v-96beec27> По имени </p><p class="${ssrRenderClass([$data.sorteredMonet ? "act_sorted-p" : "", "sorted-p small"])}" data-v-96beec27> По цене </p><p class="${ssrRenderClass([$data.sorteredNew ? "act_sorted-p" : "", "sorted-p small"])}" data-v-96beec27> Новое </p></div>`);
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
const katalog_scss_vue_type_style_index_0_src_0112214e_scoped_0112214e_lang = "";
const checkbox_scss_vue_type_style_index_1_src_0112214e_scoped_0112214e_lang = "";
const hexTovar_css_vue_type_style_index_2_src_true_lang = "";
const catalog_vue_vue_type_style_index_3_scoped_0112214e_lang = "";
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
      title: "Пчелиная артель - Каталог"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "catalog" }, _attrs))} data-v-0112214e><div class="absolute flex w-sto h_sto" style="${ssrRenderStyle({ "pointer-events": "none" })}" data-v-0112214e><dialog id="dialog" class="absolute auto" style="${ssrRenderStyle({ "pointer-events": "auto" })}" data-v-0112214e>`);
      _push(ssrRenderComponent(FilterCatalog, {
        category_list: _ctx.category_list,
        catalog_list: _ctx.catalog_list,
        onUpdateClassFiler: _ctx.filterClassReg
      }, null, _parent));
      _push(`<button class="btn w-sto btn-green" onclick="window.dialog.close();" data-v-0112214e>Показать</button><button onclick="window.dialog.close();" aria-label="close" class="x" data-v-0112214e> ❌ </button></dialog></div><div class="sot-ob" data-v-0112214e><div class="wrapper-product w-sto flex" data-v-0112214e><div class="interactiv auto back" data-v-0112214e>`);
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
        _push(`<div style="${ssrRenderStyle({ "width": "50%", "margin": "auto", "margin-top": "10%" })}" data-v-0112214e><div style="${ssrRenderStyle({ "text-align": "center" })}" class="flex w-sto" data-v-0112214e><p style="${ssrRenderStyle({ "font-size": "28px" })}" class="VAG auto" data-v-0112214e>Товаров с выбранными параметрами нету :(</p></div><div class="select_size" data-v-0112214e>`);
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/catalog" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button style="${ssrRenderStyle({ "background": "rgb(255, 188, 65)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}" data-v-0112214e${_scopeId}> Сбросить настройки </button>`);
            } else {
              return [
                createVNode("button", {
                  onClick: ($event) => _ctx.clear_filter(),
                  style: { "background": "rgb(255, 188, 65)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" }
                }, " Сбросить настройки ", 8, ["onClick"])
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
export {
  catalog as default
};
//# sourceMappingURL=catalog-be21ceed.js.map
