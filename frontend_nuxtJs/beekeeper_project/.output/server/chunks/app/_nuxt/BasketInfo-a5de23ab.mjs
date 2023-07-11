import { useSSRContext, mergeProps, resolveComponent, withCtx, createVNode, createTextVNode } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from '../server.mjs';

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
          _push2(`<button class="w-sto" data-v-5120646a${_scopeId}><div class="fon_btn" data-v-5120646a${_scopeId}></div>\u041E\u0444\u043E\u0440\u043C\u0438\u0442\u044C</button>`);
        } else {
          return [
            createVNode("button", { class: "w-sto" }, [
              createVNode("div", { class: "fon_btn" }),
              createTextVNode("\u041E\u0444\u043E\u0440\u043C\u0438\u0442\u044C")
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
          _push2(`<button class="w-sto" data-v-5120646a${_scopeId}><div class="fon_btn" data-v-5120646a${_scopeId}></div> \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u043E\u0432\u0430\u0440</button>`);
        } else {
          return [
            createVNode("button", { class: "w-sto" }, [
              createVNode("div", { class: "fon_btn" }),
              createTextVNode(" \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u043E\u0432\u0430\u0440")
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
        str_weight = `${weight} \u043A\u0433`;
      } else {
        str_weight = `${weight} \u0433\u0440`;
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
  }, _attrs))} data-v-d21cd0ba><p class="m2" data-v-d21cd0ba>\u0422\u043E\u0432\u0430\u0440\u043E\u0432: ${ssrInterpolate($options.getCountBasket())}</p><p class="m2" data-v-d21cd0ba>\u0412\u0435\u0441: ${ssrInterpolate($options.getWeight())}</p><p class="m2" data-v-d21cd0ba> \u0426\u0435\u043D\u0430: ${ssrInterpolate($props.items.reduce(function(sum, elem) {
    return sum + parseFloat(elem.productItem.product.price);
  }, 0))}</p>`);
  if ($props.ordered) {
    _push(`<p class="m2" data-v-d21cd0ba>\u0426\u0435\u043D\u0430 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438 ${ssrInterpolate($props.delivery_price)}</p>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<p class="m2" data-v-d21cd0ba>\u0441\u043A\u0438\u0434\u043A\u0438:</p><ul data-v-d21cd0ba><li data-v-d21cd0ba>*\u0432 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435*</li></ul><p id="is" class="small" data-v-d21cd0ba> \u0418\u0442\u043E\u0433\u043E\u0432\u0430\u044F \u0441\u0443\u043C\u043C\u0430: ${ssrInterpolate($options.getSumm())}</p></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/BasketComp/ProductListInfo.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ProductListInfo = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-d21cd0ba"]]);
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

export { BasketInfo as B, ProductListInfo as P };
//# sourceMappingURL=BasketInfo-a5de23ab.mjs.map
