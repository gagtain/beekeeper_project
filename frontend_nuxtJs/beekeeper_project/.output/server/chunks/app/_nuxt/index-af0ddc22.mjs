import { _ as _export_sfc, u as useHead, f as __nuxt_component_0$1, e as __nuxt_component_0$2, b as api_root } from '../server.mjs';
import { A as AddBasket, F as FavoriteComp } from './FavoriteComp-443120c2.mjs';
import { C as CatalogProduct, T as TovarMinImageList, R as RatingComp, S as SelectVariantMenu } from './CatalogProduct-14f75819.mjs';
import { useSSRContext, resolveComponent, mergeProps, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createTextVNode, createCommentVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Navigation } from 'swiper';
import { L as LoadingComp } from './LoadingComp-34c86e82.mjs';
import { n as newsList } from './newsList-b6c2f51f.mjs';
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
import 'ipx';

const _sfc_main$4 = {
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
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_img = __nuxt_component_0$1;
  const _component_TovarMinImageList = resolveComponent("TovarMinImageList");
  const _component_NuxtLink = __nuxt_component_0$2;
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/PopularProduct.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4], ["__scopeId", "data-v-6e2f4f66"]]);
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
const _sfc_main$3 = {
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
          title: "\u0423\u0441\u043F\u0435\u0448\u043D\u043E"
        });
        this.$store.REFACTOR_USER_SENDING(true);
      } else if (r.status == 401) {
        this.$router.push("/login?message=\u0414\u043B\u044F \u0434\u0430\u043D\u043D\u043E\u0433\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u0442\u044C\u0441\u044F");
      }
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<form${ssrRenderAttrs(mergeProps({ class: "email_sending auto m2" }, _attrs))} data-v-d5e5ae5a><p class="normal-small" data-v-d5e5ae5a>\u041F\u043E\u0434\u043F\u0438\u0448\u0438\u0442\u0435\u0441\u044C \u043D\u0430 \u0440\u0430\u0441\u0441\u044B\u043B\u043A\u0443, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u044C \u0430\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u044B\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u043F\u0435\u0440\u0432\u044B\u043C\u0438</p><input${ssrRenderAttr("value", $data.email)} placeholder="email" type="email" name="" id="" data-v-d5e5ae5a><button type="submit" data-v-d5e5ae5a><div class="w-sto h_sto flex" data-v-d5e5ae5a><p class="auto small-big" data-v-d5e5ae5a>\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C</p></div></button></form>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sending.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-d5e5ae5a"]]);
const _sfc_main$2 = {
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
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
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
              _push3(`<div class="h_sto flex" style="${ssrRenderStyle({ "min-height": "400px" })}"${_scopeId2}><p style="${ssrRenderStyle([_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }])}" class="${ssrRenderClass([!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"])}"${_scopeId2}>\u041F\u0430\u0441\u0435\u043A\u0430 \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0433\u0430\u0435\u0442\u0441\u044F \u043D\u0430 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438 \u0437\u0430\u043F\u043E\u0432\u0435\u0434\u043D\u0438\u043A\u0430 \u0441 \u043B\u0435\u0441\u043D\u044B\u043C \u043C\u0430\u0441\u0441\u0438\u0432\u043E\u043C \u043E\u043A\u043E\u043B\u043E 6 \u0442\u044B\u0441. \u0433\u0430., \u0432\u0434\u0430\u043B\u0438 \u043E\u0442 \u0432\u0441\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u044B\u0445 \u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u044B\u0445 \u0438 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0445 \u043F\u0440\u0435\u0434\u043F\u0440\u0438\u044F\u0442\u0438\u0439. \u0421\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E \u043C\u0451\u0434 \u0441\u043E\u0431\u0440\u0430\u043D \u0432 \u044D\u043A\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0438 \u0447\u0438\u0441\u0442\u043E\u043C \u043C\u0435\u0441\u0442\u0435 \u0438 \u0438\u043C\u0435\u0435\u0442 \u043D\u0430\u0442\u0443\u0440\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u043E\u0441\u0442\u0430\u0432.</p></div>`);
            } else {
              return [
                createVNode("div", {
                  class: "h_sto flex",
                  style: { "min-height": "400px" }
                }, [
                  createVNode("p", {
                    style: [_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }],
                    class: [!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"]
                  }, "\u041F\u0430\u0441\u0435\u043A\u0430 \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0433\u0430\u0435\u0442\u0441\u044F \u043D\u0430 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438 \u0437\u0430\u043F\u043E\u0432\u0435\u0434\u043D\u0438\u043A\u0430 \u0441 \u043B\u0435\u0441\u043D\u044B\u043C \u043C\u0430\u0441\u0441\u0438\u0432\u043E\u043C \u043E\u043A\u043E\u043B\u043E 6 \u0442\u044B\u0441. \u0433\u0430., \u0432\u0434\u0430\u043B\u0438 \u043E\u0442 \u0432\u0441\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u044B\u0445 \u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u044B\u0445 \u0438 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0445 \u043F\u0440\u0435\u0434\u043F\u0440\u0438\u044F\u0442\u0438\u0439. \u0421\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E \u043C\u0451\u0434 \u0441\u043E\u0431\u0440\u0430\u043D \u0432 \u044D\u043A\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0438 \u0447\u0438\u0441\u0442\u043E\u043C \u043C\u0435\u0441\u0442\u0435 \u0438 \u0438\u043C\u0435\u0435\u0442 \u043D\u0430\u0442\u0443\u0440\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u043E\u0441\u0442\u0430\u0432.", 6)
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_swiper_slide, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div class="h_sto flex" style="${ssrRenderStyle({ "min-height": "400px" })}"${_scopeId2}><p style="${ssrRenderStyle([_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }])}" class="${ssrRenderClass([!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"])}"${_scopeId2}>\u0411\u043E\u043B\u044C\u0448\u043E\u0435 \u0440\u0430\u0437\u043D\u043E\u043E\u0431\u0440\u0430\u0437\u0438\u0435 \u0440\u0430\u0441\u0442\u0435\u043D\u0438\u0439, \u0446\u0432\u0435\u0442\u0443\u0449\u0438\u0445 \u043D\u0430 \u0431\u043B\u0438\u0437\u043B\u0435\u0436\u0430\u0449\u0438\u0445 \u043B\u0443\u0433\u0430\u0445 \u0438 \u0432 \u043B\u0435\u0441\u0443 \u0434\u0430\u0451\u0442 \u043D\u0435\u043F\u043E\u0432\u0442\u043E\u0440\u0438\u043C\u044B\u0439 \u0430\u0440\u043E\u043C\u0430\u0442 \u0438 \u0432\u043A\u0443\u0441 \u043C\u0435\u0434\u0443.</p></div>`);
            } else {
              return [
                createVNode("div", {
                  class: "h_sto flex",
                  style: { "min-height": "400px" }
                }, [
                  createVNode("p", {
                    style: [_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }],
                    class: [!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"]
                  }, "\u0411\u043E\u043B\u044C\u0448\u043E\u0435 \u0440\u0430\u0437\u043D\u043E\u043E\u0431\u0440\u0430\u0437\u0438\u0435 \u0440\u0430\u0441\u0442\u0435\u043D\u0438\u0439, \u0446\u0432\u0435\u0442\u0443\u0449\u0438\u0445 \u043D\u0430 \u0431\u043B\u0438\u0437\u043B\u0435\u0436\u0430\u0449\u0438\u0445 \u043B\u0443\u0433\u0430\u0445 \u0438 \u0432 \u043B\u0435\u0441\u0443 \u0434\u0430\u0451\u0442 \u043D\u0435\u043F\u043E\u0432\u0442\u043E\u0440\u0438\u043C\u044B\u0439 \u0430\u0440\u043E\u043C\u0430\u0442 \u0438 \u0432\u043A\u0443\u0441 \u043C\u0435\u0434\u0443.", 6)
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
              _push3(`<div class="h_sto flex" style="${ssrRenderStyle({ "min-height": "400px" })}"${_scopeId2}><p style="${ssrRenderStyle([_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }])}" class="${ssrRenderClass([!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"])}"${_scopeId2}>\u0420\u0435\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u043C\u0435\u0434\u0430 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u0432 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u0432\u0438\u0434\u0430\u0445: \u0441\u043E\u0442\u043E\u0432\u044B\u0439 \u043C\u0451\u0434 - \u0432 \u0441\u043E\u0442\u0430\u0445; \u0437\u0430\u0431\u0440\u0443\u0441\u043E\u0432\u044B\u0439 \u043C\u0451\u0434 \u0438 \u0440\u0430\u0437\u043B\u0438\u0432\u043D\u043E\u0439 \u043C\u0451\u0434- \u0432 \u0435\u043C\u043A\u043E\u0441\u0442\u044F\u0445 \u0440\u0430\u0437\u043D\u043E\u0433\u043E \u043E\u0431\u044A\u0451\u043C\u0430.</p></div>`);
            } else {
              return [
                createVNode("div", {
                  class: "h_sto flex",
                  style: { "min-height": "400px" }
                }, [
                  createVNode("p", {
                    style: [_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }],
                    class: [!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"]
                  }, "\u0420\u0435\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u043C\u0435\u0434\u0430 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u0432 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u0432\u0438\u0434\u0430\u0445: \u0441\u043E\u0442\u043E\u0432\u044B\u0439 \u043C\u0451\u0434 - \u0432 \u0441\u043E\u0442\u0430\u0445; \u0437\u0430\u0431\u0440\u0443\u0441\u043E\u0432\u044B\u0439 \u043C\u0451\u0434 \u0438 \u0440\u0430\u0437\u043B\u0438\u0432\u043D\u043E\u0439 \u043C\u0451\u0434- \u0432 \u0435\u043C\u043A\u043E\u0441\u0442\u044F\u0445 \u0440\u0430\u0437\u043D\u043E\u0433\u043E \u043E\u0431\u044A\u0451\u043C\u0430.", 6)
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_swiper_slide, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div class="h_sto flex" style="${ssrRenderStyle({ "min-height": "400px" })}"${_scopeId2}><p style="${ssrRenderStyle([_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }])}" class="${ssrRenderClass([!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"])}"${_scopeId2}>\u0427\u0435\u0440\u043D\u043E\u0437\u0435\u043C, \u0438\u043C\u0435\u044E\u0449\u0438\u0439 \u0432 \u0441\u0432\u043E\u0451\u043C \u0441\u043E\u0441\u0442\u0430\u0432\u0435 \u043E\u0433\u0440\u043E\u043C\u043D\u043E\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043C\u0438\u043A\u0440\u043E\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432, \u043D\u0430\u0441\u044B\u0449\u0430\u0435\u0442 \u0438\u043C\u0438 \u043D\u0435\u043A\u0442\u0430\u0440 \u0446\u0432\u0435\u0442\u0443\u0449\u0438\u0445 \u0440\u0430\u0441\u0442\u0435\u043D\u0438\u0439.</p></div>`);
            } else {
              return [
                createVNode("div", {
                  class: "h_sto flex",
                  style: { "min-height": "400px" }
                }, [
                  createVNode("p", {
                    style: [_ctx.$device.isDesktop ? "width: 50%" : "", { "line-height": "1" }],
                    class: [!_ctx.$device.isDesktop ? "small" : "small-big", "small-big VAG auto"]
                  }, "\u0427\u0435\u0440\u043D\u043E\u0437\u0435\u043C, \u0438\u043C\u0435\u044E\u0449\u0438\u0439 \u0432 \u0441\u0432\u043E\u0451\u043C \u0441\u043E\u0441\u0442\u0430\u0432\u0435 \u043E\u0433\u0440\u043E\u043C\u043D\u043E\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043C\u0438\u043A\u0440\u043E\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432, \u043D\u0430\u0441\u044B\u0449\u0430\u0435\u0442 \u0438\u043C\u0438 \u043D\u0435\u043A\u0442\u0430\u0440 \u0446\u0432\u0435\u0442\u0443\u0449\u0438\u0445 \u0440\u0430\u0441\u0442\u0435\u043D\u0438\u0439.", 6)
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
                }, "\u041F\u0430\u0441\u0435\u043A\u0430 \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0433\u0430\u0435\u0442\u0441\u044F \u043D\u0430 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u0438 \u0437\u0430\u043F\u043E\u0432\u0435\u0434\u043D\u0438\u043A\u0430 \u0441 \u043B\u0435\u0441\u043D\u044B\u043C \u043C\u0430\u0441\u0441\u0438\u0432\u043E\u043C \u043E\u043A\u043E\u043B\u043E 6 \u0442\u044B\u0441. \u0433\u0430., \u0432\u0434\u0430\u043B\u0438 \u043E\u0442 \u0432\u0441\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u044B\u0445 \u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u044B\u0445 \u0438 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0445 \u043F\u0440\u0435\u0434\u043F\u0440\u0438\u044F\u0442\u0438\u0439. \u0421\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E \u043C\u0451\u0434 \u0441\u043E\u0431\u0440\u0430\u043D \u0432 \u044D\u043A\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0438 \u0447\u0438\u0441\u0442\u043E\u043C \u043C\u0435\u0441\u0442\u0435 \u0438 \u0438\u043C\u0435\u0435\u0442 \u043D\u0430\u0442\u0443\u0440\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u043E\u0441\u0442\u0430\u0432.", 6)
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
                }, "\u0411\u043E\u043B\u044C\u0448\u043E\u0435 \u0440\u0430\u0437\u043D\u043E\u043E\u0431\u0440\u0430\u0437\u0438\u0435 \u0440\u0430\u0441\u0442\u0435\u043D\u0438\u0439, \u0446\u0432\u0435\u0442\u0443\u0449\u0438\u0445 \u043D\u0430 \u0431\u043B\u0438\u0437\u043B\u0435\u0436\u0430\u0449\u0438\u0445 \u043B\u0443\u0433\u0430\u0445 \u0438 \u0432 \u043B\u0435\u0441\u0443 \u0434\u0430\u0451\u0442 \u043D\u0435\u043F\u043E\u0432\u0442\u043E\u0440\u0438\u043C\u044B\u0439 \u0430\u0440\u043E\u043C\u0430\u0442 \u0438 \u0432\u043A\u0443\u0441 \u043C\u0435\u0434\u0443.", 6)
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
                }, "\u0420\u0435\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u043C\u0435\u0434\u0430 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u0432 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u0432\u0438\u0434\u0430\u0445: \u0441\u043E\u0442\u043E\u0432\u044B\u0439 \u043C\u0451\u0434 - \u0432 \u0441\u043E\u0442\u0430\u0445; \u0437\u0430\u0431\u0440\u0443\u0441\u043E\u0432\u044B\u0439 \u043C\u0451\u0434 \u0438 \u0440\u0430\u0437\u043B\u0438\u0432\u043D\u043E\u0439 \u043C\u0451\u0434- \u0432 \u0435\u043C\u043A\u043E\u0441\u0442\u044F\u0445 \u0440\u0430\u0437\u043D\u043E\u0433\u043E \u043E\u0431\u044A\u0451\u043C\u0430.", 6)
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
                }, "\u0427\u0435\u0440\u043D\u043E\u0437\u0435\u043C, \u0438\u043C\u0435\u044E\u0449\u0438\u0439 \u0432 \u0441\u0432\u043E\u0451\u043C \u0441\u043E\u0441\u0442\u0430\u0432\u0435 \u043E\u0433\u0440\u043E\u043C\u043D\u043E\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043C\u0438\u043A\u0440\u043E\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432, \u043D\u0430\u0441\u044B\u0449\u0430\u0435\u0442 \u0438\u043C\u0438 \u043D\u0435\u043A\u0442\u0430\u0440 \u0446\u0432\u0435\u0442\u0443\u0449\u0438\u0445 \u0440\u0430\u0441\u0442\u0435\u043D\u0438\u0439.", 6)
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/advantages_slider.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const Advantages_slider = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$1 = {
  props: ["id"],
  data() {
    return {
      isVisible: false,
      c: 0,
      init: false
    };
  },
  mounted() {
    const options = {
      threshold: 1
      // 1 – полная видимость элемента, 0.5 – половина и т.д.
    };
    const observer = new IntersectionObserver(() => {
      console.log("\u042F \u0432\u0438\u0434\u0438\u043C");
      this.init = !this.init;
    }, options);
    const target = document.querySelector(`#${this.id}`);
    observer.observe(target);
  },
  watch: {
    "init"() {
      if (this.c == 0) {
        this.c = 1;
      } else {
        this.isVisible = true;
      }
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: $props.id,
    style: $data.isVisible ? "" : "height: 150px;"
  }, _attrs))}>`);
  if ($data.isVisible) {
    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/ToScroll.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ToScroll = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {
  name: "IndexItem",
  components: {
    Swiper,
    SwiperSlide,
    LoadingComp,
    Advantages_slider,
    ToScroll
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
      title: "\u041F\u0447\u0435\u043B\u0438\u043D\u0430\u044F \u0430\u0440\u0442\u0435\u043B\u044C - \u0413\u043B\u0430\u0432\u043D\u0430\u044F",
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
  const _component_nuxt_img = __nuxt_component_0$1;
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  const _component_Advantages_slider = resolveComponent("Advantages_slider");
  const _component_AddtionalCompPopularProduct = __nuxt_component_1;
  const _component_LoadingComp = resolveComponent("LoadingComp");
  const _component_to_scroll = resolveComponent("to-scroll");
  const _component_NuxtLink = __nuxt_component_0$2;
  const _component_Sending = __nuxt_component_3;
  _push(`<div${ssrRenderAttrs(mergeProps({ style: { "padding-top": "50px" } }, _attrs))} data-v-82998232><div class="wrapper" data-v-82998232>`);
  _push(ssrRenderComponent(_component_nuxt_img, {
    format: "webp",
    rel: "preconnect",
    sizes: "sm:100vw md:100vw lg:100vw",
    class: "absolute w-sto h_sto",
    src: "/images/main.jpg",
    alt: ""
  }, null, _parent));
  _push(`<div class="${ssrRenderClass([$data.wrapper_active ? "actives" : "", "absolute main-nak"])}" data-v-82998232></div><div class="main relative" data-v-82998232><div class="interactiv flex" data-v-82998232><div class="main_center auto" data-v-82998232><div class="main_text_div auto" data-v-82998232><p class="main_text" data-v-82998232>\u041D\u0430\u0448 \u043C\u0435\u0434 \u0438\u043C\u0435\u0435\u0442 \u0440\u044F\u0434 \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432!</p><div class="bt flex m2" data-v-82998232><button style="${ssrRenderStyle(_ctx.$device.isDesktop ? "width: 45%; margin: 0;" : "")}" class="main_bt" data-v-82998232><div class="flex sto" data-v-82998232><p class="main_bt_p" data-v-82998232>\u041F\u043E\u043F\u0440\u043E\u0431\u043E\u0432\u0430\u0442\u044C!</p></div></button>`);
  if (_ctx.$device.isDesktop) {
    _push(`<a href="#advantages" style="${ssrRenderStyle({ "margin": "0", "margin-left": "8px", "width": "45%" })}" class="main_bt" data-v-82998232><div class="flex sto" data-v-82998232><p class="main_bt_p" data-v-82998232>\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C!</p></div></a>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
  if (!_ctx.$device.isMobileOrTablet) {
    _push(`<div class="main_img_div" data-v-82998232><img${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/phel.png`)} class="phel" alt="" data-v-82998232><div class="slider-produtos-wrap h_sto" data-v-82998232>`);
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
                _push3(`<img${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/honey.png")} class="main_img" width="100%" height="100%" alt="" data-v-82998232${_scopeId2}>`);
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
                _push3(`<img${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/honey.png")} class="main_img" width="100%" height="100%" alt="" data-v-82998232${_scopeId2}>`);
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
                _push3(`<img${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/honey.png")} class="main_img" width="100%" height="100%" alt="" data-v-82998232${_scopeId2}>`);
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
    _push(`<div data-v-82998232><div style="${ssrRenderStyle({ "display": "block" })}" class="" data-v-82998232><div class="flex w-sto jus-sp info_kart_div" data-v-82998232><div class="w-sto flex" data-v-82998232><div class="w-sto auto auto" data-v-82998232>`);
    _push(ssrRenderComponent(_component_Advantages_slider, null, null, _parent));
    _push(`</div></div></div></div></div>`);
  }
  _push(`</div></div></div></div><div class="sot" data-v-82998232><div class="interactiv auto" data-v-82998232><div class="flex w-sto text_in_sot" data-v-82998232><p class="big auto main-text" data-v-82998232>\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0442\u043E\u0432\u0430\u0440\u044B</p></div><div class="block_info sliders big-block" data-v-82998232><div class="slider-produtos-wrap" data-v-82998232>`);
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
                  _push3(`<div class="hex slide auto" data-v-82998232${_scopeId2}>`);
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
    _push(`<div class="w-sto h_sto" data-v-82998232>`);
    _push(ssrRenderComponent(_component_LoadingComp, null, null, _parent));
    _push(`</div>`);
  }
  _push(`</div></div>`);
  if (_ctx.$device.isDesktop) {
    _push(`<div class="flex w-sto text_in_sot relative" data-v-82998232><div id="advantages" class="absolute" style="${ssrRenderStyle({ "top": "-80%" })}" data-v-82998232></div><p class="big auto main-text" data-v-82998232>\u041D\u0430\u0448\u0438 \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0430</p></div>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.$device.isDesktop) {
    _push(`<div style="${ssrRenderStyle({ "display": "block" })}" class="block_info" data-v-82998232><div class="flex w-sto jus-sp info_kart_div" data-v-82998232><div class="w-sto flex" data-v-82998232><div class="w-sto auto auto" data-v-82998232>`);
    _push(ssrRenderComponent(_component_Advantages_slider, null, null, _parent));
    _push(`</div></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(ssrRenderComponent(_component_to_scroll, { id: "eco" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div style="${ssrRenderStyle({ "display": "block" })}" class="block_info" data-v-82998232${_scopeId}><div class="flex w-sto jus-sp info_kart_div" data-v-82998232${_scopeId}><div class="kart" data-v-82998232${_scopeId}><div class="w-sto h_sto" data-v-82998232${_scopeId}>`);
        _push2(ssrRenderComponent(_component_nuxt_img, {
          loading: "lazy",
          format: "webp",
          style: { "border-radius": "40px" },
          class: "w-sto h_sto",
          src: "/images/eco-friend.jpg",
          alt: ""
        }, null, _parent2, _scopeId));
        _push2(`</div></div><div class="dostav_info flex" data-v-82998232${_scopeId}><div class="w-sto auto" data-v-82998232${_scopeId}><p class="small-big VAG" style="${ssrRenderStyle({ "line-height": "1" })}" data-v-82998232${_scopeId}>\u0427\u0438\u0441\u0442\u044B\u0439 \u043A\u0430\u043A \u0437\u043E\u043B\u043E\u0442\u043E, \u043D\u0430 \u0432\u043A\u0443\u0441 \u043A\u0430\u043A \u0441\u043E\u043B\u043D\u0435\u0447\u043D\u044B\u0439 \u0441\u0432\u0435\u0442</p><p class="small m2" data-v-82998232${_scopeId}> \u041D\u0430\u0448 \u043C\u0435\u0434 \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0438\u0441\u043A\u043B\u044E\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u043D\u0430\u0442\u0443\u0440\u0430\u043B\u044C\u043D\u044B\u043C \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u043E\u043C. \u0411\u0435\u0437 \u043F\u0440\u0438\u043C\u0435\u0441\u0435\u0439, \u0431\u0435\u0437 \u0445\u0438\u043C\u0438\u0438. </p></div></div></div></div>`);
      } else {
        return [
          createVNode("div", {
            style: { "display": "block" },
            class: "block_info"
          }, [
            createVNode("div", { class: "flex w-sto jus-sp info_kart_div" }, [
              createVNode("div", { class: "kart" }, [
                createVNode("div", { class: "w-sto h_sto" }, [
                  createVNode(_component_nuxt_img, {
                    loading: "lazy",
                    format: "webp",
                    style: { "border-radius": "40px" },
                    class: "w-sto h_sto",
                    src: "/images/eco-friend.jpg",
                    alt: ""
                  })
                ])
              ]),
              createVNode("div", { class: "dostav_info flex" }, [
                createVNode("div", { class: "w-sto auto" }, [
                  createVNode("p", {
                    class: "small-big VAG",
                    style: { "line-height": "1" }
                  }, "\u0427\u0438\u0441\u0442\u044B\u0439 \u043A\u0430\u043A \u0437\u043E\u043B\u043E\u0442\u043E, \u043D\u0430 \u0432\u043A\u0443\u0441 \u043A\u0430\u043A \u0441\u043E\u043B\u043D\u0435\u0447\u043D\u044B\u0439 \u0441\u0432\u0435\u0442"),
                  createVNode("p", { class: "small m2" }, " \u041D\u0430\u0448 \u043C\u0435\u0434 \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0438\u0441\u043A\u043B\u044E\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u043D\u0430\u0442\u0443\u0440\u0430\u043B\u044C\u043D\u044B\u043C \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u043E\u043C. \u0411\u0435\u0437 \u043F\u0440\u0438\u043C\u0435\u0441\u0435\u0439, \u0431\u0435\u0437 \u0445\u0438\u043C\u0438\u0438. ")
                ])
              ])
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_to_scroll, { id: "news" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="interactiv auto" data-v-82998232${_scopeId}><div class="flex w-sto text_in_sot" data-v-82998232${_scopeId}><p class="big auto main-text" data-v-82998232${_scopeId}>\u041D\u043E\u0432\u043E\u0441\u0442\u0438</p></div><section style="${ssrRenderStyle({ "padding": "5%" })}" class="auto grid" data-v-82998232${_scopeId}><!--[-->`);
        ssrRenderList($data.news, (new_obj) => {
          _push2(`<article class="grid-item" data-v-82998232${_scopeId}><div class="image" data-v-82998232${_scopeId}><img${ssrRenderAttr("src", this.$api_root + new_obj.main_image.slice(1))} data-v-82998232${_scopeId}></div><div class="info" data-v-82998232${_scopeId}>`);
          _push2(ssrRenderComponent(_component_NuxtLink, {
            "no-prefetch": "",
            to: `/news/${new_obj.id}`
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<h2 class="VAG" data-v-82998232${_scopeId2}>${ssrInterpolate(new_obj.title)}</h2>`);
              } else {
                return [
                  createVNode("h2", { class: "VAG" }, toDisplayString(new_obj.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
          _push2(`<div class="info-text" data-v-82998232${_scopeId}><p data-v-82998232${_scopeId}>${ssrInterpolate(new_obj.main_text.slice(40))}...</p></div><div class="button-wrap" data-v-82998232${_scopeId}>`);
          _push2(ssrRenderComponent(_component_NuxtLink, {
            "no-prefetch": "",
            class: "atuin-btn",
            to: `/news/${new_obj.id}`
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435`);
              } else {
                return [
                  createTextVNode("\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435")
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
          _push2(`</div></div></article>`);
        });
        _push2(`<!--]--></section>`);
        _push2(ssrRenderComponent(_component_NuxtLink, {
          "no-prefetch": "",
          to: `/news`
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<button style="${ssrRenderStyle({ "background": "rgb(160,166,62)", "cursor": "pointer", "width": "100%", "border": "none", "border-radius": "6px", "padding": "2% 3%" })}" data-v-82998232${_scopeId2}><div class="w-sto h_sto flex" data-v-82998232${_scopeId2}><p class="auto small-big" data-v-82998232${_scopeId2}>\u0412\u0441\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438</p></div></button>`);
            } else {
              return [
                createVNode("button", { style: { "background": "rgb(160,166,62)", "cursor": "pointer", "width": "100%", "border": "none", "border-radius": "6px", "padding": "2% 3%" } }, [
                  createVNode("div", { class: "w-sto h_sto flex" }, [
                    createVNode("p", { class: "auto small-big" }, "\u0412\u0441\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438")
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`</div>`);
      } else {
        return [
          createVNode("div", { class: "interactiv auto" }, [
            createVNode("div", { class: "flex w-sto text_in_sot" }, [
              createVNode("p", { class: "big auto main-text" }, "\u041D\u043E\u0432\u043E\u0441\u0442\u0438")
            ]),
            createVNode("section", {
              style: { "padding": "5%" },
              class: "auto grid"
            }, [
              (openBlock(true), createBlock(Fragment, null, renderList($data.news, (new_obj) => {
                return openBlock(), createBlock("article", {
                  key: new_obj.id,
                  class: "grid-item"
                }, [
                  createVNode("div", { class: "image" }, [
                    createVNode("img", {
                      src: this.$api_root + new_obj.main_image.slice(1)
                    }, null, 8, ["src"])
                  ]),
                  createVNode("div", { class: "info" }, [
                    createVNode(_component_NuxtLink, {
                      "no-prefetch": "",
                      to: `/news/${new_obj.id}`
                    }, {
                      default: withCtx(() => [
                        createVNode("h2", { class: "VAG" }, toDisplayString(new_obj.title), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"]),
                    createVNode("div", { class: "info-text" }, [
                      createVNode("p", null, toDisplayString(new_obj.main_text.slice(40)) + "...", 1)
                    ]),
                    createVNode("div", { class: "button-wrap" }, [
                      createVNode(_component_NuxtLink, {
                        "no-prefetch": "",
                        class: "atuin-btn",
                        to: `/news/${new_obj.id}`
                      }, {
                        default: withCtx(() => [
                          createTextVNode("\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435")
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ])
                  ])
                ]);
              }), 128))
            ]),
            createVNode(_component_NuxtLink, {
              "no-prefetch": "",
              to: `/news`
            }, {
              default: withCtx(() => [
                createVNode("button", { style: { "background": "rgb(160,166,62)", "cursor": "pointer", "width": "100%", "border": "none", "border-radius": "6px", "padding": "2% 3%" } }, [
                  createVNode("div", { class: "w-sto h_sto flex" }, [
                    createVNode("p", { class: "auto small-big" }, "\u0412\u0441\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438")
                  ])
                ])
              ]),
              _: 1
            })
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_to_scroll, { id: "sending" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        if (!_ctx.$store.getUser.is_sending) {
          _push2(`<div class="interactiv auto" data-v-82998232${_scopeId}><div class="flex w-sto text_in_sot" data-v-82998232${_scopeId}><p class="big auto main-text" data-v-82998232${_scopeId}>\u0420\u0430\u0441\u0441\u044B\u043B\u043A\u0430</p></div>`);
          _push2(ssrRenderComponent(_component_Sending, null, null, _parent2, _scopeId));
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      } else {
        return [
          !_ctx.$store.getUser.is_sending ? (openBlock(), createBlock("div", {
            key: 0,
            class: "interactiv auto"
          }, [
            createVNode("div", { class: "flex w-sto text_in_sot" }, [
              createVNode("p", { class: "big auto main-text" }, "\u0420\u0430\u0441\u0441\u044B\u043B\u043A\u0430")
            ]),
            createVNode(_component_Sending)
          ])) : createCommentVNode("", true)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
  _push(ssrRenderComponent(_component_to_scroll, { id: "ref" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="ref-block w-sto" data-v-82998232${_scopeId}><div class="flex w-sto text_in_sot" data-v-82998232${_scopeId}><p class="big auto main-text" style="${ssrRenderStyle({ "color": "rgb(241, 195, 96)", "text-shadow": "10px 10px 10px black", "padding": "1%" })}" data-v-82998232${_scopeId}>\u041E \u043D\u0430\u0448\u0435\u043C \u0442\u043E\u0432\u0430\u0440\u0435</p></div><div class="interactiv auto h-sto flex" data-v-82998232${_scopeId}><div class="block_info o_product auto" data-v-82998232${_scopeId}><div class="predp" data-v-82998232${_scopeId}><div class="predp-img auto" data-v-82998232${_scopeId}><img width="100%" height="100%"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/3.jpg")} alt="" data-v-82998232${_scopeId}></div><p class="small-big predp-name" data-v-82998232${_scopeId}>\u0418\u0432\u0430\u043D\u0435\u043D\u043A\u043E \u0418.\u041F.</p><p class="small" data-v-82998232${_scopeId}>\u0414\u0438\u0440\u0435\u043A\u0442\u043E\u0440 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438 ...</p></div><div class="predp-text flex" data-v-82998232${_scopeId}><p class="small-big" data-v-82998232${_scopeId}> \u041D\u0430\u0448\u0430 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430 \u0440\u0430\u0441\u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F \u043D\u0430 \u0433\u043E\u0440\u043E\u0434\u0430: Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, architecto veritatis? Aut iure labore qui ut molestiae minima repudiandae obcaecati beatae illo. Aliquam debitis minus consequuntur illum et natus. Incidunt. </p></div></div></div><div class="interactiv" data-v-82998232${_scopeId}></div></div>`);
      } else {
        return [
          createVNode("div", { class: "ref-block w-sto" }, [
            createVNode("div", { class: "flex w-sto text_in_sot" }, [
              createVNode("p", {
                class: "big auto main-text",
                style: { "color": "rgb(241, 195, 96)", "text-shadow": "10px 10px 10px black", "padding": "1%" }
              }, "\u041E \u043D\u0430\u0448\u0435\u043C \u0442\u043E\u0432\u0430\u0440\u0435")
            ]),
            createVNode("div", { class: "interactiv auto h-sto flex" }, [
              createVNode("div", { class: "block_info o_product auto" }, [
                createVNode("div", { class: "predp" }, [
                  createVNode("div", { class: "predp-img auto" }, [
                    createVNode("img", {
                      width: "100%",
                      height: "100%",
                      src: _ctx.$api_root + "static/online_store/images/3.jpg",
                      alt: ""
                    }, null, 8, ["src"])
                  ]),
                  createVNode("p", { class: "small-big predp-name" }, "\u0418\u0432\u0430\u043D\u0435\u043D\u043A\u043E \u0418.\u041F."),
                  createVNode("p", { class: "small" }, "\u0414\u0438\u0440\u0435\u043A\u0442\u043E\u0440 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438 ...")
                ]),
                createVNode("div", { class: "predp-text flex" }, [
                  createVNode("p", { class: "small-big" }, " \u041D\u0430\u0448\u0430 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430 \u0440\u0430\u0441\u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F \u043D\u0430 \u0433\u043E\u0440\u043E\u0434\u0430: Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, architecto veritatis? Aut iure labore qui ut molestiae minima repudiandae obcaecati beatae illo. Aliquam debitis minus consequuntur illum et natus. Incidunt. ")
                ])
              ])
            ]),
            createVNode("div", { class: "interactiv" })
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-82998232"]]);

export { index as default };
//# sourceMappingURL=index-af0ddc22.mjs.map
