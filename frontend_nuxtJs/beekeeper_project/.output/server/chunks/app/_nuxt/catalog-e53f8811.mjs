import { C as CatalogProduct } from './CatalogProduct-adb63f5b.mjs';
import { useSSRContext, resolveComponent, mergeProps } from 'vue';
import { _ as _export_sfc, a as api_root, u as useCookie } from '../server.mjs';
import axios from 'axios';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import './FavoriteComp-8b6586cf.mjs';
import './removeFavorite-c9297cac.mjs';
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
  props: ["catalog_list", "category_list", "type_packaging"],
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
      let list = this.b(this.a());
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
    addPackagingFilter(event) {
      var _a;
      event = ((_a = event == null ? void 0 : event.srcElement) == null ? void 0 : _a.children[0]) ? event.srcElement : event.target.parentNode;
      this.addClassActive(event);
      let index = this.filter_packaging_name.indexOf(event.children[0].innerHTML);
      if (index >= 0) {
        this.filter_packaging_name.splice(index, 1);
        this.c();
      } else {
        this.filter_packaging_name.push(event.children[0].innerHTML);
        this.c();
      }
    },
    b(sortered) {
      this.filter_packaging_name.forEach((element) => {
        sortered = sortered.filter(
          (x) => x.type_packaging.find((x2) => x2.name == element)
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
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "filter" }, _attrs))} data-v-e9888aa9><p class="filter-p small" data-v-e9888aa9>\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F</p><ul class="filter-ul" data-v-e9888aa9><!--[-->`);
  ssrRenderList($props.category_list, (cat, index) => {
    _push(`<li class="filter-li" data-v-e9888aa9><p class="normal-small" data-v-e9888aa9>${ssrInterpolate(cat.name)}</p></li>`);
  });
  _push(`<!--]--></ul><p class="filter-p small" data-v-e9888aa9>\u0422\u0438\u043F \u0443\u043F\u0430\u043A\u043E\u0432\u043A\u0438</p><ul class="filter-ul" data-v-e9888aa9><!--[-->`);
  ssrRenderList($props.type_packaging, (pack, index) => {
    _push(`<li class="filter-li" data-v-e9888aa9><p class="normal-small" data-v-e9888aa9>${ssrInterpolate(pack.name)}</p></li>`);
  });
  _push(`<!--]--></ul></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Catalog/FilterCatalog.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const FilterCatalog = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-e9888aa9"]]);
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
  methods: {
    props: ["catalog_list"],
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
  }, _attrs))} data-v-444d5186><p class="${ssrRenderClass([$data.sorteredAlf ? "act_sorted-p" : "", "sorted-p small"])}" data-v-444d5186> \u041F\u043E \u0438\u043C\u0435\u043D\u0438 </p><p class="${ssrRenderClass([$data.sorteredMonet ? "act_sorted-p" : "", "sorted-p small"])}" data-v-444d5186> \u041F\u043E \u0446\u0435\u043D\u0435 </p><p class="${ssrRenderClass([$data.sorteredNew ? "act_sorted-p" : "", "sorted-p small"])}" data-v-444d5186> \u041D\u043E\u0432\u043E\u0435 </p></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Catalog/SortedCatalog.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const SortedCatalog = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-444d5186"]]);
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
async function getType_packaging_list() {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/type_packaging`,
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
  el: "#catalog",
  name: "CatalogItem",
  components: {
    FilterCatalog,
    SortedCatalog,
    CatalogProduct
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
          ],
          type_packaging: {
            name: ""
          }
        }
      ],
      filter_teleport: false,
      category_list: [],
      type_packaging: [],
      CATALOG_LIST_STATE: this.$store.getCatalog_list
    };
  },
  async created() {
    let catalog_response = await getProductList(50);
    this.filterReg();
    this.catalog_list = catalog_response.data;
    this.catalog_list_sorted = this.catalog_list.slice();
    this.$store.REFACTOR_CATALOG_LIST(this.catalog_list);
  },
  methods: {
    async filterReg() {
      let category_response = await getCategoryList();
      this.category_list = category_response.data;
      let type_packaging_response = await getType_packaging_list();
      this.type_packaging = type_packaging_response.data;
    }
  },
  setup() {
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_FilterCatalog = resolveComponent("FilterCatalog");
  const _component_SortedCatalog = resolveComponent("SortedCatalog");
  const _component_CatalogProduct = CatalogProduct;
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "catalog" }, _attrs))} data-v-4a6f77d9><div class="absolute flex w-sto h_sto" style="${ssrRenderStyle({ "pointer-events": "none" })}" data-v-4a6f77d9><dialog id="dialog" class="absolute auto" style="${ssrRenderStyle({ "pointer-events": "auto" })}" data-v-4a6f77d9>`);
  _push(ssrRenderComponent(_component_FilterCatalog, {
    category_list: $data.category_list,
    type_packaging: $data.type_packaging,
    catalog_list: $data.catalog_list,
    onUpdateClassFiler: _ctx.filterClassReg
  }, null, _parent));
  _push(`<button class="btn w-sto btn-green" onclick="window.dialog.close();" data-v-4a6f77d9>\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C</button><button onclick="window.dialog.close();" aria-label="close" class="x" data-v-4a6f77d9> \u274C </button></dialog></div><div class="sot-ob" data-v-4a6f77d9><div class="wrapper-product w-sto flex" data-v-4a6f77d9><div class="interactiv auto back" data-v-4a6f77d9><div class="flex w-sto product_div" data-v-4a6f77d9><div class="block filter_div" data-v-4a6f77d9><div class="filter-product" id="filter_desk" data-v-4a6f77d9>`);
  _push(ssrRenderComponent(_component_FilterCatalog, {
    category_list: $data.category_list,
    type_packaging: $data.type_packaging,
    catalog_list: $data.catalog_list
  }, null, _parent));
  _push(`</div></div><div class="product_osnov" data-v-4a6f77d9><div class="sorted_div flex jus-sp" data-v-4a6f77d9>`);
  _push(ssrRenderComponent(_component_SortedCatalog, { catalog_list: $data.catalog_list }, null, _parent));
  _push(`<div class="mob_filter relative" data-v-4a6f77d9><p onclick="window.dialog.showModal();" class="open_filter_mob" data-v-4a6f77d9> \u0424\u0438\u043B\u044C\u0442\u0440\u0430\u0446\u0438\u044F </p></div></div>`);
  if (_ctx.$store.getCatalog_list) {
    _push(`<div class="w-sto product-list flex" data-v-4a6f77d9><!--[-->`);
    ssrRenderList(_ctx.$store.getCatalog_list, (pr) => {
      _push(ssrRenderComponent(_component_CatalogProduct, {
        key: pr.id,
        pr
      }, null, _parent));
    });
    _push(`<!--]--></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/catalog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const catalog = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-4a6f77d9"]]);

export { catalog as default };
//# sourceMappingURL=catalog-e53f8811.mjs.map
