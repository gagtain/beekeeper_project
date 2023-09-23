import { useSSRContext, resolveComponent, mergeProps, withCtx, createTextVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc, b as api_root } from '../server.mjs';
import axios from 'axios';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import 'ufo';
import 'cookie-es';
import 'destr';
import 'ohash';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
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
import 'http-graceful-shutdown';

const _sfc_main$7 = {
  props: ["el"],
  data() {
    return {
      height: "0"
    };
  },
  setup() {
  },
  methods: {
    height_refactor() {
      this.el.height = this.height;
    }
  }
};
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    style: { "margin-left": "3px" },
    class: "dropdown"
  }, _attrs))}><button id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle">\u0412\u044B\u0441\u043E\u0442\u0430 \u0431\u043B\u043E\u043A\u0430</button><ul class="dropdown-menu" aria-labelledby="navbarDropdown"><div class="mt-2 dropdown"><li><p class="dropdown-item">\u0412\u044B\u0441\u043E\u0442\u0430 <input${ssrRenderAttr("value", $data.height)} type="text" name="" id=""></p></li></div></ul></div>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NewsConstructor/Edit/BlockEdit.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const BlockEdit = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$7]]);
const _sfc_main$6 = {
  props: ["el"],
  data() {
    return {
      width: "100",
      margin_bottom: "0"
    };
  },
  setup() {
  },
  methods: {
    margin_refactor(sett) {
      this.el.margin = sett;
    },
    width_refactor(index2) {
      this.el.width = this.width;
    },
    margin_bottom_refactor() {
      this.el.margin_bottom = this.margin_bottom;
    }
  }
};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ style: { "display": "flex" } }, _attrs))}><div class="dropdown"><button id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle">\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0448\u0438\u0440\u0438\u043D\u0443</button><ul class="dropdown-menu" aria-labelledby="navbarDropdown"><div class="mt-2 dropdown"><li><p class="dropdown-item">\u0428\u0438\u0440\u0438\u043D\u0430 <input${ssrRenderAttr("value", $data.width)} type="text" name="" id=""></p></li></div></ul></div><div style="${ssrRenderStyle({ "margin-left": "3px" })}" class="dropdown"><button id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle">\u041E\u0442\u0441\u0442\u0443\u043F</button><ul class="dropdown-menu" aria-labelledby="navbarDropdown"><div class="mt-2 dropdown"><p class="dropdown-item">\u0441\u043B\u0435\u0432\u0430</p><p class="dropdown-item">\u0441\u043F\u0440\u0430\u0432\u043E</p><p class="dropdown-item">\u0446\u0435\u043D\u0442\u0440</p></div></ul></div><div style="${ssrRenderStyle({ "margin-left": "3px" })}" class="dropdown"><button id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle">\u041E\u0442\u0441\u0442\u0443\u043F \u043E\u0442 \u043E\u0431\u044A\u0435\u043A\u0442\u0430 \u0441\u043D\u0438\u0437\u0443</button><ul class="dropdown-menu" aria-labelledby="navbarDropdown"><div class="mt-2 dropdown"><li><p class="dropdown-item">\u041E\u0442\u0441\u0442\u0443\u043F <input${ssrRenderAttr("value", $data.margin_bottom)} type="text" name="" id=""></p></li></div></ul></div></div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NewsConstructor/Edit/GeneralEdit.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const GeneralEdit = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$6]]);
const _sfc_main$5 = {
  props: ["el", "select_id_media"],
  components: { GeneralEdit, BlockEdit },
  setup() {
  },
  data() {
    return {
      img_src: ""
    };
  },
  mounted() {
    console.log(213);
    setTimeout(() => {
      let file_input = document.getElementById(this.el.id + "input");
      console.log(this.el.input_id);
      file_input.click();
    }, 1e3);
  },
  methods: {
    file_load(event) {
      var target = event.target;
      if (!FileReader) {
        alert("FileReader \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u2014 \u043E\u0431\u043B\u043E\u043C");
        return;
      }
      if (!target.files.length) {
        alert("\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E");
        return;
      }
      var fileReader = new FileReader();
      fileReader.onload = () => {
        this.el.img_src = fileReader.result;
      };
      fileReader.readAsDataURL(target.files[0]);
      this.el.submit = "true";
    }
  }
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_general_edit = resolveComponent("general-edit");
  const _component_block_edit = resolveComponent("block-edit");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-2" }, _attrs))}><div style="${ssrRenderStyle([{ width: "100%", height: $props.el.height + "px", marginBottom: $props.el.margin_bottom + "%" }, { "display": "flex" }])}"><img style="${ssrRenderStyle([{ width: $props.el.width + "%", margin: $props.el.margin }, { "height": "100%" }])}"${ssrRenderAttr("id", $props.el.id)}${ssrRenderAttr("src", $props.el.img_src)} alt=""></div><input${ssrRenderAttr("id", $props.el.id + "input")} style="${ssrRenderStyle({ "display": "none" })}" type="file" name=""><div style="${ssrRenderStyle({ "display": "flex", "padding": "1%", "padding-left": "0" })}">`);
  _push(ssrRenderComponent(_component_general_edit, { el: $props.el }, null, _parent));
  _push(ssrRenderComponent(_component_block_edit, {
    style: { "margin-left": "3px" },
    el: $props.el
  }, null, _parent));
  _push(`</div></div>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NewsConstructor/Image.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const ImageObj = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$5]]);
const _sfc_main$4 = {
  props: ["el", "select_id_media"]
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-2" }, _attrs))}><div style="${ssrRenderStyle([{ width: "100%", height: $props.el.height + "px", marginBottom: $props.el.margin_bottom + "%" }, { "display": "flex" }])}"><img class="img_news" style="${ssrRenderStyle([{ width: $props.el.width + "%", margin: $props.el.margin }, { "height": "100%" }])}"${ssrRenderAttr("id", $props.el.id)}${ssrRenderAttr("src", $props.el.img_src)} alt=""></div></div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NewsConstructor/Pred_rel/ImageRel.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const ImageRel = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4]]);
const _sfc_main$3 = {
  el: "#text_prel",
  props: ["el", "index"]
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: "text_prel",
    class: "mt-2"
  }, _attrs))}><p style="${ssrRenderStyle({
    width: $props.el.width + "%",
    margin: $props.el.margin,
    marginBottom: $props.el.margin_bottom + "%",
    fontSize: $props.el.font_size + "px",
    color: $props.el.color
  })}"${ssrRenderAttr("align", $props.el.align)}>${ssrInterpolate($props.el.text)}</p></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NewsConstructor/Pred_rel/TextAreaRel.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const TextAreaRel = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$2 = {
  props: ["el"],
  data() {
    return {
      font_size: "0"
    };
  },
  setup() {
  },
  methods: {
    align_refactor(sett) {
      this.el.align = sett;
    },
    font_size_refactor() {
      this.el.font_size = this.font_size;
    },
    color_refactor(event) {
      this.el.color = event.target.value;
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ style: { "display": "flex" } }, _attrs))}><div class="dropdown"><button id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</button><ul class="dropdown-menu" aria-labelledby="navbarDropdown"><div class="mt-2 dropdown"><p class="dropdown-item">\u041F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 - \u0441\u043B\u0435\u0432\u0430</p><p class="dropdown-item">\u041F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 - \u0441\u043F\u0440\u0430\u0432\u043E</p><p class="dropdown-item">\u041F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 - \u0446\u0435\u043D\u0442\u0440</p></div></ul></div><div class="dropdown"><button id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle">\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0440\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430</button><ul class="dropdown-menu" aria-labelledby="navbarDropdown"><div class="mt-2 dropdown"><li><p class="dropdown-item">\u0428\u0440\u0438\u0444\u0442 <input${ssrRenderAttr("value", $data.font_size)} type="text" name="" id=""></p></li></div></ul></div><div class="dropdown"><button id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle">\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0446\u0432\u0435\u0442</button><ul class="dropdown-menu" aria-labelledby="navbarDropdown"><div class="mt-2 dropdown"><li><p class="dropdown-item">\u0426\u0432\u0435\u0442 <input type="color" name="" id=""></p></li></div></ul></div></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NewsConstructor/Edit/TextEdit.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const TextEdit = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$1 = {
  components: { TextEdit, GeneralEdit },
  props: ["el", "index"],
  setup() {
  },
  methods: {
    text_area_sub(index2) {
      console.log(213);
      this.$emit("text_area_sub", index2);
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_text_edit = resolveComponent("text-edit");
  const _component_general_edit = resolveComponent("general-edit");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-2" }, _attrs))}>`);
  if ($props.el.submit == "none") {
    _push(`<div class="mt-2"><textarea class="form-control" id="exampleFormControlTextarea1" rows="3">${ssrInterpolate($props.el.text)}</textarea><div style="${ssrRenderStyle({ "display": "flex" })}" class="mt-2 w-100"><button style="${ssrRenderStyle({ "margin": "auto" })}" class="btn btn-primary">\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C</button></div></div>`);
  } else {
    _push(`<div><p style="${ssrRenderStyle({
      width: $props.el.width + "%",
      margin: $props.el.margin,
      marginBottom: $props.el.margin_bottom + "%",
      fontSize: $props.el.font_size + "px",
      color: $props.el.color
    })}"${ssrRenderAttr("align", $props.el.align)}>${ssrInterpolate($props.el.text)}</p><div style="${ssrRenderStyle({ "display": "flex", "flex-wrap": "wrap", "padding": "1%", "padding-left": "0" })}">`);
    _push(ssrRenderComponent(_component_text_edit, {
      style: { "margin-left": "3px" },
      el: $props.el
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0442\u0435\u043A\u0441\u0442`);
        } else {
          return [
            createTextVNode("\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0442\u0435\u043A\u0441\u0442")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(ssrRenderComponent(_component_general_edit, {
      style: { "margin-left": "3px", "margin-top": "2px" },
      el: $props.el
    }, null, _parent));
    _push(`</div></div>`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NewsConstructor/TextArea.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const TextArea = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
async function newsCreate(data) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/news/create`,
      method: "post",
      headers: {
        //     "Authorization": `Bearer ${useCookie('assess').value}`
      },
      data
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main = {
  components: { TextArea, ImageObj, TextAreaRel, ImageRel },
  data() {
    return {
      header: "",
      textarea: "",
      elements: [
        {
          id: 1,
          type: "textarea",
          submit: "none",
          text: "",
          width: "100",
          align: "left",
          margin: "0",
          margin_bottom: "0",
          height: "300"
        }
      ],
      width: "100",
      default_obj: {
        id: null,
        type: "",
        submit: "none",
        text: "",
        width: "100",
        align: "0",
        margin: "0",
        margin_bottom: "0",
        height: "300",
        font_size: "16",
        color: "#000",
        img_src: ""
      },
      count: 1,
      pred_rel: false,
      name: "",
      main_image: ""
    };
  },
  setup() {
  },
  methods: {
    el_add(type, index2) {
      this.count++;
      console.log(this.count);
      let el = Object.assign({}, this.default_obj);
      el.id = this.count;
      el.type = type;
      console.log(index2);
      this.elements.splice(index2 + 1, 0, el);
    },
    el_sub(index2) {
      console.log(123, index2);
      this.elements[index2].submit = "true";
    },
    el_remove(index2) {
      this.elements.splice(index2, 1);
    },
    get_pred_rel_elements() {
      let el = this.elements.slice();
      return el.filter((f) => f.submit == "true");
    },
    get_main_title() {
      let main_text = "";
      for (var i = 0; i < this.elements.length; i++) {
        if (this.elements[i].type == "textarea") {
          main_text = this.elements[i].text;
          break;
        }
      }
      return main_text;
    },
    pred_rel_create() {
      console.log(213);
      let form = new FormData();
      form.append("main_image", this.main_image);
      form.append(
        "context",
        document.getElementById("cart_body_rel").innerHTML
      );
      form.append("title", this.name);
      form.append("main_text", this.get_main_title());
      newsCreate(form);
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_text_area = resolveComponent("text-area");
  const _component_image_obj = resolveComponent("image-obj");
  const _component_text_area_rel = resolveComponent("text-area-rel");
  const _component_image_rel = resolveComponent("image-rel");
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "mt-5",
    style: { "padding-bottom": "10%" }
  }, _attrs))}><div class="card col-sm-6 m-auto mt-2"><div class="card-header"><div class="form-group"><input type="text" class="form-control"${ssrRenderAttr("value", $data.name)} id="exampleInputPassword1" placeholder="\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435"></div></div><div class="card-body" id="cart_body"><h5 class="card-title"></h5><!--[-->`);
  ssrRenderList($data.elements, (el, index2) => {
    _push(`<div class="form-group" id="textarea_form">`);
    if (el.type == "textarea") {
      _push(ssrRenderComponent(_component_text_area, {
        onText_area_sub: ($event) => $options.el_sub($event),
        el,
        index: index2
      }, null, _parent));
    } else if (el.type == "image") {
      _push(ssrRenderComponent(_component_image_obj, {
        el,
        index: index2,
        select_id_media: _ctx.select_id_media
      }, null, _parent));
    } else {
      _push(`<!---->`);
    }
    if (el.submit == "true") {
      _push(`<div style="${ssrRenderStyle({ "display": "flex" })}"><div class="dropdown"><button style="${ssrRenderStyle({ "margin": "auto" })}" id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle"> \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C </button><ul class="dropdown-menu" aria-labelledby="navbarDropdown"><li><p class="dropdown-item"> \u0411\u043E\u043B\u044C\u0448\u043E\u0439 \u0442\u0435\u043A\u0441\u0442 </p></li><li><p class="dropdown-item"> \u041A\u0430\u0440\u0442\u0438\u043D\u043A\u0430 </p></li></ul></div><div class="dropdown"><button style="${ssrRenderStyle({ "margin-left": "3px" })}" id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle"> \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0435\u0440\u0435\u0434 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u043C </button><ul class="dropdown-menu" aria-labelledby="navbarDropdown"><li><p class="dropdown-item"> \u0411\u043E\u043B\u044C\u0448\u043E\u0439 \u0442\u0435\u043A\u0441\u0442 </p></li><li><p class="dropdown-item"> \u041A\u0430\u0440\u0442\u0438\u043D\u043A\u0430 </p></li></ul></div><button style="${ssrRenderStyle({ "margin-left": "3px" })}" class="btn btn-danger"> \u0423\u0434\u0430\u043B\u0438\u0442\u044C </button></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  });
  _push(`<!--]--><div class="mt-2 dropdown"><button style="${ssrRenderStyle({ "margin": "auto" })}" id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle"> \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C </button><ul class="dropdown-menu" aria-labelledby="navbarDropdown"><li><p class="dropdown-item"> \u0411\u043E\u043B\u044C\u0448\u043E\u0439 \u0442\u0435\u043A\u0441\u0442 </p></li><li><p class="dropdown-item"> \u041A\u0430\u0440\u0442\u0438\u043D\u043A\u0430 </p></li></ul></div></div><button href="#" class="btn mt-2 btn-primary"> \u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 </button></div>`);
  if ($data.pred_rel) {
    _push(`<div class="card col-sm-6 m-auto mt-2"><div class="card-header"><div class="form-group"><p style="${ssrRenderStyle({ "font-size": "24px" })}">${ssrInterpolate($data.name)}</p></div></div><div class="card-body" id="cart_body_rel"><!--[-->`);
    ssrRenderList($options.get_pred_rel_elements(), (el, index2) => {
      _push(`<div class="form-group" id="textarea_form">`);
      if (el.type == "textarea") {
        _push(ssrRenderComponent(_component_text_area_rel, {
          onText_area_sub: ($event) => $options.el_sub($event),
          el,
          index: index2
        }, null, _parent));
      } else if (el.type == "image") {
        _push(ssrRenderComponent(_component_image_rel, {
          el,
          index: index2,
          select_id_media: _ctx.select_id_media
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    });
    _push(`<!--]--></div><button href="#" class="btn mt-2 btn-primary"> \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C </button></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/news/create/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-f9df9ff5.mjs.map
