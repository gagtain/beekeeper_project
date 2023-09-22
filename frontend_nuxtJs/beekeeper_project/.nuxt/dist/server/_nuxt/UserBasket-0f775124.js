import { _ as _export_sfc, b as api_root, d as __nuxt_component_0 } from "../server.mjs";
import { B as BasketInfo } from "./BasketInfo-7bc07d4e.js";
import { useSSRContext, mergeProps, resolveComponent, withCtx, createVNode } from "vue";
import { L as LoadingComp } from "./LoadingComp-34c86e82.js";
import { A as AddBasket, F as FavoriteComp } from "./FavoriteComp-bfd510a6.js";
import axios from "axios";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrRenderComponent } from "vue/server-renderer";
const _sfc_main$3 = {
  el: "#notify",
  props: ["basket_list"],
  data() {
    return {
      connection: null
    };
  },
  created() {
    this.connection = new WebSocket(`ws://localhost:8000/api/v0.1/online_store`);
    this.connection.onmessage = this.onmessage;
    let time = /* @__PURE__ */ new Date();
    let socket = this.connection;
    this.connection.onopen = function(event) {
      socket.send(
        JSON.stringify(
          {
            "request_id": time.getTime(),
            "action": "subscribe_to_product_item",
            "type": "basket"
          }
        )
      );
    };
  },
  methods: {
    onmessage(event) {
      let data = JSON.parse(event.data);
      switch (data.type) {
        case "product_item":
          switch (data.action) {
            case "update":
              let index = this.$store.getUser.basket.findIndex((e) => e.productItem.id == data.data.id);
              this.$store.ADD_BASKET_REFACTOR_WEBSOCKET({
                type: "price",
                id: data.data.id
              });
              this.$store.getUser.basket[index].productItem = data.data;
              this.$store.REFACTOR_TOOLTIP({
                status: true,
                title: "Товар из корзины был изменен"
              });
              setInterval(() => {
                this.$store.REMOVE_BASKET_REFACTOR_WEBSOCKET({
                  type: "price",
                  id: data.data.id
                });
              }, 2e3);
              break;
          }
      }
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/BasketComp/BasketWebSocket.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const BasketWebSocket = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]);
async function updateCountBasketItem(basketItem_pk, count) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/basket/${basketItem_pk}/update_count`,
      method: "post",
      headers: {},
      withCredentials: true,
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
const account_css_vue_type_style_index_0_src_2afd3775_scoped_2afd3775_lang = "";
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
    CountProduct,
    LoadingComp
  },
  created() {
  },
  methods: {
    getBasketRefactorPrice(productItem_id) {
      let obj = this.$store.getBasket_refactor_websocket.filter((e) => e.id == productItem_id);
      if (obj.length == 0) {
        return false;
      } else if (obj[0].type == "price") {
        return true;
      } else {
        return false;
      }
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_loading_comp = resolveComponent("loading-comp");
  const _component_FavoriteComp = resolveComponent("FavoriteComp");
  const _component_AddBasket = resolveComponent("AddBasket");
  const _component_CountProduct = resolveComponent("CountProduct");
  const _component_router_link = resolveComponent("router-link");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "list_tovar_kor w-sto" }, _attrs))} data-v-2afd3775><!--[-->`);
  ssrRenderList($data.USER_STATE.basket, (b) => {
    _push(`<div class="tovar w-sto flex" data-v-2afd3775><div class="tovar_kor_img_div" data-v-2afd3775><img class="tovar_kor_img"${ssrRenderAttr("src", _ctx.$api_root + b.productItem.product.image.slice(1))} alt="" data-v-2afd3775></div><div class="info_tovar_kor flex jus-sp" data-v-2afd3775><div class="info_tovar_kor_osnov" data-v-2afd3775><p class="normal-small tovar_kor_name" data-v-2afd3775>${ssrInterpolate(b.productItem.product.name)} ${ssrInterpolate(b.productItem.weight ? "[" + b.productItem.weight.weight + "гр]" : "")}</p>`);
    if ($options.getBasketRefactorPrice(b.productItem.id)) {
      _push(`<div class="relative" style="${ssrRenderStyle({ "height": "50px", "width": "50%" })}" data-v-2afd3775>`);
      _push(ssrRenderComponent(_component_loading_comp, null, null, _parent));
      _push(`</div>`);
    } else {
      _push(`<p class="normal-small info_in_tovar_kor" data-v-2afd3775>${ssrInterpolate(b.productItem.price)} ${ssrInterpolate(b.productItem.price_currency)}</p>`);
    }
    _push(`<div class="btn_tovar_kor flex" data-v-2afd3775>`);
    _push(ssrRenderComponent(_component_FavoriteComp, {
      id: b.productItem.id
    }, null, _parent));
    _push(ssrRenderComponent(_component_AddBasket, {
      id: b.productItem.id
    }, null, _parent));
    _push(`</div></div><div class="size_tovar_div" data-v-2afd3775><div class="size_tovar_kor" data-v-2afd3775><div class="select_size" data-v-2afd3775><p class="normal-small kolvo" data-v-2afd3775>количество</p>`);
    _push(ssrRenderComponent(_component_CountProduct, { item: b }, null, _parent));
    _push(`</div></div></div></div></div>`);
  });
  _push(`<!--]-->`);
  if (!$data.USER_STATE.basket.length) {
    _push(`<div style="${ssrRenderStyle({ "width": "50%", "margin": "auto", "margin-top": "10%" })}" data-v-2afd3775><p style="${ssrRenderStyle({ "font-size": "28px" })}" class="VAG" data-v-2afd3775>Список корзины пуст :(</p><div class="select_size" data-v-2afd3775>`);
    _push(ssrRenderComponent(_component_router_link, { to: "/catalog" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "26px", "padding": "2%", "margin-top": "1%" })}" data-v-2afd3775${_scopeId}> Перейти в каталог </button>`);
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
const BasketList = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-2afd3775"]]);
const UserBasket_vue_vue_type_style_index_0_scoped_10650dfa_lang = "";
const account_css_vue_type_style_index_1_src_10650dfa_scoped_10650dfa_lang = "";
const _sfc_main = {
  el: "#kor",
  name: "UserBasket",
  components: {
    BasketList,
    BasketInfo,
    BasketWebSocket
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_BasketList = resolveComponent("BasketList");
  const _component_BasketInfo = resolveComponent("BasketInfo");
  const _component_ClientOnly = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "w-sto kor",
    id: "kor"
  }, _attrs))} data-v-10650dfa><p class="small-big VAG" data-v-10650dfa>Корзина</p><div class="w-sto flex kor_block" data-v-10650dfa>`);
  _push(ssrRenderComponent(_component_BasketList, null, null, _parent));
  _push(`<div class="basket_info_div" data-v-10650dfa>`);
  _push(ssrRenderComponent(_component_BasketInfo, {
    items: _ctx.$store.getUser.basket
  }, null, _parent));
  _push(`</div></div>`);
  _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/UserBasket.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const UserBasket = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-10650dfa"]]);
export {
  UserBasket as U
};
//# sourceMappingURL=UserBasket-0f775124.js.map
