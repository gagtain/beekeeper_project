import { resolveComponent, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
const account_css_vue_type_style_index_0_src_5120646a_scoped_5120646a_lang = "";
const _sfc_main$2 = {
  el: "sub_order_ref",
  props: ["items"]
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_RouterLink = resolveComponent("RouterLink");
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: "sub_order_ref",
    class: "w-sto"
  }, _attrs))} data-v-5120646a>`);
  if ($props.items.length) {
    _push(ssrRenderComponent(_component_RouterLink, { to: "/checkout" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button class="w-sto" data-v-5120646a${_scopeId}><div class="fon_btn" data-v-5120646a${_scopeId}></div>Оформить</button>`);
        } else {
          return [
            createVNode("button", { class: "w-sto" }, [
              createVNode("div", { class: "fon_btn" }),
              createTextVNode("Оформить")
            ])
          ];
        }
      }),
      _: 1
    }, _parent));
  } else {
    _push(ssrRenderComponent(_component_RouterLink, { to: "/catalog" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button class="w-sto" data-v-5120646a${_scopeId}><div class="fon_btn" data-v-5120646a${_scopeId}></div> Добавить товар</button>`);
        } else {
          return [
            createVNode("button", { class: "w-sto" }, [
              createVNode("div", { class: "fon_btn" }),
              createTextVNode(" Добавить товар")
            ])
          ];
        }
      }),
      _: 1
    }, _parent));
  }
  _push(`</div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/Submit_Order_ref.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const SubmitOrderref = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-5120646a"]]);
const account_css_vue_type_style_index_0_src_d21cd0ba_scoped_d21cd0ba_lang = "";
const _sfc_main$1 = {
  el: "#pr_list_info",
  props: ["items", "delivery_price", "ordered"],
  data() {
    return {
      summ: 0
    };
  },
  methods: {
    getCountBasket() {
      let count = 0;
      this.items.forEach((element) => {
        count += parseInt(element.count);
      });
      return count;
    },
    getWeight() {
      let weight = this.items.reduce(function(weight_s, elem) {
        return weight_s + parseFloat(elem.productItem.weight.weight * elem.count);
      }, 0);
      let str_weight = ``;
      if (weight >= 1e3) {
        weight = weight / 1e3;
        str_weight = `${weight} кг`;
      } else {
        str_weight = `${weight} гр`;
      }
      return str_weight;
    },
    getSumm() {
      let summ = this.items.reduce(function(sum, elem) {
        return sum + parseFloat(elem.productItem.product.price * elem.count);
      }, 0);
      if (this.ordered) {
        summ += parseFloat(this.delivery_price);
      }
      return summ;
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: "pr_list_info",
    class: "kor_all_info auto w-sto m-2"
  }, _attrs))} data-v-d21cd0ba><p class="m2" data-v-d21cd0ba>Товаров: ${ssrInterpolate($options.getCountBasket())}</p><p class="m2" data-v-d21cd0ba>Вес: ${ssrInterpolate($options.getWeight())}</p><p class="m2" data-v-d21cd0ba> Цена: ${ssrInterpolate($props.items.reduce(function(sum, elem) {
    return sum + parseFloat(elem.productItem.product.price);
  }, 0))}</p>`);
  if ($props.ordered) {
    _push(`<p class="m2" data-v-d21cd0ba>Цена доставки ${ssrInterpolate($props.delivery_price)}</p>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<p class="m2" data-v-d21cd0ba>скидки:</p><ul data-v-d21cd0ba><li data-v-d21cd0ba>*в разработке*</li></ul><p id="is" class="small" data-v-d21cd0ba> Итоговая сумма: ${ssrInterpolate($options.getSumm())}</p></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/BasketComp/ProductListInfo.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ProductListInfo = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-d21cd0ba"]]);
const account_css_vue_type_style_index_0_src_259016bb_scoped_259016bb_lang = "";
const BasketInfo_vue_vue_type_style_index_1_scoped_259016bb_lang = "";
const _sfc_main = {
  components: { SubmitOrderref, ProductListInfo },
  el: "#reg_zakaz",
  name: "BasketInfo",
  props: ["items"]
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_SubmitOrderref = resolveComponent("SubmitOrderref");
  const _component_ProductListInfo = resolveComponent("ProductListInfo");
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "register_zakaz",
    style: { "width": "100%" }
  }, _attrs))} data-v-259016bb>`);
  _push(ssrRenderComponent(_component_SubmitOrderref, { items: $props.items }, null, _parent));
  _push(ssrRenderComponent(_component_ProductListInfo, {
    items: $props.items,
    ordered: false
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/BasketComp/BasketInfo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BasketInfo = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-259016bb"]]);
export {
  BasketInfo as B,
  ProductListInfo as P
};
//# sourceMappingURL=BasketInfo-a5de23ab.js.map
