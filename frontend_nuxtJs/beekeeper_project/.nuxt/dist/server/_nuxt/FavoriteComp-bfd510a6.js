import { A as AddBasket$1, F as FavoriteComp$1 } from "./FavoriteComp-f62eb513.js";
import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
const account_css_vue_type_style_index_0_src_f3aaf1e2_scoped_f3aaf1e2_lang = "";
const _sfc_main$1 = {
  el: "#addBasket",
  name: "AddBasket",
  props: ["id"],
  extends: AddBasket$1
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "addBasket" }, _attrs))} data-v-f3aaf1e2>`);
  if (_ctx.a()) {
    _push(`<button class="flex btn_add_favorite remove_kor jus-sp" data-v-f3aaf1e2><img class="add_favorite"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/x_tovar.png")} alt="" data-v-f3aaf1e2><p class="b_text" data-v-f3aaf1e2>Убрать из корзины</p></button>`);
  } else {
    _push(`<button class="flex btn_add_favorite remove_kor jus-sp" data-v-f3aaf1e2><img class="add_favorite" style="${ssrRenderStyle(!_ctx.isBasket ? "transform: rotate(45deg)" : "")}"${ssrRenderAttr("src", _ctx.$api_root + "static/online_store/images/x_tovar.png")} alt="" data-v-f3aaf1e2><p class="b_text" data-v-f3aaf1e2>Добавить в корзину</p></button>`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/BasketComp/AddBasket.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AddBasket = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-f3aaf1e2"]]);
const account_css_vue_type_style_index_0_src_9c386033_scoped_9c386033_lang = "";
const _sfc_main = {
  el: "#favorite",
  name: "FavoriteComp",
  props: ["id"],
  extends: FavoriteComp$1
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "favorite" }, _attrs))} data-v-9c386033>`);
  if (_ctx.a()) {
    _push(`<button class="flex btn_add_favorite jus-sp" data-v-9c386033><img class="add_favorite"${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/favorite/favorite_remove.png`)} alt="" data-v-9c386033><p class="b_text" data-v-9c386033> Избранное </p></button>`);
  } else {
    _push(`<button class="flex btn_add_favorite jus-sp" data-v-9c386033><img class="add_favorite"${ssrRenderAttr("src", `${_ctx.$api_root}static/online_store/images/favorite/favorite_add.png`)} alt="" data-v-9c386033><p class="b_text" data-v-9c386033>Добавить в избранное</p></button>`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserComp/BasketComp/FavoriteComp.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FavoriteComp = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-9c386033"]]);
export {
  AddBasket as A,
  FavoriteComp as F
};
//# sourceMappingURL=FavoriteComp-bfd510a6.js.map
