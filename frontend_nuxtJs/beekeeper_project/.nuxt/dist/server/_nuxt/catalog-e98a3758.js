import { C as CatalogProduct } from "./CatalogProduct-9819910f.js";
import { a as api_root, u as useCookie, _ as _export_sfc, b as __nuxt_component_0 } from "../server.mjs";
import { mergeProps, useSSRContext, resolveComponent, withCtx, createVNode } from "vue";
import "hookable";
import "devalue";
import "klona";
import axios from "axios";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr } from "vue/server-renderer";
import { L as LoadingComp } from "./LoadingComp-34c86e82.js";
import "./RatingComp-3b33b09b.js";
import "./removeFavorite-8c059756.js";
import "destr";
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
async function getProductList(size) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/product?size=${size}`,
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
const filter_scss_vue_type_style_index_0_src_104c8686_scoped_104c8686_lang = "";
const _sfc_main$2 = {
  el: "#filter",
  name: "FilterCatalog",
  data() {
    return {
      filter_catalog: [],
      filter_class_name: [],
      filter_packaging_name: [],
      cat_list: []
    };
  },
  props: ["catalog_list", "category_list"],
  methods: {
    addClassFilter(event) {
      var _a;
      event = ((_a = event == null ? void 0 : event.srcElement) == null ? void 0 : _a.children[0]) ? event.srcElement : event.target.parentNode;
      this.addClassActive(event);
      let index = this.filter_class_name.indexOf(
        event.children[0].innerHTML
      );
      if (index >= 0) {
        this.filter_class_name.splice(index, 1);
        console.log(this.filter_class_name);
        this.c();
      } else {
        this.filter_class_name.push(event.children[0].innerHTML);
        this.c();
      }
    },
    c() {
      let list = this.a();
      this.$store.REFACTOR_CATALOG_LIST(list);
    },
    a() {
      let sortered = this.catalog_list.slice();
      this.filter_class_name.forEach((element) => {
        console.log(element);
        sortered = sortered.filter(
          (x) => x.category.find((x2) => x2.name == element)
        );
      });
      return sortered;
    },
    addClassActive(event) {
      console.log(event);
      if (event.classList.contains("active")) {
        event.classList.remove("active");
      } else {
        event.classList.add("active");
      }
    }
  },
  setup() {
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "filter" }, _attrs))} data-v-104c8686><p class="filter-p small" data-v-104c8686>Категория</p><ul class="filter-ul" data-v-104c8686><!--[-->`);
  ssrRenderList($props.category_list, (cat, index) => {
    _push(`<li class="filter-li" data-v-104c8686><p class="normal-small" data-v-104c8686>${ssrInterpolate(cat.name)}</p></li>`);
  });
  _push(`<!--]--></ul></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Catalog/FilterCatalog.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const FilterCatalog = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-104c8686"]]);
const SortedCatalog_vue_vue_type_style_index_0_scoped_5ca13951_lang = "";
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
    sorteredAlfFunc() {
      let a = this.$store.getCatalog_list.sort((x, y) => x.name.localeCompare(y.name));
      this.sorteredAlf = !this.sorteredAlf;
      this.sorteredMonet = false;
      this.sorteredNew = false;
      this.$store.REFACTOR_CATALOG_LIST(a);
    },
    sorteredMoneyFUnc() {
      let a = this.$store.getCatalog_list.sort((a2, b) => parseFloat(b.price) - parseFloat(a2.price));
      this.sorteredMonet = !this.sorteredMonet;
      this.sorteredAlf = false;
      this.sorteredNew = false;
      this.$store.REFACTOR_CATALOG_LIST(a);
    },
    sorteredNewFUnc() {
      let a = this.$store.getCatalog_list.sort((a2, b) => parseFloat(b.id) - parseFloat(a2.id));
      this.sorteredNew = !this.sorteredNew;
      this.sorteredMonet = false;
      this.sorteredAlf = false;
      this.$store.REFACTOR_CATALOG_LIST(a);
    }
  },
  setup() {
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "sorted-product flex jus-sp",
    id: "sorted"
  }, _attrs))} data-v-5ca13951><p class="${ssrRenderClass([$data.sorteredAlf ? "act_sorted-p" : "", "sorted-p small"])}" data-v-5ca13951> По имени </p><p class="${ssrRenderClass([$data.sorteredMonet ? "act_sorted-p" : "", "sorted-p small"])}" data-v-5ca13951> По цене </p><p class="${ssrRenderClass([$data.sorteredNew ? "act_sorted-p" : "", "sorted-p small"])}" data-v-5ca13951> Новое </p></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Catalog/SortedCatalog.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const SortedCatalog = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-5ca13951"]]);
async function getCategoryList() {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/category`,
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
async function getSearchProduct(params) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/product/search?${params}`,
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
const _imports_0 = "" + __buildAssetsURL("filter.b252e476.png");
const katalog_scss_vue_type_style_index_0_src_0c77a394_scoped_0c77a394_lang = "";
const checkbox_scss_vue_type_style_index_1_src_0c77a394_scoped_0c77a394_lang = "";
const hexTovar_css_vue_type_style_index_2_src_true_lang = "";
const catalog_vue_vue_type_style_index_3_scoped_0c77a394_lang = "";
const _sfc_main = {
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
      catalog_list: [
        {
          id: 0,
          name: "",
          image: "",
          price: "",
          price_currency: "",
          description: "",
          category: [
            {
              name: ""
            }
          ]
        }
      ],
      filter_teleport: false,
      category_list: [],
      type_packaging: [],
      CATALOG_LIST_STATE: this.$store.getCatalog_list,
      filters: false,
      catalog_loads: false
    };
  },
  async mounted() {
    this.restartCatalog();
    this.filterReg();
  },
  methods: {
    async clear_filter() {
      await this.$router.replace({ "query": null });
      setInterval(() => {
        var _a;
        if (!((_a = this.$route.query) == null ? void 0 : _a.filter)) {
          this.$router.go();
        }
      }, 100);
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
    }
  },
  setup() {
  },
  watch: {
    "$route.query": async function() {
      this.restartCatalog();
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_FilterCatalog = resolveComponent("FilterCatalog");
  const _component_SortedCatalog = resolveComponent("SortedCatalog");
  const _component_CatalogProduct = CatalogProduct;
  const _component_LoadingComp = resolveComponent("LoadingComp");
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "catalog" }, _attrs))} data-v-0c77a394><div class="absolute flex w-sto h_sto" style="${ssrRenderStyle({ "pointer-events": "none" })}" data-v-0c77a394><dialog id="dialog" class="absolute auto" style="${ssrRenderStyle({ "pointer-events": "auto" })}" data-v-0c77a394>`);
  _push(ssrRenderComponent(_component_FilterCatalog, {
    category_list: $data.category_list,
    catalog_list: $data.catalog_list,
    onUpdateClassFiler: _ctx.filterClassReg
  }, null, _parent));
  _push(`<button class="btn w-sto btn-green" onclick="window.dialog.close();" data-v-0c77a394>Показать</button><button onclick="window.dialog.close();" aria-label="close" class="x" data-v-0c77a394> ❌ </button></dialog></div><div class="sot-ob" data-v-0c77a394><div class="wrapper-product w-sto flex" data-v-0c77a394><div class="interactiv auto back" data-v-0c77a394>`);
  if ($data.filters) {
    _push(`<p style="${ssrRenderStyle({ "margin-left": "5%" })}" class="small" data-v-0c77a394>${ssrInterpolate(JSON.parse(this.$route.query.filter).name)}</p>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="flex w-sto product_div" data-v-0c77a394><div class="block filter_div" data-v-0c77a394><div class="filter-product" id="filter_desk" data-v-0c77a394>`);
  _push(ssrRenderComponent(_component_FilterCatalog, {
    category_list: $data.category_list,
    catalog_list: $data.catalog_list
  }, null, _parent));
  _push(`</div></div><div class="product_osnov relative" data-v-0c77a394><div class="sorted_div flex jus-sp" data-v-0c77a394>`);
  _push(ssrRenderComponent(_component_SortedCatalog, { catalog_list: $data.catalog_list }, null, _parent));
  _push(`<div class="mob_filter flex" data-v-0c77a394><img onclick="window.dialog.showModal();" class="open_filter_mob auto"${ssrRenderAttr("src", _imports_0)} alt="" data-v-0c77a394></div></div>`);
  if (_ctx.$store.getCatalog_list.length) {
    _push(`<div class="w-sto product-list flex" data-v-0c77a394><!--[-->`);
    ssrRenderList(_ctx.$store.getCatalog_list, (pr) => {
      _push(ssrRenderComponent(_component_CatalogProduct, {
        key: pr.id,
        pr
      }, null, _parent));
    });
    _push(`<!--]--></div>`);
  } else if (!$data.catalog_loads) {
    _push(ssrRenderComponent(_component_LoadingComp, null, null, _parent));
  } else {
    _push(`<div style="${ssrRenderStyle({ "width": "50%", "margin": "auto", "margin-top": "10%" })}" data-v-0c77a394><div style="${ssrRenderStyle({ "text-align": "center" })}" class="flex w-sto" data-v-0c77a394><p style="${ssrRenderStyle({ "font-size": "28px" })}" class="VAG auto" data-v-0c77a394>Товаров с выбранными параметрами нету :(</p></div><div class="select_size" data-v-0c77a394>`);
    _push(ssrRenderComponent(_component_NuxtLink, { to: "/catalog" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button style="${ssrRenderStyle({ "background": "rgb(255, 188, 65)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}" data-v-0c77a394${_scopeId}> Сбросить настройки </button>`);
        } else {
          return [
            createVNode("button", {
              onClick: ($event) => $options.clear_filter(),
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
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/catalog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const catalog = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-0c77a394"]]);
export {
  catalog as default
};
//# sourceMappingURL=catalog-e98a3758.js.map
