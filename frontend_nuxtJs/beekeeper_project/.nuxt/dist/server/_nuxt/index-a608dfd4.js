import { _ as _export_sfc, e as __nuxt_component_0, b as __nuxt_component_0$1, a as api_root, u as useHead } from "../server.mjs";
import { A as AddBasket, F as FavoriteComp } from "./FavoriteComp-5b75aa9c.js";
import { C as CatalogProduct, T as TovarMinImageList, R as RatingComp, S as SelectVariantMenu } from "./CatalogProduct-01554aae.js";
import { resolveComponent, mergeProps, withCtx, createVNode, toDisplayString, useSSRContext, createTextVNode, openBlock, createBlock, Fragment, renderList } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import axios from "axios";
import "hookable";
import "destr";
import "devalue";
import "klona";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation } from "swiper";
import { L as LoadingComp } from "./LoadingComp-34c86e82.js";
import { n as newsList } from "./newsList-667eb38d.js";
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
const main_css_vue_type_style_index_0_src_6e2f4f66_scoped_6e2f4f66_lang = "";
const hexTovar_css_vue_type_style_index_1_src_6e2f4f66_scoped_6e2f4f66_lang = "";
const PopularProduct_vue_vue_type_style_index_2_lang = "";
const _sfc_main$3 = {
  el: "#product_catalog",
  name: "CatalogProduct",
  props: ["pr"],
  extends: CatalogProduct,
  components: {
    TovarMinImageList,
    AddBasket,
    FavoriteComp,
    RatingComp,
    SelectVariantMenu
  },
  created() {
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_img = __nuxt_component_0;
  const _component_TovarMinImageList = resolveComponent("TovarMinImageList");
  const _component_NuxtLink = __nuxt_component_0$1;
  const _component_rating_comp = resolveComponent("rating-comp");
  const _component_select_variant_menu = resolveComponent("select-variant-menu");
  const _component_AddBasket = resolveComponent("AddBasket");
  const _component_FavoriteComp = resolveComponent("FavoriteComp");
  _push(`<section${ssrRenderAttrs(mergeProps({
    class: "product",
    id: "product_catalog"
  }, _attrs))} data-v-6e2f4f66><div class="product__photo" data-v-6e2f4f66><div class="photo-container" data-v-6e2f4f66><div class="photo-main" data-v-6e2f4f66><div class="controls" data-v-6e2f4f66></div>`);
  _push(ssrRenderComponent(_component_nuxt_img, {
    loading: "lazy",
    format: "webp",
    src: _ctx.$api_root + $props.pr.image.slice(1),
    alt: "green apple slice"
  }, null, _parent));
  _push(`</div>`);
  if (!_ctx.$device.isMobile) {
    _push(ssrRenderComponent(_component_TovarMinImageList, {
      image: $props.pr.image,
      ImageProductList: $props.pr.ImageProductList
    }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div><div class="product__info" data-v-6e2f4f66><div class="title" data-v-6e2f4f66>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    "no-prefetch": "",
    to: `/tovar/${$props.pr.id}`
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p class="small-big product__name" data-v-6e2f4f66${_scopeId}>${ssrInterpolate($props.pr.name)}</p>`);
      } else {
        return [
          createVNode("p", { class: "small-big product__name" }, toDisplayString($props.pr.name), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="very-small product__code" data-v-6e2f4f66>COD: ${ssrInterpolate($props.pr.id)}</span></div>`);
  _push(ssrRenderComponent(_component_rating_comp, {
    rating: $props.pr.rating
  }, null, _parent));
  _push(`<div class="price" data-v-6e2f4f66><span class="product__price small-big" data-v-6e2f4f66>${ssrInterpolate(_ctx.select_productItem.price)} <span class="product__price small" data-v-6e2f4f66>${ssrInterpolate($props.pr.price_currency)}</span></span></div>`);
  _push(ssrRenderComponent(_component_select_variant_menu, {
    select_productItem: _ctx.select_productItem,
    pr: $props.pr,
    onSelect_product: _ctx.select_product
  }, null, _parent));
  _push(`<div class="product__text" data-v-6e2f4f66><p class="small" data-v-6e2f4f66>${ssrInterpolate($props.pr.description.slice(15))}...</p></div><div style="${ssrRenderStyle(_ctx.select_productItem.weight ? "margin-top: 8px" : "margin-top: 56px")}" class="flex" data-v-6e2f4f66>`);
  _push(ssrRenderComponent(_component_AddBasket, {
    id: _ctx.select_productItem.id
  }, null, _parent));
  _push(ssrRenderComponent(_component_FavoriteComp, {
    id: _ctx.select_productItem.id
  }, null, _parent));
  _push(`</div></div></section>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/PopularProduct.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-6e2f4f66"]]);
async function addSending(email) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/sending/manager`,
      method: "post",
      headers: {},
      withCredentials: true,
      data: {
        email
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const sending_vue_vue_type_style_index_0_scoped_d5e5ae5a_lang = "";
const _sfc_main$2 = {
  data() {
    return {
      email: ""
    };
  },
  methods: {
    async add_sending() {
      let r = await addSending(this.email);
      if (r.status == 200) {
        this.$store.REFACTOR_TOOLTIP({
          status: true,
          title: "Успешно"
        });
        this.$store.REFACTOR_USER_SENDING(true);
      } else if (r.status == 401) {
        this.$router.push("/login?message=Для данного действия необходимо авторизоваться");
      }
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<form${ssrRenderAttrs(mergeProps({ class: "email_sending auto m2" }, _attrs))} data-v-d5e5ae5a><p class="normal-small" data-v-d5e5ae5a>Подпишитесь на рассылку, чтобы получать актуальные новости первыми</p><input${ssrRenderAttr("value", $data.email)} placeholder="email" type="email" name="" id="" data-v-d5e5ae5a><button type="submit" data-v-d5e5ae5a><div class="w-sto h_sto flex" data-v-d5e5ae5a><p class="auto small-big" data-v-d5e5ae5a>Подтвердить</p></div></button></form>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sending.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-d5e5ae5a"]]);
const swiper_min = "";
const advantages_slider_vue_vue_type_style_index_0_lang = "";
const _sfc_main$1 = {
  components: {
    Swiper,
    SwiperSlide
  },
  setup() {
    return {
      modules: [Autoplay, Navigation]
    };
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "slider-produtos-wrap auto h_sto",
    style: { "min-height": "400px" }
  }, _attrs))}>`);
  _push(ssrRenderComponent(_component_swiper, {
    slidesPerView: 1,
    spaceBetween: 500,
    navigation: true,
    autoplay: {
      delay: 3e3,
      disableOnInteraction: true
    },
    speed: "1500",
    modules: $setup.modules,
    class: "h_sto"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_swiper_slide, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div class="h_sto flex" style="${ssrRenderStyle({ "min-height": "400px" })}"${_scopeId2}><p style="${ssrRenderStyle([_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }])}" class="${ssrRenderClass([!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"])}"${_scopeId2}>Пасека распологается на территории заповедника с лесным массивом около 6 тыс. га., вдали от всевозможных промышленных и производственных предприятий. Соответственно мёд собран в экологически чистом месте и имеет натуральный состав.</p></div>`);
            } else {
              return [
                createVNode("div", {
                  class: "h_sto flex",
                  style: { "min-height": "400px" }
                }, [
                  createVNode("p", {
                    style: [_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }],
                    class: [!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"]
                  }, "Пасека распологается на территории заповедника с лесным массивом около 6 тыс. га., вдали от всевозможных промышленных и производственных предприятий. Соответственно мёд собран в экологически чистом месте и имеет натуральный состав.", 6)
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_swiper_slide, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div class="h_sto flex" style="${ssrRenderStyle({ "min-height": "400px" })}"${_scopeId2}><p style="${ssrRenderStyle([_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }])}" class="${ssrRenderClass([!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"])}"${_scopeId2}>Большое разнообразие растений, цветущих на близлежащих лугах и в лесу даёт неповторимый аромат и вкус меду.</p></div>`);
            } else {
              return [
                createVNode("div", {
                  class: "h_sto flex",
                  style: { "min-height": "400px" }
                }, [
                  createVNode("p", {
                    style: [_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }],
                    class: [!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"]
                  }, "Большое разнообразие растений, цветущих на близлежащих лугах и в лесу даёт неповторимый аромат и вкус меду.", 6)
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(` `);
        _push2(ssrRenderComponent(_component_swiper_slide, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div class="h_sto flex" style="${ssrRenderStyle({ "min-height": "400px" })}"${_scopeId2}><p style="${ssrRenderStyle([_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }])}" class="${ssrRenderClass([!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"])}"${_scopeId2}>Реализация меда производится в нескольких видах: сотовый мёд - в сотах; забрусовый мёд и разливной мёд- в емкостях разного объёма.</p></div>`);
            } else {
              return [
                createVNode("div", {
                  class: "h_sto flex",
                  style: { "min-height": "400px" }
                }, [
                  createVNode("p", {
                    style: [_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }],
                    class: [!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"]
                  }, "Реализация меда производится в нескольких видах: сотовый мёд - в сотах; забрусовый мёд и разливной мёд- в емкостях разного объёма.", 6)
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_swiper_slide, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div class="h_sto flex" style="${ssrRenderStyle({ "min-height": "400px" })}"${_scopeId2}><p style="${ssrRenderStyle([_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }])}" class="${ssrRenderClass([!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"])}"${_scopeId2}>Чернозем, имеющий в своём составе огромное количество микроэлементов, насыщает ими нектар цветущих растений.</p></div>`);
            } else {
              return [
                createVNode("div", {
                  class: "h_sto flex",
                  style: { "min-height": "400px" }
                }, [
                  createVNode("p", {
                    style: [_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }],
                    class: [!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"]
                  }, "Чернозем, имеющий в своём составе огромное количество микроэлементов, насыщает ими нектар цветущих растений.", 6)
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_swiper_slide, null, {
            default: withCtx(() => [
              createVNode("div", {
                class: "h_sto flex",
                style: { "min-height": "400px" }
              }, [
                createVNode("p", {
                  style: [_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }],
                  class: [!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"]
                }, "Пасека распологается на территории заповедника с лесным массивом около 6 тыс. га., вдали от всевозможных промышленных и производственных предприятий. Соответственно мёд собран в экологически чистом месте и имеет натуральный состав.", 6)
              ])
            ]),
            _: 1
          }),
          createVNode(_component_swiper_slide, null, {
            default: withCtx(() => [
              createVNode("div", {
                class: "h_sto flex",
                style: { "min-height": "400px" }
              }, [
                createVNode("p", {
                  style: [_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }],
                  class: [!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"]
                }, "Большое разнообразие растений, цветущих на близлежащих лугах и в лесу даёт неповторимый аромат и вкус меду.", 6)
              ])
            ]),
            _: 1
          }),
          createTextVNode(),
          createVNode(_component_swiper_slide, null, {
            default: withCtx(() => [
              createVNode("div", {
                class: "h_sto flex",
                style: { "min-height": "400px" }
              }, [
                createVNode("p", {
                  style: [_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }],
                  class: [!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"]
                }, "Реализация меда производится в нескольких видах: сотовый мёд - в сотах; забрусовый мёд и разливной мёд- в емкостях разного объёма.", 6)
              ])
            ]),
            _: 1
          }),
          createVNode(_component_swiper_slide, null, {
            default: withCtx(() => [
              createVNode("div", {
                class: "h_sto flex",
                style: { "min-height": "400px" }
              }, [
                createVNode("p", {
                  style: [_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }],
                  class: [!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"]
                }, "Чернозем, имеющий в своём составе огромное количество микроэлементов, насыщает ими нектар цветущих растений.", 6)
              ])
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/advantages_slider.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Advantages_slider = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const index_vue_vue_type_style_index_0_lang = "";
const main_css_vue_type_style_index_1_src_96459931_scoped_96459931_lang = "";
const news_min_css_vue_type_style_index_2_src_96459931_scoped_96459931_lang = "";
const hexTovar_css_vue_type_style_index_3_src_96459931_scoped_96459931_lang = "";
const index_vue_vue_type_style_index_4_lang = "";
const _sfc_main = {
  name: "IndexItem",
  components: {
    Swiper,
    SwiperSlide,
    LoadingComp,
    Advantages_slider
  },
  data() {
    return {
      popular_product: null,
      wrapper_active: false,
      type_weigth_id: null,
      type_pack_id: null,
      news: []
    };
  },
  async created() {
  },
  async mounted() {
    self = this;
    axios({
      url: `${this.$api_root}api/v0.1/beekeeper_web_api/get_popular_product?size=5`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.$store.assess_token != "" ? `Bearer ${this.$store.assess_token}` : void 0
      }
    }).then((response) => this.popular_product = response.data).catch(function(error) {
      console.log(error);
    });
    console.log(this.popular_product);
    this.wrapper_active = true;
    let recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute(
      "src",
      `${this.$api_root}static/online_store/js/main.js`
    );
    document.head.appendChild(recaptchaScript);
    let r = await newsList(0, 3);
    this.news = r.data;
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
    useHead({
      title: "Пчелиная артель - Главная",
      meta: [
        { name: "description", content: "My amazing site." }
      ]
    });
    return {
      modules: [Autoplay, Navigation]
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_img = __nuxt_component_0;
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  const _component_Advantages_slider = resolveComponent("Advantages_slider");
  const _component_AddtionalCompPopularProduct = __nuxt_component_1;
  const _component_LoadingComp = resolveComponent("LoadingComp");
  const _component_NuxtLink = __nuxt_component_0$1;
  const _component_Sending = __nuxt_component_3;
  _push(`<div${ssrRenderAttrs(mergeProps({ style: { "padding-top": "50px" } }, _attrs))} data-v-96459931><div class="wrapper" data-v-96459931>`);
  _push(ssrRenderComponent(_component_nuxt_img, {
    format: "webp",
    rel: "preconnect",
    sizes: "sm:100vw md:100vw lg:100vw",
    class: "absolute w-sto h_sto",
    src: "/images/main.webp",
    alt: ""
  }, null, _parent));
  _push(`<div class="${ssrRenderClass([$data.wrapper_active ? "actives" : "", "absolute main-nak"])}" data-v-96459931></div><div class="main relative" data-v-96459931><div class="interactiv flex" data-v-96459931><div class="main_center auto" data-v-96459931><div class="main_text_div auto" data-v-96459931><p class="main_text" data-v-96459931>Наш мед имеет ряд преимуществ!</p><div class="bt flex m2" data-v-96459931><button style="${ssrRenderStyle(_ctx.$device.isDesktop ? "width: 45%; margin: 0;" : "")}" class="main_bt" data-v-96459931><div class="flex sto" data-v-96459931><p class="main_bt_p" data-v-96459931>Попробовать!</p></div></button>`);
  if (_ctx.$device.isDesktop) {
    _push(`<a href="#advantages" style="${ssrRenderStyle({ "margin": "0", "margin-left": "0px", "width": "45%" })}" class="main_bt" data-v-96459931><div class="flex sto" data-v-96459931><p class="main_bt_p" data-v-96459931>Посмотреть!</p></div></a>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
  if (!_ctx.$device.isMobileOrTablet) {
    _push(`<div class="main_img_div" data-v-96459931><img${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/phel.png`)} class="phel" alt="" data-v-96459931><div class="slider-produtos-wrap h_sto" data-v-96459931>`);
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
                _push3(`<img${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/honey.png")} class="main_img" width="100%" height="100%" alt="" data-v-96459931${_scopeId2}>`);
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
                _push3(`<img${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/honey.png")} class="main_img" width="100%" height="100%" alt="" data-v-96459931${_scopeId2}>`);
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
                _push3(`<img${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/honey.png")} class="main_img" width="100%" height="100%" alt="" data-v-96459931${_scopeId2}>`);
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
    _push(`</div></div>`);
  } else {
    _push(`<div data-v-96459931><div style="${ssrRenderStyle({ "display": "block" })}" class="" data-v-96459931><div class="flex w-sto jus-sp info_kart_div" data-v-96459931><div class="w-sto flex" data-v-96459931><div class="w-sto auto auto" data-v-96459931>`);
    _push(ssrRenderComponent(_component_Advantages_slider, null, null, _parent));
    _push(`</div></div></div></div></div>`);
  }
  _push(`</div></div></div></div><div class="sot" data-v-96459931><div class="interactiv auto" data-v-96459931><div class="flex w-sto text_in_sot" data-v-96459931><p class="big auto main-text" data-v-96459931>Популярные товары</p></div><div class="block_info sliders big-block" data-v-96459931><div class="slider-produtos-wrap" data-v-96459931>`);
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
                  _push3(`<div class="hex slide auto" data-v-96459931${_scopeId2}>`);
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
    _push(`<div class="w-sto h_sto" data-v-96459931>`);
    _push(ssrRenderComponent(_component_LoadingComp, null, null, _parent));
    _push(`</div>`);
  }
  _push(`</div></div>`);
  if (_ctx.$device.isDesktop) {
    _push(`<div class="flex w-sto text_in_sot relative" data-v-96459931><div id="advantages" class="absolute" style="${ssrRenderStyle({ "top": "-80%" })}" data-v-96459931></div><p class="big auto main-text" data-v-96459931>Наши преимущества</p></div>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.$device.isDesktop) {
    _push(`<div style="${ssrRenderStyle({ "display": "block" })}" class="block_info" data-v-96459931><div class="flex w-sto jus-sp info_kart_div" data-v-96459931><div class="w-sto flex" data-v-96459931><div class="w-sto auto auto" data-v-96459931>`);
    _push(ssrRenderComponent(_component_Advantages_slider, null, null, _parent));
    _push(`</div></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div style="${ssrRenderStyle({ "display": "block" })}" class="block_info" data-v-96459931><div class="flex w-sto jus-sp info_kart_div" data-v-96459931><div class="kart" data-v-96459931><div class="w-sto h_sto" data-v-96459931>`);
  _push(ssrRenderComponent(_component_nuxt_img, {
    loading: "lazy",
    format: "webp",
    style: { "border-radius": "40px" },
    class: "w-sto h_sto",
    src: "/images/eco-friend.jpg",
    alt: ""
  }, null, _parent));
  _push(`</div></div><div class="dostav_info flex" data-v-96459931><div class="w-sto auto" data-v-96459931><p class="small-big VAG" style="${ssrRenderStyle({ "line-height": "1" })}" data-v-96459931>Чистый как золото, на вкус как солнечный свет</p><p class="small m2" data-v-96459931> Наш мед является исключительно натуральным продуктом. Без примесей, без химии. </p></div></div></div></div><div class="interactiv auto" data-v-96459931><div class="flex w-sto text_in_sot" data-v-96459931><p class="big auto main-text" data-v-96459931>Новости</p></div><section style="${ssrRenderStyle({ "padding": "5%" })}" class="auto grid" data-v-96459931><!--[-->`);
  ssrRenderList($data.news, (new_obj) => {
    _push(`<article class="grid-item" data-v-96459931><div class="image" data-v-96459931><img${ssrRenderAttr("src", this.$api_root + new_obj.main_image.slice(1))} data-v-96459931></div><div class="info" data-v-96459931>`);
    _push(ssrRenderComponent(_component_NuxtLink, {
      "no-prefetch": "",
      to: `/news/${new_obj.id}`
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<h2 class="VAG" data-v-96459931${_scopeId}>${ssrInterpolate(new_obj.title)}</h2>`);
        } else {
          return [
            createVNode("h2", { class: "VAG" }, toDisplayString(new_obj.title), 1)
          ];
        }
      }),
      _: 2
    }, _parent));
    _push(`<div class="info-text" data-v-96459931><p data-v-96459931>${ssrInterpolate(new_obj.main_text.slice(40))}...</p></div><div class="button-wrap" data-v-96459931>`);
    _push(ssrRenderComponent(_component_NuxtLink, {
      "no-prefetch": "",
      class: "atuin-btn",
      to: `/news/${new_obj.id}`
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`Подробнее`);
        } else {
          return [
            createTextVNode("Подробнее")
          ];
        }
      }),
      _: 2
    }, _parent));
    _push(`</div></div></article>`);
  });
  _push(`<!--]--></section>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    "no-prefetch": "",
    to: `/news`
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<button style="${ssrRenderStyle({ "background": "rgb(160,166,62)", "cursor": "pointer", "width": "100%", "border": "none", "border-radius": "6px", "padding": "2% 3%" })}" data-v-96459931${_scopeId}><div class="w-sto h_sto flex" data-v-96459931${_scopeId}><p class="auto small-big" data-v-96459931${_scopeId}>Все новости</p></div></button>`);
      } else {
        return [
          createVNode("button", { style: { "background": "rgb(160,166,62)", "cursor": "pointer", "width": "100%", "border": "none", "border-radius": "6px", "padding": "2% 3%" } }, [
            createVNode("div", { class: "w-sto h_sto flex" }, [
              createVNode("p", { class: "auto small-big" }, "Все новости")
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
  if (!_ctx.$store.getUser.is_sending) {
    _push(`<div class="interactiv auto" data-v-96459931><div class="flex w-sto text_in_sot" data-v-96459931><p class="big auto main-text" data-v-96459931>Рассылка</p></div>`);
    _push(ssrRenderComponent(_component_Sending, null, null, _parent));
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="ref-block w-sto" data-v-96459931><div class="flex w-sto text_in_sot" data-v-96459931><p class="big auto main-text" style="${ssrRenderStyle({ "color": "rgb(241, 195, 96)", "text-shadow": "10px 10px 10px black", "padding": "1%" })}" data-v-96459931>О нашем товаре</p></div><div class="interactiv auto h-sto flex" data-v-96459931><div class="block_info o_product auto" data-v-96459931><div class="predp" data-v-96459931><div class="predp-img auto" data-v-96459931><img width="100%" height="100%"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/3.jpg")} alt="" data-v-96459931></div><p class="small-big predp-name" data-v-96459931>Иваненко И.П.</p><p class="small" data-v-96459931>Директор компании ...</p></div><div class="predp-text flex" data-v-96459931><p class="small-big" data-v-96459931> Наша доставка распространяется на города: Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, architecto veritatis? Aut iure labore qui ut molestiae minima repudiandae obcaecati beatae illo. Aliquam debitis minus consequuntur illum et natus. Incidunt. </p></div></div></div><div class="interactiv" data-v-96459931></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-96459931"]]);
export {
  index as default
};
//# sourceMappingURL=index-a608dfd4.js.map
