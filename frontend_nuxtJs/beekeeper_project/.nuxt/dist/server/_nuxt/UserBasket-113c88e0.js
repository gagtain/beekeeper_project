import { B as BasketInfo } from "./BasketInfo-3489103b.js";
import { A as AddBasket, F as FavoriteComp } from "./FavoriteComp-ac255a18.js";
import { mergeProps, useSSRContext, resolveComponent, withCtx, createVNode } from "vue";
import "hookable";
import { a as api_root, u as useCookie, _ as _export_sfc } from "../server.mjs";
import "devalue";
import "klona";
import axios from "axios";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
async function updateCountBasketItem(basketItem_pk, count) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/basket/${basketItem_pk}/update_count`,
      method: "post",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      },
      data: {
        count
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const CountProduct_vue_vue_type_style_index_0_lang = "";
const _sfc_main$2 = {
  el: "#count_button",
  name: "CountProduct",
  props: ["item"],
  data() {
    return {
      time_prover: null,
      USER_STATE: this.$store.getUser
    };
  },
  methods: {
    async re_basketItem() {
      let response = await updateCountBasketItem(this.item.id, this.item.count);
      if (response.status == 400) {
        this.$store.REMOVE_BASKET_ITEM(this.id);
      } else {
        this.item == response.data;
      }
    },
    re_count(event) {
      if (!(event.srcElement.value == "" || event.srcElement.value == "0")) {
        this.$store.REFACTOR_COUNT_BASKET_ITEM({ basket_id: this.id, count: parseInt(event.srcElement.value) });
        this.re_basketItem();
      }
    },
    input_onfocus(event) {
      if (event.srcElement.value == "") {
        event.srcElement.value = this.item.count;
      } else if (event.srcElement.value == "0") {
        if (this.item.count != 1) {
          this.$store.REFACTOR_COUNT_BASKET_ITEM({ basket_id: this.item.id, count: 1 });
          this.re_basketItem();
        } else {
          event.srcElement.value = 1;
        }
      }
    },
    minus_input(event) {
      let total = event.srcElement.nextElementSibling;
      let value = parseInt(total.value);
      if (total.value > 1) {
        this.$store.REFACTOR_COUNT_BASKET_ITEM({ basket_id: this.item.id, count: value - 1 });
        setTimeout(() => {
          let count = value - 1;
          if (count == event.srcElement.nextElementSibling.value) {
            this.re_basketItem();
            console.log(1);
          } else {
            console.log(count, event.srcElement.nextElementSibling.value);
          }
        }, 1e3);
      }
    },
    // Увеличиваем на 1
    plus_input(event) {
      let total = event.srcElement.previousElementSibling;
      let value = parseInt(total.value);
      this.$store.REFACTOR_COUNT_BASKET_ITEM({ basket_id: this.item.id, count: value + 1 });
      setTimeout(() => {
        let count = value + 1;
        if (count == event.srcElement.previousElementSibling.value) {
          this.re_basketItem();
          console.log(1);
        }
      }, 1e3);
    },
    // Запрещаем ввод текста 
    input_keydown(event) {
      if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || // Ctrl+A
      event.keyCode == 65 && event.ctrlKey === true || // ← →
      event.keyCode >= 35 && event.keyCode <= 39) {
        return;
      } else {
        if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
          event.preventDefault();
        }
      }
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "input-number",
    id: "count_button"
  }, _attrs))}><div class="input-number__minus">-</div><input class="input-number__input" type="text" pattern="^[0-9]+$"${ssrRenderAttr("value", $props.item.count)}><div class="input-number__plus">+ </div></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/BasketComp/CountProduct.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const CountProduct = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const account_css_vue_type_style_index_0_src_cb14f484_scoped_cb14f484_lang = "";
const BasketList_vue_vue_type_style_index_1_lang = "";
const _sfc_main$1 = {
  data() {
    return {
      USER_STATE: this.$store.getUser
    };
  },
  components: {
    AddBasket,
    FavoriteComp,
    CountProduct
  },
  created() {
  },
  methods: {}
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_FavoriteComp = resolveComponent("FavoriteComp");
  const _component_AddBasket = resolveComponent("AddBasket");
  const _component_CountProduct = resolveComponent("CountProduct");
  const _component_router_link = resolveComponent("router-link");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "list_tovar_kor w-sto" }, _attrs))} data-v-cb14f484><!--[-->`);
  ssrRenderList($data.USER_STATE.basket, (b) => {
    _push(`<div class="tovar w-sto flex" data-v-cb14f484><div class="tovar_kor_img_div" data-v-cb14f484><img class="tovar_kor_img"${ssrRenderAttr("src", _ctx.$api_root + b.productItem.product.image)} alt="" data-v-cb14f484></div><div class="info_tovar_kor flex jus-sp" data-v-cb14f484><div class="info_tovar_kor_osnov" data-v-cb14f484><p class="normal-small tovar_kor_name" data-v-cb14f484>${ssrInterpolate(b.productItem.product.name)} [${ssrInterpolate(b.productItem.weight.weight)} гр]</p><p class="normal-small info_in_tovar_kor" data-v-cb14f484>${ssrInterpolate(b.productItem.price)} ${ssrInterpolate(b.productItem.price_currency)}</p><div class="btn_tovar_kor flex" data-v-cb14f484>`);
    _push(ssrRenderComponent(_component_FavoriteComp, {
      id: b.productItem.id
    }, null, _parent));
    _push(ssrRenderComponent(_component_AddBasket, {
      id: b.productItem.id
    }, null, _parent));
    _push(`</div></div><div class="size_tovar_div" data-v-cb14f484><div class="size_tovar_kor" data-v-cb14f484><div class="select_size" data-v-cb14f484><button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "height": "32px", "border": "none", "border-radius": "6px" })}" onclick="alert(&#39;в разработке&#39;)" data-v-cb14f484>Изменить</button><p class="normal-small kolvo" data-v-cb14f484>количество</p>`);
    _push(ssrRenderComponent(_component_CountProduct, { item: b }, null, _parent));
    _push(`</div></div></div></div></div>`);
  });
  _push(`<!--]-->`);
  if (!$data.USER_STATE.basket.length) {
    _push(`<div style="${ssrRenderStyle({ "width": "50%", "margin": "auto", "margin-top": "10%" })}" data-v-cb14f484><p style="${ssrRenderStyle({ "font-size": "28px" })}" class="VAG" data-v-cb14f484>Список корзины пуст :(</p><div class="select_size" data-v-cb14f484>`);
    _push(ssrRenderComponent(_component_router_link, { to: "/catalog" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}" data-v-cb14f484${_scopeId}> Перейти в каталог </button>`);
        } else {
          return [
            createVNode("button", { style: { "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" } }, " Перейти в каталог ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/BasketList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const BasketList = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-cb14f484"]]);
const UserBasket_vue_vue_type_style_index_0_scoped_675cb420_lang = "";
const account_css_vue_type_style_index_1_src_675cb420_scoped_675cb420_lang = "";
const _sfc_main = {
  el: "#kor",
  name: "UserBasket",
  components: {
    BasketList,
    BasketInfo
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_BasketList = resolveComponent("BasketList");
  const _component_BasketInfo = resolveComponent("BasketInfo");
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "w-sto kor",
    id: "kor"
  }, _attrs))} data-v-675cb420><p class="small-big VAG" data-v-675cb420>Корзина</p><div class="w-sto flex kor_block" data-v-675cb420>`);
  _push(ssrRenderComponent(_component_BasketList, null, null, _parent));
  _push(`<div class="basket_info_div" data-v-675cb420>`);
  _push(ssrRenderComponent(_component_BasketInfo, {
    items: _ctx.$store.getUser.basket
  }, null, _parent));
  _push(`</div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/UserBasket.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const UserBasket = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-675cb420"]]);
export {
  UserBasket as U
};
//# sourceMappingURL=UserBasket-113c88e0.js.map
