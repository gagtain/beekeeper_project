import { mergeProps, useSSRContext, resolveComponent } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderStyle } from "vue/server-renderer";
import "hookable";
import "destr";
import "devalue";
import "klona";
import axios from "axios";
import { b as api_root, _ as _export_sfc, u as useHead } from "../server.mjs";
import { A as AddBasket, F as FavoriteComp } from "./FavoriteComp-f62eb513.js";
import { R as RatingComp, S as SelectVariantMenu, C as CatalogProduct } from "./CatalogProduct-fe210843.js";
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
async function getTovar(pk) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/product/${pk}`,
      method: "get",
      headers: {},
      withCredentials: true
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const tovar_css_vue_type_style_index_0_src_6f03b878_scoped_6f03b878_lang = "";
const TovarImage_vue_vue_type_style_index_1_lang = "";
const _sfc_main$2 = {
  el: "galery_product",
  name: "TovarImage",
  props: ["image", "ImageProductList"],
  created() {
    console.log(this.image);
  },
  methods: {
    a(img) {
      document.getElementById("main_tovar_img").src = img.srcElement.src;
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "images_tovar flex",
    id: "galery_product"
  }, _attrs))} data-v-6f03b878><div class="min" data-v-6f03b878><ul class="jus-sp-ar" data-v-6f03b878><li class="li_min_img" data-v-6f03b878><img class="tovar_img_the_min"${ssrRenderAttr("src", _ctx.$api_root + $props.image.slice(1))} alt="" data-v-6f03b878></li><!--[-->`);
  ssrRenderList($props.ImageProductList, (im, index) => {
    _push(`<li class="li_min_img" data-v-6f03b878><img class="tovar_img_the_min"${ssrRenderAttr("src", _ctx.$api_root + im.photo.slice(1))} alt="" data-v-6f03b878></li>`);
  });
  _push(`<!--]--></ul></div><div class="max" data-v-6f03b878><img id="main_tovar_img" class="tovar_img_the_max"${ssrRenderAttr("src", _ctx.$api_root + $props.image.slice(1))} alt="" data-v-6f03b878></div></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tovar/TovarImage.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-6f03b878"]]);
const tovar_css_vue_type_style_index_0_src_069c5d2f_scoped_069c5d2f_lang = "";
const Tovar_vue_vue_type_style_index_1_lang = "";
const _sfc_main$1 = {
  props: ["pr"],
  data() {
    return {
      isDescription: false,
      isSostav: false,
      type_weigth_id: null
    };
  },
  components: {
    AddBasket,
    FavoriteComp,
    TovarImage: __nuxt_component_0,
    RatingComp,
    SelectVariantMenu
  },
  extends: CatalogProduct,
  methods: {
    getCategoryList() {
      let cat_list = this.pr.category.slice();
      let l = [];
      cat_list.forEach((element) => {
        l.push(element.name);
      });
      return l;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TovarImage = __nuxt_component_0;
  const _component_rating_comp = resolveComponent("rating-comp");
  const _component_select_variant_menu = resolveComponent("select-variant-menu");
  const _component_AddBasket = resolveComponent("AddBasket");
  const _component_FavoriteComp = resolveComponent("FavoriteComp");
  if ($props.pr) {
    _push(`<div${ssrRenderAttrs(mergeProps({ class: "ob flex jus-sp w-sto" }, _attrs))} data-v-069c5d2f>`);
    _push(ssrRenderComponent(_component_TovarImage, {
      image: $props.pr.image,
      ImageProductList: $props.pr.ImageProductList
    }, null, _parent));
    _push(`<div class="tovar_infa" data-v-069c5d2f><div class="tovar_name" data-v-069c5d2f><p class="black bolshoi auto" data-v-069c5d2f>${ssrInterpolate($props.pr.name)}</p></div><div class="tovar_two" data-v-069c5d2f><p class="black nebolsh" data-v-069c5d2f>Категории: ${ssrInterpolate($options.getCategoryList().join(", "))}</p></div>`);
    _push(ssrRenderComponent(_component_rating_comp, {
      rating: $props.pr.rating
    }, null, _parent));
    _push(`<div class="price flex" data-v-069c5d2f><span style="${ssrRenderStyle({ "line-height": "1" })}" class="tovar_price VAG small-big" data-v-069c5d2f>${ssrInterpolate(_ctx.select_productItem.price)} <span style="${ssrRenderStyle({ "line-height": "1" })}" class="tovar_price VAG small" data-v-069c5d2f>${ssrInterpolate(_ctx.select_productItem.price_currency)}</span></span></div>`);
    _push(ssrRenderComponent(_component_select_variant_menu, {
      select_productItem: _ctx.select_productItem,
      pr: $props.pr,
      onSelect_product: _ctx.select_product
    }, null, _parent));
    _push(`<div class="flex tovar_two jus-sp but but-b product_menu" data-v-069c5d2f>`);
    _push(ssrRenderComponent(_component_AddBasket, {
      style: { "width": "40%" },
      id: _ctx.select_productItem.id
    }, null, _parent));
    _push(ssrRenderComponent(_component_FavoriteComp, {
      id: _ctx.select_productItem.id
    }, null, _parent));
    _push(`</div><div class="tovar_two" data-v-069c5d2f><p class="black malenkii" data-v-069c5d2f>Подробности</p></div><div class="tovar_two vib" data-v-069c5d2f><div class="flex jus-sp op_contex" data-v-069c5d2f><p class="black malenkii vib_" data-v-069c5d2f>Описание</p><div class="contex material-symbols-outlined" data-v-069c5d2f> - </div></div>`);
    if ($data.isDescription) {
      _push(`<div class="context_text" data-v-069c5d2f><p class="malenkii black" data-v-069c5d2f>${ssrInterpolate($props.pr.description)}</p></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div><div class="tovar_two vib" data-v-069c5d2f><div class="flex jus-sp op_contex" data-v-069c5d2f><p class="black malenkii vib_" data-v-069c5d2f>Состав</p><div class="contex material-symbols-outlined" data-v-069c5d2f><span class="material-symbols-outlined" data-v-069c5d2f> - </span></div></div>`);
    if ($data.isSostav) {
      _push(`<div class="context_text" data-v-069c5d2f><p class="malenkii black" data-v-069c5d2f>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora natus rem temporibus deserunt repudiandae iure officia cumque eum omnis sapiente illum voluptates, amet ex optio consectetur sed dolore sit eaque.</p></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div></div>`);
  } else {
    _push(`<!---->`);
  }
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tovar/Tovar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Tovar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-069c5d2f"]]);
const tovar_css_vue_type_style_index_0_src_ce18269c_scoped_ce18269c_lang = "";
const __default__ = {
  el: "#tovar",
  name: "TovarBase",
  components: {
    Tovar
  },
  data() {
    return {
      tovar: null
    };
  },
  async created() {
    let response_tovar = await getTovar(this.$route.params.id);
    console.log(response_tovar);
    if (response_tovar.status == 200) {
      this.tovar = response_tovar.data;
      useHead({
        title: `Пчелиная артель - Товар ${this.tovar.name}`
      });
    }
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Пчелиная артель - Товар"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-ce18269c><div class="wrapper flex w-sto" data-v-ce18269c><div class="tovar_in flex interactiv jus-sp auto" id="tovar" data-v-ce18269c>`);
      if (_ctx.tovar) {
        _push(ssrRenderComponent(Tovar, { pr: _ctx.tovar }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tovar/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ce18269c"]]);
export {
  _id_ as default
};
//# sourceMappingURL=_id_-4f6ee253.js.map
