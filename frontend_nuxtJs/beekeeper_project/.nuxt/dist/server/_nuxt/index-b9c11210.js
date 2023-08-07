import { _ as _export_sfc, b as __nuxt_component_0$1, a as api_root, u as useCookie } from "../server.mjs";
import { A as AddBasket, F as FavoriteComp } from "./FavoriteComp-daadb83c.js";
import { C as CatalogProduct, T as TovarMinImageList, R as RatingComp, S as SelectVariantMenu } from "./CatalogProduct-f8f888d4.js";
import { resolveComponent, mergeProps, withCtx, createVNode, toDisplayString, useSSRContext, openBlock, createBlock, Fragment, renderList, createTextVNode } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import "hookable";
import "devalue";
import "klona";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation } from "swiper";
import { L as LoadingComp } from "./LoadingComp-34c86e82.js";
import { n as newsList } from "./newsList-54d7dd14.js";
import "ofetch";
import "#internal/nitro";
import "unctx";
import "@vue/devtools-api";
import "destr";
import "h3";
import "@unhead/ssr";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "ufo";
import "cookie-es";
import "ohash";
import "defu";
const main_css_vue_type_style_index_0_src_f830eaa9_scoped_f830eaa9_lang = "";
const hexTovar_css_vue_type_style_index_1_src_f830eaa9_scoped_f830eaa9_lang = "";
const PopularProduct_vue_vue_type_style_index_2_lang = "";
const _sfc_main$2 = {
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
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TovarMinImageList = resolveComponent("TovarMinImageList");
  const _component_NuxtLink = __nuxt_component_0$1;
  const _component_rating_comp = resolveComponent("rating-comp");
  const _component_select_variant_menu = resolveComponent("select-variant-menu");
  const _component_AddBasket = resolveComponent("AddBasket");
  const _component_FavoriteComp = resolveComponent("FavoriteComp");
  _push(`<section${ssrRenderAttrs(mergeProps({
    class: "product",
    id: "product_catalog"
  }, _attrs))} data-v-f830eaa9><div class="product__photo" data-v-f830eaa9><div class="photo-container" data-v-f830eaa9><div class="photo-main" data-v-f830eaa9><div class="controls" data-v-f830eaa9></div><img${ssrRenderAttr("src", _ctx.$api_root + $props.pr.image)} alt="green apple slice" data-v-f830eaa9></div>`);
  _push(ssrRenderComponent(_component_TovarMinImageList, {
    image: $props.pr.image,
    ImageProductList: $props.pr.ImageProductList
  }, null, _parent));
  _push(`</div></div><div class="product__info" data-v-f830eaa9><div class="title" data-v-f830eaa9>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    "no-prefetch": "",
    to: `/tovar/${$props.pr.id}`
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p class="small-big product__name" data-v-f830eaa9${_scopeId}>${ssrInterpolate($props.pr.name)}</p>`);
      } else {
        return [
          createVNode("p", { class: "small-big product__name" }, toDisplayString($props.pr.name), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="very-small product__code" data-v-f830eaa9>COD: ${ssrInterpolate($props.pr.id)}</span></div>`);
  _push(ssrRenderComponent(_component_rating_comp, {
    rating: $props.pr.rating
  }, null, _parent));
  _push(`<div class="price" data-v-f830eaa9><span class="product__price small-big" data-v-f830eaa9>${ssrInterpolate(_ctx.select_productItem.price)} <span class="product__price small" data-v-f830eaa9>${ssrInterpolate($props.pr.price_currency)}</span></span></div>`);
  _push(ssrRenderComponent(_component_select_variant_menu, {
    select_productItem: _ctx.select_productItem,
    pr: $props.pr,
    onSelect_product: _ctx.select_product
  }, null, _parent));
  _push(`<div class="product__text" data-v-f830eaa9><p class="small" data-v-f830eaa9>${ssrInterpolate($props.pr.description.slice(15))}...</p></div><div style="${ssrRenderStyle(_ctx.select_productItem.weight ? "margin-top: 8px" : "margin-top: 56px")}" class="flex" data-v-f830eaa9>`);
  _push(ssrRenderComponent(_component_AddBasket, {
    style: { "width": "30%" },
    id: _ctx.select_productItem.id
  }, null, _parent));
  _push(ssrRenderComponent(_component_FavoriteComp, {
    id: _ctx.select_productItem.id
  }, null, _parent));
  _push(`</div></div></section>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/PopularProduct.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-f830eaa9"]]);
async function addSending(email) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/sending/manager`,
      method: "post",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      },
      data: {
        email
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const sending_vue_vue_type_style_index_0_scoped_4b45b351_lang = "";
const _sfc_main$1 = {
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
      }
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<form${ssrRenderAttrs(mergeProps({ class: "email_sending auto m2" }, _attrs))} data-v-4b45b351><p class="normal-small" data-v-4b45b351>Подпишитесь на рассылку, чтобы получать актуальные новости первыми</p><input${ssrRenderAttr("value", $data.email)} placeholder="email" type="email" name="" id="" data-v-4b45b351><button type="submit" data-v-4b45b351><div class="w-sto h_sto flex" data-v-4b45b351><p class="auto small-big" data-v-4b45b351>Подтвердить</p></div></button></form>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sending.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-4b45b351"]]);
const swiper_min = "";
const _imports_0 = "" + __buildAssetsURL("eco-friend.3cab6412.jpg");
const index_vue_vue_type_style_index_0_lang = "";
const main_css_vue_type_style_index_1_src_3c629cbe_scoped_3c629cbe_lang = "";
const news_min_css_vue_type_style_index_2_src_3c629cbe_scoped_3c629cbe_lang = "";
const hexTovar_css_vue_type_style_index_3_src_3c629cbe_scoped_3c629cbe_lang = "";
const index_vue_vue_type_style_index_4_scoped_3c629cbe_lang = "";
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
      type_pack_id: null,
      news: []
    };
  },
  async created() {
  },
  async mounted() {
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
  const _component_NuxtLink = __nuxt_component_0$1;
  const _component_Sending = __nuxt_component_2;
  _push(`<div${ssrRenderAttrs(mergeProps({ style: { "padding-top": "50px" } }, _attrs))} data-v-3c629cbe><div class="wrapper" data-v-3c629cbe><div class="${ssrRenderClass([$data.wrapper_active ? "actives" : "", "absolute main-nak"])}" data-v-3c629cbe></div><div class="main relative" data-v-3c629cbe><div class="interactiv flex" data-v-3c629cbe><div class="main_center auto" data-v-3c629cbe><div class="main_text_div auto" data-v-3c629cbe><p class="main_text" data-v-3c629cbe>Наш мед имеет ряд преимуществ!</p><div class="bt" data-v-3c629cbe><button class="main_bt" data-v-3c629cbe><div class="flex sto" data-v-3c629cbe><p class="main_bt_p" data-v-3c629cbe>Попробовать!</p></div></button></div></div>`);
  if (!_ctx.$device.isMobile) {
    _push(`<div class="main_img_div" data-v-3c629cbe><img${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/phel.png`)} class="phel" alt="" data-v-3c629cbe><div class="slider-produtos-wrap h_sto" data-v-3c629cbe>`);
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
                _push3(`<img${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/honey.png")} class="main_img" width="100%" height="100%" alt="" data-v-3c629cbe${_scopeId2}>`);
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
                _push3(`<img${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/honey.png")} class="main_img" width="100%" height="100%" alt="" data-v-3c629cbe${_scopeId2}>`);
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
                _push3(`<img${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/honey.png")} class="main_img" width="100%" height="100%" alt="" data-v-3c629cbe${_scopeId2}>`);
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
    _push(`<!---->`);
  }
  _push(`</div></div></div></div><div class="sot" data-v-3c629cbe><div class="interactiv auto" data-v-3c629cbe><div class="flex w-sto text_in_sot" data-v-3c629cbe><p class="big auto main-text" data-v-3c629cbe>Популярные товары</p></div><div class="block_info sliders big-block" data-v-3c629cbe><div class="slider-produtos-wrap" data-v-3c629cbe>`);
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
                  _push3(`<div class="hex slide auto" data-v-3c629cbe${_scopeId2}>`);
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
    _push(`<div class="w-sto h_sto" data-v-3c629cbe>`);
    _push(ssrRenderComponent(_component_LoadingComp, null, null, _parent));
    _push(`</div>`);
  }
  _push(`</div></div><div style="${ssrRenderStyle({ "display": "block" })}" class="block_info" data-v-3c629cbe><div class="flex w-sto jus-sp info_kart_div" data-v-3c629cbe><div class="kart" data-v-3c629cbe><div class="w-sto h_sto" data-v-3c629cbe><img style="${ssrRenderStyle({ "border-radius": "40px" })}" class="w-sto h_sto"${ssrRenderAttr("src", _imports_0)} alt="" data-v-3c629cbe></div></div><div class="dostav_info flex" data-v-3c629cbe><div class="w-sto auto" data-v-3c629cbe><p class="small-big VAG" style="${ssrRenderStyle({ "line-height": "1" })}" data-v-3c629cbe>Чистый как золото, на вкус как солнечный свет</p><p class="small m2" data-v-3c629cbe> Наш мед является исключительно натуральным продуктом. Без примесей, без химии. </p></div></div></div></div><div class="interactiv auto" data-v-3c629cbe><div class="flex w-sto text_in_sot" data-v-3c629cbe><p class="big auto main-text" data-v-3c629cbe>Новости</p></div><section style="${ssrRenderStyle({ "padding": "5%" })}" class="auto grid" data-v-3c629cbe><!--[-->`);
  ssrRenderList($data.news, (new_obj) => {
    _push(`<article class="grid-item" data-v-3c629cbe><div class="image" data-v-3c629cbe><img${ssrRenderAttr("src", this.$api_root + new_obj.main_image)} data-v-3c629cbe></div><div class="info" data-v-3c629cbe>`);
    _push(ssrRenderComponent(_component_NuxtLink, {
      "no-prefetch": "",
      to: `/news/${new_obj.id}`
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<h2 class="VAG" data-v-3c629cbe${_scopeId}>${ssrInterpolate(new_obj.title)}</h2>`);
        } else {
          return [
            createVNode("h2", { class: "VAG" }, toDisplayString(new_obj.title), 1)
          ];
        }
      }),
      _: 2
    }, _parent));
    _push(`<div class="info-text" data-v-3c629cbe><p data-v-3c629cbe>${ssrInterpolate(new_obj.main_text.slice(40))}...</p></div><div class="button-wrap" data-v-3c629cbe>`);
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
        _push2(`<button style="${ssrRenderStyle({ "background": "rgb(160,166,62)", "cursor": "pointer", "width": "100%", "border": "none", "border-radius": "6px", "padding": "2% 3%" })}" data-v-3c629cbe${_scopeId}><div class="w-sto h_sto flex" data-v-3c629cbe${_scopeId}><p class="auto small-big" data-v-3c629cbe${_scopeId}>Все новости</p></div></button>`);
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
    _push(`<div class="interactiv auto" data-v-3c629cbe><div class="flex w-sto text_in_sot" data-v-3c629cbe><p class="big auto main-text" data-v-3c629cbe>Рассылка</p></div>`);
    _push(ssrRenderComponent(_component_Sending, null, null, _parent));
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="ref-block w-sto" data-v-3c629cbe><div class="flex w-sto text_in_sot" data-v-3c629cbe><p class="big auto main-text" style="${ssrRenderStyle({ "color": "rgb(241, 195, 96)", "text-shadow": "10px 10px 10px black", "padding": "1%" })}" data-v-3c629cbe>О нашем товаре</p></div><div class="interactiv auto h-sto flex" data-v-3c629cbe><div class="block_info o_product auto" data-v-3c629cbe><div class="predp" data-v-3c629cbe><div class="predp-img auto" data-v-3c629cbe><img width="100%" height="100%"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/3.jpg")} alt="" data-v-3c629cbe></div><p class="small-big predp-name" data-v-3c629cbe>Иваненко И.П.</p><p class="small" data-v-3c629cbe>Директор компании ...</p></div><div class="predp-text flex" data-v-3c629cbe><p class="small-big" data-v-3c629cbe> Наша доставка распространяется на города: Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, architecto veritatis? Aut iure labore qui ut molestiae minima repudiandae obcaecati beatae illo. Aliquam debitis minus consequuntur illum et natus. Incidunt. </p></div></div></div><div class="interactiv" data-v-3c629cbe></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-3c629cbe"]]);
export {
  index as default
};
//# sourceMappingURL=index-b9c11210.js.map
