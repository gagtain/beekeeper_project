import { useSSRContext, resolveComponent, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc, a as api_root, u as useCookie } from '../server.mjs';
import axios from 'axios';
import { A as AddBasket, F as FavoriteComp, R as RatingComp } from './RatingComp-3592f613.mjs';
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
import './removeFavorite-8c059756.mjs';

const _sfc_main$1 = {
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
  }, _attrs))} data-v-16ad3630><div class="min" data-v-16ad3630><ul class="jus-sp-ar" data-v-16ad3630><li class="li_min_img" data-v-16ad3630><img class="tovar_img_the_min"${ssrRenderAttr("src", _ctx.$api_root + $props.image)} alt="" data-v-16ad3630></li><!--[-->`);
  ssrRenderList($props.ImageProductList, (im, index) => {
    _push(`<li class="li_min_img" data-v-16ad3630><img class="tovar_img_the_min"${ssrRenderAttr("src", _ctx.$api_root + im.photo)} alt="" data-v-16ad3630></li>`);
  });
  _push(`<!--]--></ul></div><div class="max" data-v-16ad3630><img id="main_tovar_img" class="tovar_img_the_max"${ssrRenderAttr("src", _ctx.$api_root + $props.image)} alt="" data-v-16ad3630></div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tovar/TovarImage.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-16ad3630"]]);
async function getTovar(pk) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/product/${pk}`,
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
  el: "#tovar",
  name: "TovarBase",
  components: {
    AddBasket,
    FavoriteComp,
    TovarImage: __nuxt_component_0,
    RatingComp
  },
  data() {
    return {
      tovar: null,
      isDescription: false,
      isSostav: false,
      type_weigth_id: null
    };
  },
  async created() {
    let response_tovar = await getTovar(this.$route.params.id);
    console.log(response_tovar);
    if (response_tovar.status == 200) {
      this.tovar = response_tovar.data;
    }
    this.type_weigth_id = this.tovar.list_weight[0].id;
  },
  methods: {
    getCategoryList() {
      let cat_list = this.tovar.category.slice();
      let l = [];
      cat_list.forEach((element) => {
        l.push(element.name);
      });
      return l;
    },
    open_descrip() {
      this.isDescription = !this.isDescription;
    },
    open_sostav() {
      this.isSostav = !this.isSostav;
    },
    select_type_weigth(pk) {
      console.log(pk);
      this.type_weigth_id = pk;
    },
    select_type_pack(pk) {
      console.log(pk);
      this.type_pack_id = pk;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TovarImage = __nuxt_component_0;
  const _component_rating_comp = resolveComponent("rating-comp");
  const _component_AddBasket = resolveComponent("AddBasket");
  const _component_FavoriteComp = resolveComponent("FavoriteComp");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-23296327><div class="wrapper flex w-sto" data-v-23296327><div class="tovar_in flex interactiv jus-sp auto" id="tovar" data-v-23296327>`);
  if ($data.tovar) {
    _push(`<div class="ob flex jus-sp w-sto" data-v-23296327>`);
    _push(ssrRenderComponent(_component_TovarImage, {
      image: $data.tovar.image,
      ImageProductList: $data.tovar.ImageProductList
    }, null, _parent));
    _push(`<div class="tovar_infa" data-v-23296327><div class="tovar_name" data-v-23296327><p class="black bolshoi auto" data-v-23296327>${ssrInterpolate($data.tovar.name)}</p></div><div class="tovar_two" data-v-23296327><p class="black nebolsh" data-v-23296327>\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438: ${ssrInterpolate($options.getCategoryList().join(", "))}</p></div>`);
    _push(ssrRenderComponent(_component_rating_comp, {
      rating: $data.tovar.rating
    }, null, _parent));
    _push(`<div class="price flex" data-v-23296327><span style="${ssrRenderStyle({ "line-height": "1" })}" class="tovar_price VAG small-big" data-v-23296327>${ssrInterpolate($data.tovar.price)} <span style="${ssrRenderStyle({ "line-height": "1" })}" class="tovar_price VAG small" data-v-23296327>${ssrInterpolate($data.tovar.price_currency)}</span></span></div><div class="variant tovar_two" data-v-23296327><h3 data-v-23296327>\u0420\u0430\u0437\u043C\u0435\u0440</h3><div class="flex" data-v-23296327><ul class="variant-ul" data-v-23296327><!--[-->`);
    ssrRenderList($data.tovar.list_weight, (ls_w, index) => {
      _push(`<li class="${ssrRenderClass([$data.type_weigth_id == ls_w.id ? "active" : "", "photo-album-li"])}" data-v-23296327><div class="h_sto" data-v-23296327><p data-v-23296327>${ssrInterpolate(ls_w.weight)} \u0433\u0440</p></div></li>`);
    });
    _push(`<!--]--></ul></div></div><div class="flex tovar_two jus-sp but but-b" data-v-23296327>`);
    _push(ssrRenderComponent(_component_AddBasket, {
      id: $data.tovar.id,
      wei_id: $data.type_weigth_id
    }, null, _parent));
    _push(ssrRenderComponent(_component_FavoriteComp, {
      id: $data.tovar.id,
      wei_id: $data.type_weigth_id
    }, null, _parent));
    _push(`</div><div class="tovar_two" data-v-23296327><p class="black malenkii" data-v-23296327>\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u043E\u0441\u0442\u0438</p></div><div class="tovar_two vib" data-v-23296327><div class="flex jus-sp op_contex" data-v-23296327><p class="black malenkii vib_" data-v-23296327>\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435</p><div class="contex material-symbols-outlined" data-v-23296327> - </div></div>`);
    if ($data.isDescription) {
      _push(`<div class="context_text" data-v-23296327><p class="malenkii black" data-v-23296327>${ssrInterpolate($data.tovar.description)}</p></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div><div class="tovar_two vib" data-v-23296327><div class="flex jus-sp op_contex" data-v-23296327><p class="black malenkii vib_" data-v-23296327>\u0421\u043E\u0441\u0442\u0430\u0432</p><div class="contex material-symbols-outlined" data-v-23296327><span class="material-symbols-outlined" data-v-23296327> - </span></div></div>`);
    if ($data.isSostav) {
      _push(`<div class="context_text" data-v-23296327><p class="malenkii black" data-v-23296327>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora natus rem temporibus deserunt repudiandae iure officia cumque eum omnis sapiente illum voluptates, amet ex optio consectetur sed dolore sit eaque.</p></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tovar/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-23296327"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-5c89fcb4.mjs.map
