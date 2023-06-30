import { _ as _export_sfc, b as __nuxt_component_0$1 } from "../server.mjs";
import { A as AddBasket, F as FavoriteComp } from "./FavoriteComp-c983c0e9.js";
import { C as CatalogProduct, T as TovarMinImageList } from "./CatalogProduct-c619f6e7.js";
import { resolveComponent, mergeProps, withCtx, createVNode, toDisplayString, useSSRContext, openBlock, createBlock, Fragment, renderList } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle } from "vue/server-renderer";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation } from "swiper";
import { L as LoadingComp } from "./LoadingComp-34c86e82.js";
import axios from "axios";
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
import "defu";
import "./removeFavorite-c9297cac.js";
const main_css_vue_type_style_index_0_src_46683d72_scoped_46683d72_lang = "";
const hexTovar_css_vue_type_style_index_1_src_46683d72_scoped_46683d72_lang = "";
const PopularProduct_vue_vue_type_style_index_2_lang = "";
const _sfc_main$1 = {
  el: "#product_catalog",
  name: "CatalogProduct",
  props: ["pr"],
  extends: CatalogProduct,
  components: {
    TovarMinImageList,
    AddBasket,
    FavoriteComp
  },
  created() {
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TovarMinImageList = resolveComponent("TovarMinImageList");
  const _component_NuxtLink = __nuxt_component_0$1;
  const _component_AddBasket = resolveComponent("AddBasket");
  const _component_FavoriteComp = resolveComponent("FavoriteComp");
  _push(`<section${ssrRenderAttrs(mergeProps({
    class: "product",
    id: "product_catalog"
  }, _attrs))} data-v-46683d72><div class="product__photo" data-v-46683d72><div class="photo-container" data-v-46683d72><div class="photo-main" data-v-46683d72><div class="controls" data-v-46683d72></div><img${ssrRenderAttr("src", _ctx.$api_root + $props.pr.image)} alt="green apple slice" data-v-46683d72></div>`);
  _push(ssrRenderComponent(_component_TovarMinImageList, {
    image: $props.pr.image,
    ImageProductList: $props.pr.ImageProductList
  }, null, _parent));
  _push(`</div></div><div class="product__info" data-v-46683d72><div class="title" data-v-46683d72>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    "no-prefetch": "",
    to: `/tovar/${$props.pr.id}`
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p class="small-big product__name" data-v-46683d72${_scopeId}>${ssrInterpolate($props.pr.name)}</p>`);
      } else {
        return [
          createVNode("p", { class: "small-big product__name" }, toDisplayString($props.pr.name), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="very-small product__code" data-v-46683d72>COD: ${ssrInterpolate($props.pr.id)}</span></div><div class="price" data-v-46683d72><span class="product__price small-big" data-v-46683d72>${ssrInterpolate($props.pr.price)} <span class="product__price small" data-v-46683d72>${ssrInterpolate($props.pr.price_currency)}</span></span></div><div class="variant" data-v-46683d72><h3 data-v-46683d72>Размер</h3><div class="flex" data-v-46683d72><ul class="variant-ul" data-v-46683d72><!--[-->`);
  ssrRenderList($props.pr.list_weight, (ls_w, index2) => {
    _push(`<li class="${ssrRenderClass([_ctx.type_weigth_id == ls_w.id ? "active" : "", "photo-album-li"])}" data-v-46683d72><div class="h_sto" data-v-46683d72><p data-v-46683d72>${ssrInterpolate(ls_w.weight)} гр</p></div></li>`);
  });
  _push(`<!--]--></ul></div><h3 data-v-46683d72>Тип упаковки</h3><div class="flex" data-v-46683d72><ul class="variant-ul" data-v-46683d72><!--[-->`);
  ssrRenderList($props.pr.type_packaging, (ty_pck, index2) => {
    _push(`<li class="${ssrRenderClass([_ctx.type_pack_id == ty_pck.id ? "active" : "", "photo-album-li"])}" data-v-46683d72><div class="h_sto" data-v-46683d72><p data-v-46683d72>${ssrInterpolate(ty_pck.name)}</p></div></li>`);
  });
  _push(`<!--]--></ul></div></div><div class="product__text" data-v-46683d72><p class="small" data-v-46683d72>${ssrInterpolate($props.pr.description)}</p></div><div class="flex" data-v-46683d72>`);
  _push(ssrRenderComponent(_component_AddBasket, {
    id: $props.pr.id,
    wei_id: _ctx.type_weigth_id,
    pack_id: _ctx.type_pack_id
  }, null, _parent));
  _push(ssrRenderComponent(_component_FavoriteComp, {
    id: $props.pr.id,
    wei_id: _ctx.type_weigth_id,
    pack_id: _ctx.type_pack_id
  }, null, _parent));
  _push(`</div></div></section>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/PopularProduct.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-46683d72"]]);
const swiper_min = "";
const index_vue_vue_type_style_index_0_lang = "";
const main_css_vue_type_style_index_1_src_482bcf8a_scoped_482bcf8a_lang = "";
const hexTovar_css_vue_type_style_index_2_src_482bcf8a_scoped_482bcf8a_lang = "";
const index_vue_vue_type_style_index_3_scoped_482bcf8a_lang = "";
const _sfc_main = {
  name: "IndexItem",
  components: {
    Swiper,
    SwiperSlide,
    LoadingComp
  },
  data() {
    return {
      popular_product: null,
      wrapper_active: false,
      type_weigth_id: null,
      type_pack_id: null
    };
  },
  async created() {
  },
  mounted() {
    self = this;
    axios({
      url: `${this.$api_root}/api/v0.1/beekeeper_web_api/get_popular_product?size=5`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.$store.assess_token}`
      }
    }).then(function(response) {
      self.popular_product = response.data;
    }).catch(function(error) {
      console.log(error);
    });
    this.wrapper_active = true;
    let recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute(
      "src",
      `${this.$api_root}static/online_store/js/main.js`
    );
    document.head.appendChild(recaptchaScript);
  },
  methods: {
    select_type_weigth(pk) {
      this.type_weigth_id = pk;
    },
    select_type_pack(pk) {
      this.type_pack_id = pk;
    }
  },
  setup() {
    return {
      modules: [Autoplay, Navigation]
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  const _component_AddtionalCompPopularProduct = __nuxt_component_0;
  const _component_LoadingComp = resolveComponent("LoadingComp");
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-482bcf8a><div class="wrapper" data-v-482bcf8a><div class="${ssrRenderClass([$data.wrapper_active ? "actives" : "", "absolute main-nak"])}" data-v-482bcf8a></div><div class="main relative" data-v-482bcf8a><div class="interactiv flex" data-v-482bcf8a><div class="main_center auto" data-v-482bcf8a><div class="main_text_div auto" data-v-482bcf8a><p class="main_text" data-v-482bcf8a>Наш мед имеет ряд преимуществ!</p><div class="bt" data-v-482bcf8a><button class="main_bt" data-v-482bcf8a><div class="flex sto" data-v-482bcf8a><p class="main_bt_p" data-v-482bcf8a>Попробовать!</p></div></button></div></div><div class="main_img_div" data-v-482bcf8a><img${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/phel.png`)} class="phel" alt="" data-v-482bcf8a><div class="slider-produtos-wrap h_sto" data-v-482bcf8a>`);
  _push(ssrRenderComponent(_component_swiper, {
    slidesPerView: 1,
    spaceBetween: 500,
    autoplay: {
      delay: 3e3,
      disableOnInteraction: true
    },
    speed: "5000",
    modules: $setup.modules,
    class: "h_sto"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_swiper_slide, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<img${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/honey.png")} class="main_img" width="100%" height="100%" alt="" data-v-482bcf8a${_scopeId2}>`);
            } else {
              return [
                createVNode("img", {
                  src: _ctx.$api_root + "static/online_store/images/honey.png",
                  class: "main_img",
                  width: "100%",
                  height: "100%",
                  alt: ""
                }, null, 8, ["src"])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_swiper_slide, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<img${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/honey.png")} class="main_img" width="100%" height="100%" alt="" data-v-482bcf8a${_scopeId2}>`);
            } else {
              return [
                createVNode("img", {
                  src: _ctx.$api_root + "static/online_store/images/honey.png",
                  class: "main_img",
                  width: "100%",
                  height: "100%",
                  alt: ""
                }, null, 8, ["src"])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_swiper_slide, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<img${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/honey.png")} class="main_img" width="100%" height="100%" alt="" data-v-482bcf8a${_scopeId2}>`);
            } else {
              return [
                createVNode("img", {
                  src: _ctx.$api_root + "static/online_store/images/honey.png",
                  class: "main_img",
                  width: "100%",
                  height: "100%",
                  alt: ""
                }, null, 8, ["src"])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_swiper_slide, null, {
            default: withCtx(() => [
              createVNode("img", {
                src: _ctx.$api_root + "static/online_store/images/honey.png",
                class: "main_img",
                width: "100%",
                height: "100%",
                alt: ""
              }, null, 8, ["src"])
            ]),
            _: 1
          }),
          createVNode(_component_swiper_slide, null, {
            default: withCtx(() => [
              createVNode("img", {
                src: _ctx.$api_root + "static/online_store/images/honey.png",
                class: "main_img",
                width: "100%",
                height: "100%",
                alt: ""
              }, null, 8, ["src"])
            ]),
            _: 1
          }),
          createVNode(_component_swiper_slide, null, {
            default: withCtx(() => [
              createVNode("img", {
                src: _ctx.$api_root + "static/online_store/images/honey.png",
                class: "main_img",
                width: "100%",
                height: "100%",
                alt: ""
              }, null, 8, ["src"])
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div></div></div><div class="sot" data-v-482bcf8a><div class="interactiv auto" data-v-482bcf8a><div class="flex w-sto text_in_sot" data-v-482bcf8a><p class="big auto main-text" data-v-482bcf8a>Популярные товары</p></div><div class="block_info sliders big-block" data-v-482bcf8a><div class="slider-produtos-wrap" data-v-482bcf8a>`);
  if ($data.popular_product != null) {
    _push(ssrRenderComponent(_component_swiper, {
      slidesPerView: 1,
      spaceBetween: 30,
      navigation: true,
      speed: "1500",
      modules: $setup.modules
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<!--[-->`);
          ssrRenderList($data.popular_product, (pop_product) => {
            _push2(ssrRenderComponent(_component_swiper_slide, {
              key: pop_product.id
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="hex slide auto" data-v-482bcf8a${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_AddtionalCompPopularProduct, { pr: pop_product }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "hex slide auto" }, [
                      createVNode(_component_AddtionalCompPopularProduct, { pr: pop_product }, null, 8, ["pr"])
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          });
          _push2(`<!--]-->`);
        } else {
          return [
            (openBlock(true), createBlock(Fragment, null, renderList($data.popular_product, (pop_product) => {
              return openBlock(), createBlock(_component_swiper_slide, {
                key: pop_product.id
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "hex slide auto" }, [
                    createVNode(_component_AddtionalCompPopularProduct, { pr: pop_product }, null, 8, ["pr"])
                  ])
                ]),
                _: 2
              }, 1024);
            }), 128))
          ];
        }
      }),
      _: 1
    }, _parent));
  } else {
    _push(`<div class="w-sto h_sto" data-v-482bcf8a>`);
    _push(ssrRenderComponent(_component_LoadingComp, null, null, _parent));
    _push(`</div>`);
  }
  _push(`</div></div><div style="${ssrRenderStyle({ "display": "block" })}" class="block_info" data-v-482bcf8a><div class="flex w-sto jus-sp" data-v-482bcf8a><div class="dostav_info flex" data-v-482bcf8a><div class="w-sto auto" data-v-482bcf8a><p class="small-big p-block" data-v-482bcf8a>Чистый как золото, на вкус как солнечный свет</p><p class="small m2" data-v-482bcf8a> Каждая капля – это восхитительный взрыв природной сладости. Необработанный и наполненный невероятными питательными веществами и ферментами, этот мед поразит ваши вкусовые рецепторы. </p></div></div><div class="kart" data-v-482bcf8a><div class="w-sto h_sto" data-v-482bcf8a><img style="${ssrRenderStyle({ "border-radius": "40px" })}" class="w-sto h_sto"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/3.jpg")} alt="" data-v-482bcf8a></div></div></div><div class="flex w-sto jus-sp m2" data-v-482bcf8a><div class="kart" data-v-482bcf8a><div class="w-sto h_sto" data-v-482bcf8a><img style="${ssrRenderStyle({ "border-radius": "40px" })}" class="w-sto h_sto"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/3.jpg")} alt="" data-v-482bcf8a></div></div><div class="dostav_info flex" data-v-482bcf8a><div class="w-sto auto" data-v-482bcf8a><p class="small-big p-block" data-v-482bcf8a>Чистый как золото, на вкус как солнечный свет</p><p class="small m2" data-v-482bcf8a> Каждая капля – это восхитительный взрыв природной сладости. Необработанный и наполненный невероятными питательными веществами и ферментами, этот мед поразит ваши вкусовые рецепторы. </p></div></div></div></div><div class="interactiv" data-v-482bcf8a><div class="flex w-sto text_in_sot" data-v-482bcf8a><p class="big auto main-text" data-v-482bcf8a>Отзывы</p></div><div class="w-sto flex jus-sp m2" data-v-482bcf8a><div style="${ssrRenderStyle({ "width": "25%", "background-color": "rgb(160,166,62)", "border-radius": "40px", "padding": "2% 5%" })}" data-v-482bcf8a><div style="${ssrRenderStyle({ "width": "50px", "aspect-ratio": "1/1" })}" data-v-482bcf8a><img style="${ssrRenderStyle({ "border-radius": "40px" })}" class="w-sto h_sto"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/3.jpg")} alt="" data-v-482bcf8a></div><p style="${ssrRenderStyle({ "margin-top": "15px", "height": "50%", "font-size": "20px" })}" data-v-482bcf8a>Отличный товар, рекомендую!</p><p style="${ssrRenderStyle({ "margin-top": "45px" })}" class="normal-small" data-v-482bcf8a>asdasd</p></div><div style="${ssrRenderStyle({ "width": "25%", "background-color": "rgb(160,166,62)", "border-radius": "40px", "padding": "2% 5%" })}" data-v-482bcf8a><div style="${ssrRenderStyle({ "width": "50px", "aspect-ratio": "1/1" })}" data-v-482bcf8a><img style="${ssrRenderStyle({ "border-radius": "40px" })}" class="w-sto h_sto"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/3.jpg")} alt="" data-v-482bcf8a></div><p style="${ssrRenderStyle({ "margin-top": "15px", "height": "50%", "font-size": "20px" })}" data-v-482bcf8a>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur dignissimos libero ab, voluptate quo optio?</p><p style="${ssrRenderStyle({ "margin-top": "45px" })}" class="normal-small" data-v-482bcf8a>asdasd</p></div><div style="${ssrRenderStyle({ "width": "25%", "background-color": "rgb(160,166,62)", "border-radius": "40px", "padding": "2% 5%" })}" data-v-482bcf8a><div style="${ssrRenderStyle({ "width": "50px", "aspect-ratio": "1/1" })}" data-v-482bcf8a><img style="${ssrRenderStyle({ "border-radius": "40px" })}" class="w-sto h_sto"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/3.jpg")} alt="" data-v-482bcf8a></div><p style="${ssrRenderStyle({ "margin-top": "15px", "height": "50%", "font-size": "20px" })}" data-v-482bcf8a>Отличный товар, рекомендую!</p><p style="${ssrRenderStyle({ "margin-top": "45px" })}" class="normal-small" data-v-482bcf8a>asdasd</p></div></div></div></div><div class="ref-block w-sto" data-v-482bcf8a><div class="flex w-sto text_in_sot" data-v-482bcf8a><p class="big auto main-text" style="${ssrRenderStyle({ "color": "rgb(241, 195, 96)", "text-shadow": "10px 10px 10px black", "padding": "1%" })}" data-v-482bcf8a>О нашем товаре</p></div><div class="interactiv auto h-sto flex" data-v-482bcf8a><div class="block_info o_product auto" data-v-482bcf8a><div class="predp" data-v-482bcf8a><div class="predp-img auto" data-v-482bcf8a><img width="100%" height="100%"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/3.jpg")} alt="" data-v-482bcf8a></div><p class="small-big predp-name" data-v-482bcf8a>Иваненко И.П.</p><p class="small" data-v-482bcf8a>Директор компании ...</p></div><div class="predp-text flex" data-v-482bcf8a><p class="small-big" data-v-482bcf8a> Наша доставка распространяется на города: Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, architecto veritatis? Aut iure labore qui ut molestiae minima repudiandae obcaecati beatae illo. Aliquam debitis minus consequuntur illum et natus. Incidunt. </p></div></div></div><div class="interactiv" data-v-482bcf8a></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-482bcf8a"]]);
export {
  index as default
};
//# sourceMappingURL=index-4bfdcd90.js.map
