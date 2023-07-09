import { b as buildAssetsURL } from '../../handlers/renderer.mjs';
import { _ as _export_sfc, b as __nuxt_component_0$1 } from '../server.mjs';
import { A as AddBasket, F as FavoriteComp, R as RatingComp } from './RatingComp-dae9c6eb.mjs';
import { C as CatalogProduct, T as TovarMinImageList } from './CatalogProduct-3698dd23.mjs';
import { useSSRContext, resolveComponent, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, mergeProps, toDisplayString } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Navigation } from 'swiper';
import { L as LoadingComp } from './LoadingComp-34c86e82.mjs';
import axios from 'axios';
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
import './removeFavorite-c9297cac.mjs';

const _sfc_main$1 = {
  el: "#product_catalog",
  name: "CatalogProduct",
  props: ["pr"],
  extends: CatalogProduct,
  components: {
    TovarMinImageList,
    AddBasket,
    FavoriteComp,
    RatingComp
  },
  created() {
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TovarMinImageList = resolveComponent("TovarMinImageList");
  const _component_NuxtLink = __nuxt_component_0$1;
  const _component_rating_comp = resolveComponent("rating-comp");
  const _component_AddBasket = resolveComponent("AddBasket");
  const _component_FavoriteComp = resolveComponent("FavoriteComp");
  _push(`<section${ssrRenderAttrs(mergeProps({
    class: "product",
    id: "product_catalog"
  }, _attrs))} data-v-aee34c74><div class="product__photo" data-v-aee34c74><div class="photo-container" data-v-aee34c74><div class="photo-main" data-v-aee34c74><div class="controls" data-v-aee34c74></div><img${ssrRenderAttr("src", _ctx.$api_root + $props.pr.image)} alt="green apple slice" data-v-aee34c74></div>`);
  _push(ssrRenderComponent(_component_TovarMinImageList, {
    image: $props.pr.image,
    ImageProductList: $props.pr.ImageProductList
  }, null, _parent));
  _push(`</div></div><div class="product__info" data-v-aee34c74><div class="title" data-v-aee34c74>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    "no-prefetch": "",
    to: `/tovar/${$props.pr.id}`
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p class="small-big product__name" data-v-aee34c74${_scopeId}>${ssrInterpolate($props.pr.name)}</p>`);
      } else {
        return [
          createVNode("p", { class: "small-big product__name" }, toDisplayString($props.pr.name), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="very-small product__code" data-v-aee34c74>COD: ${ssrInterpolate($props.pr.id)}</span></div>`);
  _push(ssrRenderComponent(_component_rating_comp, {
    rating: $props.pr.rating
  }, null, _parent));
  _push(`<div class="price" data-v-aee34c74><span class="product__price small-big" data-v-aee34c74>${ssrInterpolate($props.pr.price)} <span class="product__price small" data-v-aee34c74>${ssrInterpolate($props.pr.price_currency)}</span></span></div><div class="variant" data-v-aee34c74><h3 data-v-aee34c74>\u0420\u0430\u0437\u043C\u0435\u0440</h3><div class="flex" data-v-aee34c74><ul class="variant-ul" data-v-aee34c74><!--[-->`);
  ssrRenderList($props.pr.list_weight, (ls_w, index2) => {
    _push(`<li class="${ssrRenderClass([_ctx.type_weigth_id == ls_w.id ? "active" : "", "photo-album-li"])}" data-v-aee34c74><div class="h_sto" data-v-aee34c74><p data-v-aee34c74>${ssrInterpolate(ls_w.weight)} \u0433\u0440</p></div></li>`);
  });
  _push(`<!--]--></ul></div><h3 data-v-aee34c74>\u0422\u0438\u043F \u0443\u043F\u0430\u043A\u043E\u0432\u043A\u0438</h3><div class="flex" data-v-aee34c74><ul class="variant-ul" data-v-aee34c74><!--[-->`);
  ssrRenderList($props.pr.type_packaging, (ty_pck, index2) => {
    _push(`<li class="${ssrRenderClass([_ctx.type_pack_id == ty_pck.id ? "active" : "", "photo-album-li"])}" data-v-aee34c74><div class="h_sto" data-v-aee34c74><p data-v-aee34c74>${ssrInterpolate(ty_pck.name)}</p></div></li>`);
  });
  _push(`<!--]--></ul></div></div><div class="product__text" data-v-aee34c74><p class="small" data-v-aee34c74>${ssrInterpolate($props.pr.description)}</p></div><div class="flex" data-v-aee34c74>`);
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
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-aee34c74"]]);
const _imports_0 = "" + buildAssetsURL("eco-friend.3cab6412.jpg");
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
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-24b59035><div class="wrapper" data-v-24b59035><div class="${ssrRenderClass([$data.wrapper_active ? "actives" : "", "absolute main-nak"])}" data-v-24b59035></div><div class="main relative" data-v-24b59035><div class="interactiv flex" data-v-24b59035><div class="main_center auto" data-v-24b59035><div class="main_text_div auto" data-v-24b59035><p class="main_text" data-v-24b59035>\u041D\u0430\u0448 \u043C\u0435\u0434 \u0438\u043C\u0435\u0435\u0442 \u0440\u044F\u0434 \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432!</p><div class="bt" data-v-24b59035><button class="main_bt" data-v-24b59035><div class="flex sto" data-v-24b59035><p class="main_bt_p" data-v-24b59035>\u041F\u043E\u043F\u0440\u043E\u0431\u043E\u0432\u0430\u0442\u044C!</p></div></button></div></div><div class="main_img_div" data-v-24b59035><img${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/phel.png`)} class="phel" alt="" data-v-24b59035><div class="slider-produtos-wrap h_sto" data-v-24b59035>`);
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
              _push3(`<img${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/honey.png")} class="main_img" width="100%" height="100%" alt="" data-v-24b59035${_scopeId2}>`);
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
              _push3(`<img${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/honey.png")} class="main_img" width="100%" height="100%" alt="" data-v-24b59035${_scopeId2}>`);
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
              _push3(`<img${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/honey.png")} class="main_img" width="100%" height="100%" alt="" data-v-24b59035${_scopeId2}>`);
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
  _push(`</div></div></div></div></div></div><div class="sot" data-v-24b59035><div class="interactiv auto" data-v-24b59035><div class="flex w-sto text_in_sot" data-v-24b59035><p class="big auto main-text" data-v-24b59035>\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0442\u043E\u0432\u0430\u0440\u044B</p></div><div class="block_info sliders big-block" data-v-24b59035><div class="slider-produtos-wrap" data-v-24b59035>`);
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
                  _push3(`<div class="hex slide auto" data-v-24b59035${_scopeId2}>`);
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
    _push(`<div class="w-sto h_sto" data-v-24b59035>`);
    _push(ssrRenderComponent(_component_LoadingComp, null, null, _parent));
    _push(`</div>`);
  }
  _push(`</div></div><div style="${ssrRenderStyle({ "display": "block" })}" class="block_info" data-v-24b59035><div class="flex w-sto jus-sp info_kart_div" data-v-24b59035><div class="kart" data-v-24b59035><div class="w-sto h_sto" data-v-24b59035><img style="${ssrRenderStyle({ "border-radius": "40px" })}" class="w-sto h_sto"${ssrRenderAttr("src", _imports_0)} alt="" data-v-24b59035></div></div><div class="dostav_info flex" data-v-24b59035><div class="w-sto auto" data-v-24b59035><p class="small-big VAG" style="${ssrRenderStyle({ "line-height": "1" })}" data-v-24b59035>\u0427\u0438\u0441\u0442\u044B\u0439 \u043A\u0430\u043A \u0437\u043E\u043B\u043E\u0442\u043E, \u043D\u0430 \u0432\u043A\u0443\u0441 \u043A\u0430\u043A \u0441\u043E\u043B\u043D\u0435\u0447\u043D\u044B\u0439 \u0441\u0432\u0435\u0442</p><p class="small m2" data-v-24b59035> \u041D\u0430\u0448 \u043C\u0435\u0434 \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0438\u0441\u043A\u043B\u044E\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u043D\u0430\u0442\u0443\u0440\u0430\u043B\u044C\u043D\u044B\u043C \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u043E\u043C. \u0411\u0435\u0437 \u043F\u0440\u0438\u043C\u0435\u0441\u0435\u0439, \u0431\u0435\u0437 \u0445\u0438\u043C\u0438\u0438. </p></div></div></div></div></div><div class="ref-block w-sto" data-v-24b59035><div class="flex w-sto text_in_sot" data-v-24b59035><p class="big auto main-text" style="${ssrRenderStyle({ "color": "rgb(241, 195, 96)", "text-shadow": "10px 10px 10px black", "padding": "1%" })}" data-v-24b59035>\u041E \u043D\u0430\u0448\u0435\u043C \u0442\u043E\u0432\u0430\u0440\u0435</p></div><div class="interactiv auto h-sto flex" data-v-24b59035><div class="block_info o_product auto" data-v-24b59035><div class="predp" data-v-24b59035><div class="predp-img auto" data-v-24b59035><img width="100%" height="100%"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/3.jpg")} alt="" data-v-24b59035></div><p class="small-big predp-name" data-v-24b59035>\u0418\u0432\u0430\u043D\u0435\u043D\u043A\u043E \u0418.\u041F.</p><p class="small" data-v-24b59035>\u0414\u0438\u0440\u0435\u043A\u0442\u043E\u0440 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438 ...</p></div><div class="predp-text flex" data-v-24b59035><p class="small-big" data-v-24b59035> \u041D\u0430\u0448\u0430 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430 \u0440\u0430\u0441\u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F \u043D\u0430 \u0433\u043E\u0440\u043E\u0434\u0430: Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, architecto veritatis? Aut iure labore qui ut molestiae minima repudiandae obcaecati beatae illo. Aliquam debitis minus consequuntur illum et natus. Incidunt. </p></div></div></div><div class="interactiv" data-v-24b59035></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-24b59035"]]);

export { index as default };
//# sourceMappingURL=index-335b8b19.mjs.map
