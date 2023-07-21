import { useSSRContext, resolveComponent, mergeProps, reactive, defineComponent, ref, createElementBlock, withCtx, createVNode, createTextVNode } from 'vue';
import { B as BasketInfo, P as ProductListInfo } from './BasketInfo-c332dccf.mjs';
import { helpers, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc, a as api_root, u as useCookie } from '../server.mjs';
import axios from 'axios';
import { O as OrderProductList } from './OrderProductList-da497256.mjs';
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

const __nuxt_component_0 = /* @__PURE__ */ defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  // eslint-disable-next-line vue/require-prop-types
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_, { slots, attrs }) {
    const mounted = ref(false);
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
function ipolWidjetController(setups) {
  var defSetups = {
    label: "iWidjet",
    params: {}
  };
  if (typeof setups === "undefined") {
    setups = {};
  }
  for (var i in defSetups) {
    if (typeof setups[i] === "undefined") {
      setups[i] = defSetups[i];
    }
  }
  var label = setups.label;
  var params = setups.params;
  this.options = {
    get: function(wat) {
      return options.get(wat);
    },
    set: function(value, option) {
      options.set(value, option);
    }
  };
  this.binders = {
    add: function(callback, event) {
      bindes.addBind(callback, event);
    },
    trigger: function(event, args) {
      bindes.trigger(event, args);
    }
  };
  this.states = {
    check: function(state) {
      states.check(state);
    }
  };
  this.service = {
    cloneObj: function(obj) {
      return service.cloneObj(obj);
    },
    concatObj: function(main, sub) {
      return service.concatObj(main, sub);
    },
    isEmpty: function(stf) {
      return service.isEmpty(stf);
    },
    inArray: function(wat, arr) {
      return service.inArray(wat, arr);
    },
    loadTag: function(src, mode, callback) {
      service.loadTag(src, mode, callback);
    }
  };
  this.logger = {
    warn: function(wat) {
      return logger.warn(wat);
    },
    error: function(wat) {
      return logger.error(wat);
    },
    log: function(wat) {
      return logger.log(wat);
    }
  };
  var logger = {
    warn: function(wat) {
      if (this.check("warn")) {
        console.warn(label + ": ", wat);
      }
    },
    error: function(wat) {
      if (this.check("error")) {
        console.error(label + ": ", wat);
      }
    },
    log: function(wat) {
      if (this.check("log")) {
        if (typeof wat === "object") {
          console.log(label + ": ");
          for (var i2 in wat) {
            console.log(i2, wat[i2]);
          }
        } else {
          console.log(label + ": ", wat);
        }
      }
    },
    check: function(type2) {
      var depthCheck = false;
      switch (type2) {
        case "warn":
          depthCheck = options.check(true, "showWarns");
          break;
        case "error":
          depthCheck = options.check(true, "showErrors");
          break;
        case "log":
          depthCheck = options.check(true, "showLogs");
          break;
      }
      return depthCheck && options.check(false, "hideMessages");
    }
  };
  var service = {
    cloneObj: function(obj) {
      var ret = false;
      if (typeof obj !== "object")
        return ret;
      if (arguments.length === 1) {
        ret = {};
        for (var i2 in obj)
          ret[i2] = obj[i2];
      } else {
        ret = [];
        for (var i2 in obj)
          ret.push(obj[i2]);
      }
      return ret;
    },
    concatObj: function(main, sub) {
      if (typeof main === "object" && typeof sub === "object")
        for (var i2 in sub)
          main[i2] = sub[i2];
      return main;
    },
    isEmpty: function(stf) {
      var empty = true;
      if (typeof stf === "object")
        for (var i2 in stf) {
          empty = false;
          break;
        }
      else
        empty = stf;
      return empty;
    },
    inArray: function(wat, arr) {
      return arr.filter(function(item) {
        return item == wat;
      }).length;
    },
    loadTag: function(src, mode, callback) {
      var loadedTag = false;
      if (typeof mode === "undefined" || mode === "script") {
        loadedTag = document.createElement("script");
        loadedTag.src = src;
        loadedTag.type = "text/javascript";
        loadedTag.language = "javascript";
      } else {
        loadedTag = document.createElement("link");
        loadedTag.href = src;
        loadedTag.rel = "stylesheet";
        loadedTag.type = "text/css";
      }
      var head = document.getElementsByTagName("head")[0];
      head.appendChild(loadedTag);
      if (typeof callback !== "undefined") {
        loadedTag.onload = callback;
        loadedTag.onreadystatechange = function() {
          if (this.readyState === "complete" || this.readyState === "loaded")
            loadedTag.onload();
        };
      }
    }
  };
  var options = {
    self: this,
    options: {
      showWarns: {
        value: true,
        check: function(wat) {
          return typeof wat === "boolean";
        },
        setting: "start",
        hint: "Value must be bool (true / false)"
      },
      showErrors: {
        value: true,
        check: function(wat) {
          return typeof wat === "boolean";
        },
        setting: "start",
        hint: "Value must be bool (true / false)"
      },
      showLogs: {
        value: true,
        check: function(wat) {
          return typeof wat === "boolean";
        },
        setting: "start",
        hint: "Value must be bool (true / false)"
      },
      hideMessages: {
        value: false,
        check: function(wat) {
          return typeof wat === "boolean";
        },
        setting: "start",
        hint: "Value must be bool (true / false)"
      },
      mode: {
        value: "all",
        check: function(wat) {
          return typeof wat === "string";
        },
        setting: "start",
        hint: "Value must be string (pvz / postamat)"
      }
    },
    check: function(value, option, isStrict) {
      var given = this.get(option);
      if (given === null) {
        return null;
      } else {
        if (typeof isStrict === "undefined") {
          return value === given;
        } else {
          return value == given;
        }
      }
    },
    get: function(wat) {
      if (typeof this.options[wat] !== "undefined") {
        return this.options[wat].value;
      } else {
        logger.warn('Undefined option "' + wat + '"');
        return null;
      }
    },
    set: function(value, option) {
      if (typeof this.options[option] === "undefined") {
        logger.warn("Undefined option to set : " + option);
      } else {
        if (typeof this.options[option].check !== "function" || this.options[option].check.call(this.self, value)) {
          this.options[option].value = value;
        } else {
          var subhint = typeof this.options[option].hint !== "undefined" && this.options[option].hint ? ": " + this.options[option].hint : false;
          logger.warn("Incorrect setting value (" + value + ") for option " + option + subhint);
        }
      }
    },
    iniSetter: function(values, called) {
      for (var i2 in options.options) {
        if (options.options[i2].setting === called && typeof values[i2] !== "undefined") {
          options.set(values[i2], i2);
        }
      }
    }
  };
  var bindes = {
    events: {
      onStart: []
    },
    trigger: function(event, args) {
      if (typeof this.events[event] === "undefined") {
        logger.error("Unknown event " + event);
      } else {
        if (this.events[event].length > 0) {
          for (var i2 in this.events[event]) {
            this.events[event][i2](args);
          }
        }
      }
    },
    iniSetter: function(params2) {
      for (var i2 in this.events) {
        if (this.events.hasOwnProperty(i2)) {
          if (typeof params2[i2] !== "undefined") {
            if (typeof params2[i2] === "object") {
              for (var j2 in params2[i2]) {
                this.addBind(params2[i2][j2], i2);
              }
            } else {
              this.addBind(params2[i2], i2);
            }
          }
        }
      }
    },
    addBind: function(callback, event) {
      if (typeof callback === "function") {
        this.events[event].push(callback);
      } else {
        logger.warn('The callback "' + callback + '" for ' + event + " is not a function");
      }
    }
  };
  var states = {
    self: this,
    states: { start: { _start: false } },
    check: function(state) {
      var founded = false;
      for (var quenue in this.states) {
        for (var qStates in this.states[quenue]) {
          if (qStates === state) {
            this.states[quenue][qStates] = true;
            founded = quenue;
          }
        }
        if (founded)
          break;
      }
      if (founded) {
        var ready = true;
        for (var i2 in this.states[founded]) {
          if (!this.states[founded][i2]) {
            ready = false;
            break;
          }
        }
        if (ready) {
          if (typeof loaders[founded] !== "undefined") {
            options.iniSetter(params, founded);
            loaders[founded].call(this.self, params);
          }
        }
      } else {
        if (state === "started")
          logger.error("No callbacks for starting");
        else
          logger.error("Unknown state of loading: " + state);
      }
    }
  };
  var loaders = {
    "start": function(params2) {
      bindes.iniSetter(params2);
      bindes.trigger("onStart");
      states.check("started");
    }
  };
  var loadingSetups = {
    "options": "object",
    "states": "object",
    "loaders": "funciton",
    "stages": "object",
    "events": "string"
  };
  for (var i in loadingSetups) {
    if (typeof setups[i] !== "undefined") {
      for (var j in setups[i]) {
        if ({}.hasOwnProperty.call(setups[i], j)) {
          if (typeof setups[i][j] !== loadingSetups[i]) {
            logger.error("Illegal " + i + ' "' + j + '": ' + setups[i][j]);
          } else {
            switch (i) {
              case "options":
                options.options[j] = service.cloneObj(setups.options[j]);
                break;
              case "states":
                states.states[j] = service.cloneObj(setups.states[j]);
                break;
              case "loaders":
                loaders[j] = setups.loaders[j];
                break;
              case "events":
                bindes.events[setups.events[j]] = [];
                break;
              case "stages":
                if (typeof setups.stages[j].states !== "object" || typeof setups.stages[j].function !== "function") {
                  logger.error('Illegal stage "' + j + '": ' + setups[i][j]);
                } else {
                  states.states[j] = service.cloneObj(setups.stages[j].states);
                  loaders[j] = setups.stages[j].function;
                }
                break;
            }
          }
        }
      }
    }
  }
  states.check("_start");
}
function ISDEKWidjet(params) {
  if (!params.path) {
    var scriptPath = "https://widget.cdek.ru/widget/widjet.js";
    scriptPath = scriptPath.substring(0, scriptPath.indexOf("widjet.js")) + "scripts/";
    params.path = scriptPath;
  }
  if (!params.servicepath) {
    params.servicepath = params.path + "service.php";
  }
  if (!params.templatepath) {
    params.templatepath = params.path + "template.php";
  }
  if (!params.currency) {
    params.currency = "RUB";
  }
  var loaders = {
    onJSPCSSLoad: function() {
      widjet.states.check("JSPCSS");
    },
    onStylesLoad: function() {
      widjet.states.check("JSPCSS");
      widjet.states.check("styles");
    },
    onIPJQLoad: function() {
      widjet.states.check("jquery");
    },
    onJSPJSLoad: function() {
      widjet.states.check("JSPJS");
    },
    onPVZLoad: function() {
      widjet.states.check("PVZ");
    },
    onDataLoad: function() {
      widjet.states.check("data");
    },
    onLANGLoad: function() {
      widjet.states.check("lang");
    },
    onYmapsLoad: function() {
      widjet.states.check("ymaps");
    },
    onYmapsReady: function() {
      widjet.states.check("mapsReady");
    },
    onYmapsInited: function() {
      widjet.states.check("mapsInited");
    },
    onCityFrom: function() {
      widjet.states.check("cityFrom");
    }
  };
  var widjet = new ipolWidjetController({
    label: "ISDEKWidjet",
    options: {
      path: {
        value: params.path,
        check: function(wat) {
          return typeof wat === "string";
        },
        setting: "start",
        hint: "Value must be string (url)"
      },
      servicepath: {
        value: params.servicepath,
        check: function(wat) {
          return typeof wat === "string";
        },
        setting: "start",
        hint: "Value must be string (url)"
      },
      templatepath: {
        value: params.templatepath,
        check: function(wat) {
          return typeof wat === "string";
        },
        setting: "start",
        hint: "Value must be string (url)"
      },
      country: {
        value: "all",
        check: function(wat) {
          return typeof wat === "string";
        },
        setting: "start",
        hint: "Value must be string (countryname)"
      },
      lang: {
        value: "rus",
        check: function(wat) {
          return typeof wat === "string";
        },
        setting: "start",
        hint: "Value must be string (laguage name)"
      },
      link: {
        value: params.link,
        check: function(wat) {
          return wat === false ? true : ipjq("#" + wat).length > 0;
        },
        setting: "afterJquery",
        hint: "No element whit this id to put the widjet"
      },
      defaultCity: {
        value: params.defaultCity,
        check: function(name) {
          return this.city.check(name) !== false;
        },
        setting: "dataLoaded",
        hint: "Default City wasn't founded"
      },
      choose: {
        value: true,
        check: function(wat) {
          return typeof wat === "boolean";
        },
        setting: "start",
        hint: "Value must be bool (true / false)"
      },
      hidedress: {
        value: false,
        check: function(wat) {
          return typeof wat === "boolean";
        },
        setting: "start",
        hint: "Value must be bool (true / false)"
      },
      hidecash: {
        value: false,
        check: function(wat) {
          return typeof wat === "boolean";
        },
        setting: "start",
        hint: "Value must be bool (true / false)"
      },
      hidedelt: {
        value: false,
        check: function(wat) {
          return typeof wat === "boolean";
        },
        setting: "start",
        hint: "Value must be bool (true / false)"
      },
      popup: {
        value: false,
        check: function(wat) {
          return typeof wat === "boolean";
        },
        setting: "start",
        hint: "Value must be bool (true / false)"
      },
      region: {
        value: false,
        check: function(wat) {
          return typeof wat === "boolean";
        },
        setting: "start",
        hint: "Value must be bool (true / false)"
      },
      detailAddress: {
        value: false,
        check: function(wat) {
          return typeof wat === "boolean";
        },
        setting: "start",
        hint: "Value must be bool (true / false)"
      },
      apikey: {
        value: "f4e034c2-8c37-4168-8b97-99b6b3b268d7",
        check: function(wat) {
          return typeof wat === "string";
        },
        setting: "start",
        hint: "Value must be string (apikey)"
      },
      goods: {
        value: false,
        check: function(wat) {
          if (typeof wat !== "object") {
            return false;
          }
          if (typeof wat.width !== "undefined") {
            return false;
          }
          for (var i in wat) {
            if (typeof wat[i].length === "undefined" || !wat[i].length || typeof wat[i].width === "undefined" || !wat[i].width || typeof wat[i].height === "undefined" || !wat[i].height || typeof wat[i].weight === "undefined" || !wat[i].weight)
              return false;
          }
          return true;
        },
        setting: "start",
        hint: "Value must be an array of objects of type {length:(float),width:(float),height(float),weight(float)}"
      },
      cityFrom: {
        value: params.cityFrom,
        check: function(name) {
          return this.city.check(name) !== false;
        },
        setting: "dataLoaded",
        hint: "City From wasn't founded"
      },
      currency: {
        value: params.currency,
        check: function(currency) {
          return [
            "RUB",
            "KZT",
            "USD",
            "EUR",
            "GBP",
            "CNY",
            "BYN",
            "UAH",
            "KGS",
            "AMD",
            "TRY",
            "THB",
            "KRW",
            "AED",
            "UZS",
            "MNT"
          ].indexOf(currency) !== -1;
        },
        setting: "start",
        hint: "Currency wasn't founded"
      }
    },
    events: [
      "onChoose",
      "onChooseProfile",
      "onChooseAddress",
      "onReady",
      "onCalculate"
    ],
    stages: {
      /*
       *   when controller is ready - start loadings
       */
      "mainInit": {
        states: {
          started: false
        },
        function: function() {
          this.service.loadTag(this.options.get("path") + "ipjq.js", "script", loaders.onIPJQLoad);
          var yalang = this.options.get("lang") == "rus" ? "ru_RU" : "en_GB";
          this.service.loadTag("https://api-maps.yandex.ru/2.1/?apikey=" + this.options.get("apikey") + "&lang=" + yalang, "script", loaders.onYmapsLoad);
          this.service.loadTag(this.options.get("path") + "style.css", "link", loaders.onStylesLoad);
        }
      },
      /*
       *    when jquery is ready - load extensions and ajax-calls
       */
      "afterJquery": {
        states: {
          jquery: false
        },
        function: function() {
          this.service.loadTag(this.options.get("path") + "jquery.mCustomScrollbar.concat.min.js", "script", loaders.onJSPJSLoad);
          ipjq.getJSON(
            widjet.options.get("servicepath"),
            { isdek_action: "getPVZ", country: this.options.get("country"), lang: this.options.get("lang"), mode: this.options.get("mode") },
            DATA.parsePVZFile
          );
          ipjq.getJSON(
            widjet.options.get("servicepath"),
            { isdek_action: "getLang", lang: this.options.get("lang") },
            LANG.write
          );
        }
      },
      /*
       *  when ymaps's script is added and loaded
       */
      "ymapsBinder1": {
        states: {
          ymaps: false
        },
        function: function() {
          ymaps.ready(loaders.onYmapsReady());
        }
      },
      /*
       *    waiting untill ymaps are loaded, ready, steady, go
       */
      "ymapsBinder2": {
        states: {
          mapsReady: false
        },
        function: function() {
          YmapsLoader();
        }
      },
      /*
       *   when everything, instead of ymaps is ready
       */
      "dataLoaded": {
        states: {
          JSPCSS: false,
          JSPJS: false,
          PVZ: false,
          styles: false,
          lang: false
        },
        function: function() {
          loaders.onDataLoad();
          if (widjet.options.get("cityFrom")) {
            ipjq.getJSON(
              widjet.options.get("servicepath"),
              { isdek_action: "getCity", city: widjet.options.get("cityFrom") },
              function(data) {
                if (typeof data.error === "undefined") {
                  CALCULATION.cityFrom = data.id;
                } else {
                  widjet.logger.warn("City from was't found " + data.error);
                }
                loaders.onCityFrom("onCityFrom");
              }
            );
          } else {
            loaders.onCityFrom("onCityFrom");
          }
        }
      },
      /*
       *   when everything is ready
       */
      "ready": {
        states: {
          data: false,
          mapsInited: false,
          cityFrom: false
        },
        function: function() {
          if (widjet.options.get("defaultCity") != "auto")
            DATA.city.set(widjet.options.get("defaultCity"));
          template.readyA = true;
          template.html.loadCityList(DATA.city.collection);
          if (!widjet.popupped) {
            widjet.finalAction();
          } else {
            widjet.loadedToAction = true;
          }
        }
      }
    },
    params
  });
  widjet.popupped = false;
  widjet.loadedToAction = false;
  widjet.finalActionCalled = false;
  widjet.loaderHided = false;
  widjet.finalAction = function() {
    if (widjet.finalActionCalled === true) {
      return;
    }
    widjet.finalActionCalled = true;
    template.controller.loadCity();
    this.sdekWidgetEvents();
    this.binders.trigger("onReady");
  };
  widjet.hideLoader = function() {
    if (!widjet.loaderHided) {
      widjet.loaderHided = true;
      ipjq(IDS.get("PRELOADER")).fadeOut(300);
      ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search, .CDEK-widget__sidebar, .CDEK-widget__logo").removeClass("CDEK-widget__inaccessible");
    }
  };
  function YmapsLoader() {
    if (typeof widjet.incrementer === "undefined") {
      widjet.incrementer = 0;
    }
    if (typeof ymaps.geocode !== "function") {
      if (widjet.incrementer++ > 50) {
        widjet.logger.error("Unable to load ymaps");
      } else {
        window.setTimeout(YmapsLoader, 500);
      }
    } else {
      loaders.onYmapsInited();
    }
  }
  var HTML = {
    blocks: {},
    getBlock: function(block, values) {
      if (typeof HTML.blocks[block] != "undefined") {
        var _tmpBlock = HTML.blocks[block];
        if (typeof values == "object") {
          for (var keyVal in values) {
            _tmpBlock = _tmpBlock.replace(new RegExp("#" + keyVal + "#", "g"), values[keyVal]);
          }
        }
        _tmpBlock = IDS.replaceAll(LANG.replaceAll(_tmpBlock));
        return _tmpBlock;
      }
      return "";
    },
    save: function(data) {
      HTML.blocks = data;
      template.html.place();
    }
  };
  var DATA = {
    regions: {
      collection: {},
      cityes: {},
      map: {}
    },
    // РЎРїРёСЃРѕРє РіРѕСЂРѕРґРѕРІ РЅРѕРІРѕР№ РњРѕСЃРєРІС‹
    listCityCode: [162, 42932, 13369, 1690, 469, 1198, 75809, 510, 1689, 16338],
    currentCityName: "",
    currentCityCode: 0,
    city: {
      indexOfSome: function(findItem, ObjItem) {
        console.log(findItem);
        for (var keyI in ObjItem) {
          if (ObjItem[keyI] == findItem) {
            return keyI;
          }
        }
        return false;
      },
      collection: {},
      collectionFull: {},
      current: false,
      get: function() {
        return this.current;
      },
      set: function(intCityID, forse = false) {
        if (this.checkCity(intCityID)) {
          if (typeof this.collection[intCityID] === "undefined" && !forse) {
            if (!(intCityID = this.indexOfSome(intCityID, this.collection))) {
              return false;
            }
          }
          this.current = intCityID;
          return intCityID;
        } else {
          widjet.logger.error("Unknown city: " + intCityID);
          return false;
        }
      },
      checkCity: function(intCityID) {
        return typeof this.collection[intCityID] !== "undefined" || this.indexOfSome(intCityID, this.collection) > -1;
      },
      getName: function(intCityID) {
        if (this.checkCity(intCityID)) {
          if (typeof this.collection[intCityID] === "undefined") {
            intCityID = this.indexOfSome(intCityID, this.collection);
          }
          return this.collection[intCityID];
        }
        return false;
      },
      getFullName: function(intCityID) {
        if (this.checkCity(intCityID)) {
          if (typeof this.collectionFull[intCityID] === "undefined") {
            intCityID = this.indexOfSome(intCityID, this.collectionFull);
          }
          return this.collectionFull[intCityID];
        }
        return false;
      },
      getId: function(intCityID) {
        if (this.checkCity(intCityID)) {
          if (typeof this.collection[intCityID] === "undefined") {
            intCityID = this.indexOfSome(intCityID, this.collection);
          }
          return intCityID;
        }
        return false;
      }
    },
    PVZ: {
      collection: {},
      bycoord: {},
      bycoordCur: 0,
      check: function(intCityID) {
        return DATA.city.checkCity(intCityID) && typeof this.collection[intCityID] !== "undefined";
      },
      getCityPVZ: function(intCityID) {
        if (DATA.listCityCode.includes(Number(intCityID))) {
          if (DATA.currentCityName === "\u0420 \u0420\u0455\u0421\u0403\u0421\u0403\u0420\u0451\u0421\u040F \u0420\u045A\u0420\u0455\u0421\u0403\u0420\u0454\u0420\u0406\u0420\xB0 \u0420\u045A\u0420\u0455\u0421\u0403\u0420\u0454\u0420\u0406\u0420\xB0") {
            return this.collection[44];
          } else {
            return this.collection[intCityID + "_distance"];
          }
        }
        if (this.check(intCityID)) {
          return this.collection[intCityID];
        } else {
          widjet.logger.error("No PVZ in city " + intCityID);
        }
      },
      getRegionPVZ: function(intCityID) {
        if (this.check(intCityID)) {
          let by_region = {};
          let region = DATA.regions.cityes[intCityID];
          let city_in_region = [];
          city_in_region.push(...DATA.regions.map[region]);
          if (region === 81)
            city_in_region.push(...DATA.regions.map[9]);
          if (region === 9)
            city_in_region.push(...DATA.regions.map[81]);
          if (region === 82)
            city_in_region.push(...DATA.regions.map[26]);
          if (region === 26)
            city_in_region.push(...DATA.regions.map[82]);
          city_in_region.forEach((item, i, arr) => {
            var pvzList = DATA.PVZ.collection[item];
            for (let code in pvzList) {
              by_region[code] = pvzList[code];
            }
          });
          return by_region;
        } else {
          widjet.logger.error("No PVZ in city " + intCityID);
        }
      },
      getCurrent: function() {
        let cityCode = DATA.city.current;
        if (DATA.currentCityCode !== 0) {
          cityCode = DATA.currentCityCode;
        }
        if (widjet.options.get("region"))
          return this.getRegionPVZ(cityCode);
        return this.getCityPVZ(cityCode);
      }
    },
    address: {
      current: false,
      get: function() {
        return DATA.address.current;
      },
      set: function(address) {
        DATA.address.current = address;
      },
      fill: function(address) {
        DATA.address.set(address);
      }
    },
    parsePVZFile: function(data) {
      if (typeof data.pvz === "undefined") {
        var sign = "Unable to load list of PVZ : ";
        if (typeof data.pvz === "undefined") {
          for (var i in data.error) {
            sign += data.error[i] + ", ";
          }
          sign = sign.substr(0, sign.length - 2);
        } else {
          sign += "unknown error.";
        }
        widjet.logger.error(sign);
      } else {
        if (typeof data.pvz.REGIONS !== "undefined") {
          DATA.regions.collection = data.pvz.REGIONS;
          DATA.regions.cityes = data.pvz.CITYREG;
          DATA.regions.map = data.pvz.REGIONSMAP;
        }
        for (var pvzCity in data.pvz.PVZ) {
          if (DATA.listCityCode.includes(Number(pvzCity))) {
            DATA.PVZ.collection[44] = { ...DATA.PVZ.collection[44], ...data.pvz.PVZ[pvzCity] };
          }
          DATA.PVZ.collection[pvzCity] = data.pvz.PVZ[pvzCity];
          if (typeof data.pvz.CITY[pvzCity] !== "undefined" && typeof DATA.city.collection[pvzCity] === "undefined") {
            DATA.city.collection[pvzCity] = data.pvz.CITY[pvzCity];
            DATA.city.collectionFull[pvzCity] = data.pvz.CITYFULL[pvzCity];
          }
        }
        loaders.onPVZLoad();
      }
    }
  };
  var CALCULATION = {
    bad: false,
    profiles: {
      courier: {
        price: 0,
        currency: "RUB",
        term: 0,
        tarif: false
      },
      pickup: {
        price: 0,
        currency: "RUB",
        term: 0,
        tarif: false
      }
    },
    history: [],
    defaultGabs: { length: 20, width: 30, height: 40, weight: 1 },
    cityFrom: false,
    binder: {},
    calculate: function(forse = false) {
      if (this.cityFrom) {
        let courier_idx = this.history.findIndex(
          (e) => e.code === parseInt(DATA.city.current) && e.type === "courier" && e.weight === cargo.getWeight()
        );
        let pickup_idx = this.history.findIndex(
          (e) => e.code === parseInt(DATA.city.current) && e.type === "pickup" && e.weight === cargo.getWeight()
        );
        if (courier_idx !== -1 && pickup_idx !== -1) {
          for (var i in this.profiles) {
            let idx = i === "pickup" ? pickup_idx : courier_idx;
            if (idx !== -1) {
              this.profiles[i].price = this.history[idx].price;
              this.profiles[i].term = this.history[idx].term;
              this.profiles[i].tarif = this.history[idx].tarif;
            }
          }
          widjet.binders.trigger("onCalculate", {
            profiles: widjet.service.cloneObj(CALCULATION.profiles),
            city: DATA.city.current,
            cityName: DATA.city.getName(DATA.city.current)
          });
        } else {
          let mark = Date.now();
          if (DATA.city.current === 63015) {
            DATA.city.current = 1195;
          }
          this.binder[parseInt(DATA.city.current)] = {};
          for (let i2 in this.profiles) {
            this.profiles[i2].price = null;
            this.profiles[i2].term = null;
            this.profiles[i2].tarif = false;
            this.request(i2, mark, forse);
          }
        }
      } else {
        widjet.logger.warn("No city from given: calculation is impossible");
      }
    },
    request: function(type2, timestamp, forse = false) {
      var data = {
        "type": type2
      };
      if (typeof cargo.get()[0] !== "undefined") {
        var cargos = cargo.get();
        data.goods = [];
        for (var i in cargos) {
          data.goods.push(cargos[i]);
        }
      } else {
        data.goods = [this.defaultGabs];
      }
      data.cityFromId = this.cityFrom;
      data.cityToId = forse ? DATA.city.get() : DATA.city.getId(DATA.city.current);
      data.currency = widjet.options.get("currency");
      if (typeof timestamp !== "undefined") {
        data.timestamp = timestamp;
      }
      if (DATA.city.current)
        ipjq.getJSON(
          widjet.options.get("servicepath"),
          { isdek_action: "calc", shipment: data },
          CALCULATION.onCalc
        );
    },
    onCalc: function(answer) {
      if (typeof answer.error !== "undefined") {
        CALCULATION.bad = true;
        var sign = "";
        var thisIsNorma = false;
        for (var i in answer.error) {
          if (typeof answer.error[i] === "object") {
            for (var j in answer.error[i]) {
              sign += answer.error[i][j].text + " (" + answer.error[i][j].code + "), ";
              if (answer.error[i][j].code === 3)
                thisIsNorma = true;
            }
          } else {
            sign += answer.error[i] + ", ";
          }
        }
        if (thisIsNorma) {
          widjet.logger.warn("Troubles while calculating: " + sign.substring(0, sign.length - 2));
          if (typeof answer.type !== "undefined") {
            CALCULATION.profiles[answer.type].price = false;
            CALCULATION.profiles[answer.type].term = false;
            CALCULATION.profiles[answer.type].tarif = false;
          }
        } else
          widjet.logger.error("Error while calculating: " + sign.substring(0, sign.length - 2));
      } else {
        CALCULATION.bad = false;
        CALCULATION.profiles[answer.type].price = answer.result.price;
        CALCULATION.profiles[answer.type].currency = answer.result.currency;
        CALCULATION.profiles[answer.type].term = answer.result.deliveryPeriodMax === answer.result.deliveryPeriodMin ? answer.result.deliveryPeriodMin : answer.result.deliveryPeriodMin + "-" + answer.result.deliveryPeriodMax;
        CALCULATION.profiles[answer.type].tarif = typeof answer.result.tarif != "undefined" ? answer.result.tarif : answer.result.tariffId;
        CALCULATION.history.push({
          code: parseInt(DATA.city.current),
          weight: cargo.getWeight(),
          type: answer.type,
          price: answer.result.price,
          currency: answer.result.currency,
          term: CALCULATION.profiles[answer.type].term,
          tarif: CALCULATION.profiles[answer.type].tarif
        });
      }
      if (typeof answer.type !== "undefined" && typeof CALCULATION.binder[parseInt(DATA.city.current)] !== "undefined") {
        CALCULATION.binder[parseInt(DATA.city.current)][answer.type] = true;
        for (var i in CALCULATION.profiles) {
          if (typeof CALCULATION.binder[parseInt(DATA.city.current)][i] === "undefined") {
            return false;
          }
        }
        widjet.binders.trigger("onCalculate", {
          profiles: widjet.service.cloneObj(CALCULATION.profiles),
          city: DATA.city.current,
          cityName: DATA.city.getName(DATA.city.current)
        });
      }
    }
  };
  var cargo = {
    collection: typeof widjet.options.get("goods") === "object" ? widjet.options.get("goods") : [],
    add: function(item) {
      if (typeof item !== "object" || typeof item.length === "undefined" || typeof item.width === "undefined" || typeof item.height === "undefined" || typeof item.weight === "undefined") {
        widjet.logger.error("Illegal item " + item);
      } else {
        this.collection.push({
          length: item.length,
          width: item.width,
          height: item.height,
          weight: item.weight
        });
        widjet.calculate();
      }
    },
    reset: function() {
      this.collection = [];
    },
    get: function() {
      return widjet.service.cloneObj(this.collection);
    },
    getWeight: function() {
      return this.collection.reduce((a, b) => a + b.weight, 0);
    }
  };
  var LANG = {
    collection: {},
    replaceAll: function(content) {
      for (var langKey in this.collection) {
        content = content.replace(new RegExp("#" + langKey + "#", "g"), this.collection[langKey]);
      }
      return content;
    },
    get: function(wat) {
      if (typeof this.collection[wat] !== "undefined") {
        return this.collection[wat];
      } else {
        widjet.logger.warn("No lang string with key " + wat);
        return "";
      }
    },
    write: function(data) {
      ipjq.getJSON(
        widjet.options.get("templatepath"),
        {},
        HTML.save
      );
      if (typeof data.LANG === "undefined") {
        var sign = "Unable to load land-file : ";
        if (typeof data.error !== "undefined") {
          for (var i in data.error) {
            sign += data.error[i] + ", ";
          }
          sign = sign.substr(0, sign.length - 2);
        } else {
          sign += "unknown error.";
        }
        widjet.logger.error(sign);
      } else {
        LANG.collection = widjet.service.cloneObj(data.LANG);
        loaders.onLANGLoad();
      }
    }
  };
  var makeid = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };
  var IDS = {
    WID: makeid() + "_",
    options: {
      "MAP": "SDEK_map",
      "PRELOADER": "preloader"
    },
    replaceAll: function(content) {
      for (var optKey in this.options) {
        content = content.replace(new RegExp("#" + optKey + "#", "g"), this.WID + this.options[optKey].replace("#", ""));
      }
      return content.replace(new RegExp("#WID#", "g"), this.WID);
    },
    get: function(wat) {
      if (typeof this.options[wat] !== "undefined") {
        return "#" + this.WID + this.options[wat];
      } else {
        return "#" + this.WID + wat;
      }
    }
  };
  var template = {
    readyA: false,
    html: {
      get: function() {
        return HTML.getBlock("widget", {
          "CITY": widjet.options.get("defaultCity")
        });
      },
      makeADAPT: function() {
        if (widjet.options.get("link")) {
          return;
        }
        var moduleH = ipjq(IDS.get("cdek_widget_cnt")).outerHeight();
        if (moduleH < 476)
          ;
        else {
          ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-list__box, .mCustomScrollBox").css("max-height", "auto");
        }
        if (moduleH < ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type__box").outerHeight() + 56) {
          ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type").css("max-height", moduleH - 56 + "px");
        } else {
          let maxHeight = ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type__box").outerHeight();
          if (maxHeight !== 0) {
            ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type").css("max-height", ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type__box").outerHeight() + "px");
          }
        }
      },
      makeFULLSCREEN: function() {
        this.makeADAPT();
        ipjq(window).resize(this.makeADAPT());
      },
      place: function() {
        var html = this.get();
        if (widjet.options.get("link")) {
          ipjq("#" + widjet.options.get("link")).html(html);
        } else if (widjet.options.get("popup")) {
          widjet.popupped = true;
          html = HTML.getBlock("popup", { WIDGET: html });
          ipjq("body").append(html);
          this.makeFULLSCREEN();
        } else {
          html = ipjq(html);
          html.css("position", "fixed");
          html.css("top", 0);
          html.css("left", 0);
          html.css("z-index", 1e3);
          ipjq("body").append(html);
          this.makeFULLSCREEN();
        }
        if (!widjet.options.get("choose")) {
          ipjq(IDS.get("cdek_widget_cnt")).addClass("nochoose");
        }
        var htmlka = HTML.getBlock("sidebar");
        if (widjet.options.get("hidecash")) {
          var temp = [];
          temp.push(htmlka.slice(0, 1476));
          temp.push(htmlka.slice(2693));
          htmlka = temp.join("");
        }
        if (widjet.options.get("hidedress")) {
          var temp = [];
          temp.push(htmlka.slice(0, widjet.options.get("hidecash") ? 1476 : 2693));
          temp.push(htmlka.slice(htmlka.indexOf("<hr>")));
          htmlka = temp.join("");
        }
        if (widjet.options.get("hidedelt")) {
          ipjq(IDS.get("cdek_delivery_types")).hide();
        }
        ipjq(IDS.get("sidebar")).html(htmlka);
        this.makeADAPT();
      },
      loadedCities: [],
      setDefaultCities() {
        const list = ipjq(IDS.get("city_list"));
        list.empty();
        const citiesToShow = this.loadedCities.slice(0, 7);
        citiesToShow.forEach((el) => {
          const _block = HTML.getBlock("city", el);
          list.prepend(_block);
        });
      },
      loadCityList: function(data) {
        this.loadedCities = [];
        for (const i in data) {
          this.loadedCities.push({
            "CITYID": i,
            "CITYNAME": data[i],
            "CITY_DETAILS": typeof DATA.regions.collection[i] != "undefined" ? DATA.regions.collection[i] : "&nbsp;"
          });
        }
        this.setDefaultCities();
      },
      updatePrices: function(obPrices) {
        ipjq(IDS.get("cdek_widget_cnt")).find(IDS.get("cdek_delivery_types") + " div.CDEK-widget__delivery-type__item").remove();
        if (typeof obPrices == "undefined" || obPrices.length == 0) {
          ipjq(IDS.get("cdek_widget_cnt")).find(IDS.get("cdek_delivery_type_title span.CDEK_choose")).hide();
          ipjq(IDS.get("cdek_widget_cnt")).find(IDS.get("cdek_delivery_type_title span.CDEK_no-avail")).show();
          ipjq(IDS.get("cdek_widget_cnt")).find(IDS.get("cdek_delivery_type_none")).show();
        } else {
          ipjq(IDS.get("cdek_widget_cnt")).find(IDS.get("cdek_delivery_type_title span.CDEK_choose")).show();
          ipjq(IDS.get("cdek_widget_cnt")).find(IDS.get("cdek_delivery_type_title span.CDEK_no-avail")).hide();
          ipjq(IDS.get("cdek_widget_cnt")).find(IDS.get("cdek_delivery_type_none")).hide();
          for (var i in obPrices) {
            switch (i) {
              case "courier":
              case "pickup":
                if (!CALCULATION.bad || obPrices[i].price !== false) {
                  var _tmpBlock = HTML.getBlock("d_" + i, {
                    "SUMM": obPrices[i].price === null ? LANG.get("COUNTING") : obPrices[i].price,
                    "CURR": obPrices[i].price === null ? "" : LANG.get(obPrices[i].currency),
                    "TIME": obPrices[i].term === null ? "" : obPrices[i].term,
                    "DAY": obPrices[i].term === null ? "" : LANG.get("DAY")
                  });
                  ipjq(IDS.get("cdek_delivery_types")).append(_tmpBlock);
                }
            }
          }
        }
        this.makeADAPT();
      },
      hideMap: function() {
        ipjq(IDS.get("MAP")).css("display", "none");
        ipjq(IDS.get("cdek_widget_cnt")).find("#SDEK_info").css("display", "none");
      }
    },
    controller: {
      getCity: function() {
        return DATA.city.get();
      },
      loadCity: function(doLoad) {
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel-details__back").click();
        if (typeof doLoad === "undefined" || doLoad != true) {
          this.calculate();
        }
        this.updatePrices();
        template.ymaps.init(DATA.city.current);
      },
      selectCity: function(city2) {
        if (typeof city2 === "object") {
          city2 = city2.data.name;
        }
        if (typeof city2 === "undefined" || !city2) {
          city2 = ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-list ul li").not(".no-active").first().data("cityid");
        }
        DATA.city.set(city2);
        template.controller.loadCity();
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-box input[type=text]").val(DATA.city.getName(city2));
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-list ul li").removeClass("focus").addClass("no-active").parent("ul").removeClass("open");
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-box input[type=text]")[0].blur();
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type__button").attr("class", "CDEK-widget__delivery-type__button");
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type__item").removeClass("active");
        setTimeout(function() {
          ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type").removeClass("CDEK-widget__delivery-type_close");
        }, 1e3);
        if (template.ui.addressSearch.ifOn()) {
          template.ui.addressSearch.hide();
        }
      },
      putCity: function(city2) {
        if (typeof city2 === "object") {
          city2 = city2.data.name;
        }
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-box input[type=text]").val(DATA.city.getName(city2));
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-list ul li").removeClass("focus").addClass("no-active").parent("ul").removeClass("open");
      },
      updatePrices: function() {
        template.html.updatePrices({
          courier: CALCULATION.profiles.courier,
          pickup: CALCULATION.profiles.pickup
        });
      },
      calculate: function(forse = false) {
        CALCULATION.calculate(forse);
      },
      chooseDeliveryType: function() {
        if (template.ui.addressSearch.ifOn()) {
          template.ui.addressSearch.hide();
        }
        if (ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-list ul").hasClass("open")) {
          var $liFocus = ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-list ul").find("li.focus");
          if ($liFocus.length != 0) {
            template.controller.selectCity($liFocus.find(".CDEK-widget__search-list__city-name").text());
          } else {
            template.controller.selectCity();
          }
          setTimeout(function() {
            ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type").removeClass("CDEK-widget__delivery-type_close");
          }, 1e3);
          return;
        }
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type").removeClass("CDEK-widget__delivery-type_close");
      },
      choosePVZ: function(id) {
        var qq = ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type__item:last");
        if (!qq.hasClass("active")) {
          qq.attr("class", "CDEK-widget__delivery-type__item").addClass("active");
          ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type__item:first").attr("class", "CDEK-widget__delivery-type__item").removeClass("active");
          ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type__button").attr("class", "CDEK-widget__delivery-type__button").addClass("CDEK-widget__delivery-type__button_pvz");
        }
        var PVZ = DATA.PVZ.getCurrent();
        widjet.binders.trigger("onChoose", {
          "id": id,
          "PVZ": PVZ[id],
          "price": CALCULATION.profiles.pickup.price,
          "currency": CALCULATION.profiles.pickup.currency,
          "term": CALCULATION.profiles.pickup.term,
          "tarif": CALCULATION.profiles.pickup.tarif,
          "city": DATA.city.current,
          "cityName": DATA.city.getName(DATA.city.current)
        });
        if (!widjet.options.get("link")) {
          this.close();
        }
      },
      chooseCOURIER: function() {
        widjet.binders.trigger("onChooseProfile", {
          "id": "courier",
          "city": DATA.city.current,
          "cityName": DATA.city.getName(DATA.city.current),
          "price": CALCULATION.profiles.courier.price,
          "currency": CALCULATION.profiles.courier.currency,
          "term": CALCULATION.profiles.courier.term,
          "tarif": CALCULATION.profiles.courier.tarif
        });
        if (!template.ui.active && !widjet.options.get("link")) {
          this.close();
        } else {
          if (template.ui.addressSearch.ifOn()) {
            template.ui.addressSearch.show();
            template.ui.addressSearch.fill();
          }
        }
      },
      open: function() {
        if (widjet.options.get("link")) {
          widjet.logger.error("This widjet is in non-floating mode - link is set");
        } else {
          template.ui.open();
        }
      },
      close: function() {
        if (widjet.options.get("link")) {
          widjet.logger.error("This widjet is in non-floating mode - link is set");
        } else {
          template.ui.close();
        }
      }
    },
    ui: {
      currentmark: false,
      markChozenPVZ: function(event) {
        template.ymaps.selectMark(event.data.id);
      },
      choosePVZ: function(event) {
        template.controller.choosePVZ(event.data.id);
      },
      addressSearch: {
        active: false,
        getInput: function() {
          return ipjq(IDS.get("cdek_courier_address_place"));
        },
        ifOn: function() {
          return widjet.options.get("detailAddress");
        },
        show: function() {
          template.ui.addressSearch.active = true;
          ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__courier-address__box").removeClass("CDEK-widget__courier-address__box_close");
        },
        hide: function() {
          template.ui.addressSearch.active = false;
          template.ui.addressSearch.killBaloon();
          ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__courier-address__box").addClass("CDEK-widget__courier-address__box_close");
        },
        fill: function() {
          if (DATA.city.getName()) {
            template.ui.addressSearch.getInput().val(DATA.city.getName(template.controller.getCity()) + ", ");
          }
          ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__courier-address__button").addClass("allowed");
        },
        mapClick: function(point) {
          if (template.ui.addressSearch.active && typeof point !== "undefined") {
            template.ymaps.centerAddr(point.geometry.getCoordinates());
            template.ui.addressSearch.getInput().val(point.properties.get("text"));
            template.ui.addressSearch.makeBaloon(point.geometry.getCoordinates(), point.properties.get("text"));
          }
        },
        search: function() {
          template.ymaps.getSearchAddress(template.ui.addressSearch.getInput().val(), template.ui.addressSearch.found);
        },
        found: function(point) {
          template.ui.addressSearch.killBaloon();
          template.ymaps.centerAddr(point.coords);
          template.ui.addressSearch.makeBaloon(point.coords, point.name);
        },
        baloon: false,
        makeBaloon: function(coords, text) {
          template.ui.addressSearch.baloon = template.ymaps.makeBaloon(coords, "<div class='CDEK-widget__baloon'>" + text + '<br><button class="CDEK-widget__choose" type="button" data-label="' + LANG.get("L_CHOOSE") + '">' + LANG.get("L_CHOOSE") + "</button></div>");
          if (template.ui.addressSearch.baloon) {
            template.ui.addressSearch.baloon.balloon.open();
            window.setTimeout(function() {
              ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__baloon .CDEK-widget__choose").on("click", template.ui.addressSearch.clickBaloon);
            }, 500);
          }
        },
        killBaloon: function() {
          if (template.ui.addressSearch.baloon) {
            template.ymaps.killBaloon(template.ui.addressSearch.baloon);
          }
        },
        clickBaloon: function() {
          template.ui.addressSearch.killBaloon();
          template.ui.addressSearch.choose();
        },
        choose: function() {
          DATA.address.fill(template.ui.addressSearch.getInput().val());
          ipjq.getJSON(
            widjet.options.get("servicepath"),
            { isdek_action: "getCity", address: DATA.address.get() },
            function(data) {
              if (typeof data.error === "undefined") {
                if (data.city.id === 63015) {
                  data.city.id = DATA.city.get();
                  data.city.city = "\u0420\u2018\u0421\u2039\u0420\u0454\u0420\u0455\u0420\u0406\u0420\u0455";
                }
                if (DATA.city.get() == data.city.id) {
                  template.ui.addressSearch.hide();
                  let address = DATA.address.get();
                  let addressArray = address.split(",");
                  let addressClean = (addressArray[addressArray.length - 2].trim() + ", " + addressArray[addressArray.length - 1].trim()).trim();
                  widjet.binders.trigger("onChooseAddress", {
                    "id": "courier",
                    "city": DATA.city.current,
                    "cityName": DATA.city.getName(DATA.city.current),
                    "price": CALCULATION.profiles.courier.price,
                    "currency": CALCULATION.profiles.courier.currency,
                    "term": CALCULATION.profiles.courier.term,
                    "tarif": CALCULATION.profiles.courier.tarif,
                    "address": DATA.address.get(),
                    "cleanaddress": addressClean
                  });
                  if (!widjet.options.get("link")) {
                    this.close();
                  }
                } else {
                  DATA.city.set(data.city.id, true);
                  ipjq(IDS.get("cdek_search_input")).val(data.city.city);
                  template.html.updatePrices({
                    "courier": { price: null, term: null },
                    "pickup": { price: null, term: null }
                  });
                  alert(LANG.get("ADDRESS_ANOTHER"));
                  template.controller.calculate(true);
                  template.controller.chooseDeliveryType();
                }
              } else {
                alert(LANG.get("ADDRESS_WRONG"));
                widjet.logger.warn("City from was't found " + data.error);
              }
            }
          );
        }
      },
      open: function() {
        ipjq(IDS.get("CDEK_popup")).show();
        if (widjet.loadedToAction) {
          widjet.finalAction();
        } else {
          widjet.popupped = false;
        }
        if (template.ymaps.map !== false) {
          template.ymaps.map.container.fitToViewport();
        }
        this.active = true;
      },
      close: function() {
        this.active = false;
        ipjq(IDS.get("CDEK_popup")).hide();
      }
    },
    ymaps: {
      map: false,
      readyToBlink: false,
      linker: IDS.get("MAP").replace("#", ""),
      searchControl: null,
      init: function(city2) {
        this.readyToBlink = false;
        var self = this;
        if (city2 == false) {
          ymaps.geolocation.get({}).then(function(result) {
            var gdeUser = result.geoObjects.get(0).properties.get("metaDataProperty").GeocoderMetaData.Address.Components;
            for (var i = gdeUser.length - 1; i >= 0; i--) {
              if (gdeUser[i].kind == "locality") {
                city2 = gdeUser[i].name;
                city2 = city2.replace(/РіРѕСЂРѕРґ\s|РїРѕСЃРµР»РѕРє\sРіРѕСЂРѕРґСЃРєРѕРіРѕ\sС‚РёРїР°\s|РїРѕСЃРµР»РѕРє\s|РїРѕСЃС‘Р»РѕРє\s|РґРµСЂРµРІРЅСЏ\s|СЃРµР»Рѕ\s/ig, "");
                DATA.city.set(city2);
                if (DATA.city.current !== false)
                  break;
              }
            }
            if (DATA.city.current == false) {
              gdeUser = result.geoObjects.get(0).geometry._coordinates;
              var delta = 100;
              for (var pvzCity in DATA.PVZ.collection) {
                for (var myPvz in DATA.PVZ.collection[pvzCity]) {
                  var mpvz = DATA.PVZ.collection[pvzCity][myPvz];
                  var deltaGeo = Math.sqrt(Math.pow(mpvz.cY - gdeUser[0], 2) + Math.pow(mpvz.cX - gdeUser[1], 2));
                  if (delta > deltaGeo) {
                    delta = deltaGeo;
                    city2 = pvzCity;
                  }
                }
              }
              if (city2 != false) {
                DATA.city.set(city2);
                city2 = DATA.city.getName(city2);
              } else {
                DATA.city.set("\u0420\u045A\u0420\u0455\u0421\u0403\u0420\u0454\u0420\u0406\u0420\xB0");
                city2 = "\u0420\u045A\u0420\u0455\u0421\u0403\u0420\u0454\u0420\u0406\u0420\xB0";
              }
            }
            widjet.options.set(city2, "defaultCity");
            template.controller.calculate();
            template.controller.updatePrices();
            self.loadMap(DATA.city.current);
            ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-box input[type=text]").val(city2);
          });
        } else {
          self.loadMap(DATA.city.current);
        }
      },
      loadMap: function(city2) {
        var self = this;
        city2 = DATA.city.getFullName(city2);
        DATA.currentCityName = city2;
        let mtypes = {};
        if (ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__sidebar-button-point.active").length) {
          ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__sidebar-button-point.active").each(function() {
            mtypes[ipjq(this).data("mtype")] = true;
          });
        }
        DATA.currentCityCode = 0;
        if (typeof DATA.PVZ.getCurrent() === "object") {
          self.placeMarks(mtypes);
          return;
        }
        ymaps.geocode(city2, {
          results: 1
        }).then(function(res) {
          var firstGeoObject = res.geoObjects.get(0);
          var coords = firstGeoObject.geometry.getCoordinates();
          if (!self.map) {
            self.makeMap({ center: coords });
          } else {
            self.map.setCenter(coords);
            self.map.setZoom(10);
          }
          self.placeMarks(mtypes);
        });
      },
      makeMap: function(addInfo) {
        if (typeof addInfo !== "object") {
          addInfo = {};
        }
        template.ymaps.map = new ymaps.Map(
          template.ymaps.linker,
          widjet.service.concatObj({
            zoom: 10,
            controls: []
          }, addInfo)
        );
        this.map.controls.add(new ymaps.control.ZoomControl(), {
          float: "none",
          position: {
            left: 12,
            bottom: 70
          }
        });
        template.ymaps.map.events.add("boundschange", widjet.hideLoader);
        template.ymaps.map.events.add("actionend", widjet.hideLoader);
        if (widjet.options.get("detailAddress")) {
          template.ymaps.map.events.add("click", template.ymaps.getClickAddress);
          new ymaps.SuggestView(IDS.get("cdek_courier_address_place").substr(1));
        }
      },
      addSearchBox: function() {
        if (params.searchAddressBox) {
          this.searchControl = new ymaps.control.SearchControl({
            options: {
              float: "none",
              position: {
                left: 320,
                top: 10
              }
            }
          });
          this.map.controls.add(this.searchControl);
        }
      },
      removeSearchBox: function() {
        if (params.searchAddressBox) {
          this.map.controls.remove(this.searchControl);
        }
      },
      centerAddr: function(coords) {
        var self = this;
        self.map.setCenter(coords);
        self.map.setZoom(17);
      },
      clearMarks: function() {
        if (typeof this.map.geoObjects.removeAll !== "undefined" && false)
          this.map.geoObjects.removeAll();
        else {
          do {
            var map = this.map;
            map.geoObjects.each(function(e) {
              map.geoObjects.remove(e);
            });
          } while (map.geoObjects.getBounds());
        }
      },
      placeMarks: function(mtypes) {
        DATA.currentCityCode = DATA.city.get();
        let pvzList = DATA.PVZ.getCurrent();
        if (typeof pvzList !== "object") {
          ipjq(IDS.get("sidebar")).hide();
        } else {
          ipjq(IDS.get("sidebar")).show();
        }
        ipjq(IDS.get("panel")).find(IDS.get("pointlist")).html("");
        ipjq(IDS.get("panel")).find(IDS.get("pointlist")).html(HTML.getBlock("panel_list"));
        var _panelContent = ipjq(IDS.get("pointlist")).find(".CDEK-widget__panel-content");
        if (typeof pvzList === "object") {
          template.ymaps.clusterer = new ymaps.Clusterer({
            gridSize: 50,
            preset: "islands#ClusterIcons",
            //'#0a8c37'
            clusterIconColor: "#0a8c37",
            hasBalloon: false,
            groupByCoordinates: false,
            clusterDisableClickZoom: false,
            maxZoom: 11,
            zoomMargin: [45],
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
          });
          var geoMarks = [];
          for (var i in pvzList) {
            if (typeof mtypes != "undefined") {
              if (typeof mtypes.dress != "undefined" && pvzList[i].Dressing != true) {
                continue;
              }
              if (typeof mtypes.cash != "undefined" && pvzList[i].Cash != true) {
                continue;
              }
              if (typeof mtypes.postamat != "undefined" && pvzList[i].Postamat != true) {
                continue;
              }
            }
            let img = widjet.options.get("path") + (pvzList[i].Postamat != true ? "images/sdekActive.png" : "images/postomatActive.png");
            widjet.options.get("path") + (pvzList[i].Postamat != true ? "images/sdekNActive.png" : "images/postomatNActive.png");
            pvzList[i].placeMark = new ymaps.Placemark([pvzList[i].cY, pvzList[i].cX], {}, {
              iconLayout: "default#image",
              iconImageHref: img,
              iconImageSize: [30, 40],
              iconImageOffset: [-10, -30]
            });
            geoMarks.push(pvzList[i].placeMark);
            pvzList[i].placeMark.link = i;
            pvzList[i].list_block = ipjq(HTML.getBlock("point", {
              P_NAME: pvzList[i].Name,
              P_ADDR: pvzList[i].Address,
              P_TIME: pvzList[i].WorkTime.replace(new RegExp(",", "g"), "<br/>")
            }));
            pvzList[i].placeMark.listItem = pvzList[i].list_block;
            pvzList[i].placeMark.events.add(["balloonopen", "click"], function(metka) {
              var _prevMark = template.ui.currentmark;
              template.ui.currentmark = metka.get("target");
              if (typeof _prevMark == "object") {
                try {
                  _prevMark.events.fire("mouseleave");
                } catch (e) {
                }
              }
              ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__sidebar-burger:not(.active)").trigger("click");
              template.ui.markChozenPVZ({ data: { id: metka.get("target").link, link: template.ui } });
            });
            pvzList[i].placeMark.events.add(["mouseenter"], function(metka) {
            });
            pvzList[i].placeMark.events.add(["mouseleave"], function(metka) {
            });
            pvzList[i].list_block.mark = pvzList[i].placeMark;
            pvzList[i].list_block.on("click", { mark: i }, function(event) {
              pvzList[event.data.mark].placeMark.events.fire("click");
            });
            _panelContent.append(pvzList[i].list_block);
          }
          if (geoMarks.length > 0) {
            template.ymaps.clusterer.add(geoMarks);
            var _bounds = template.ymaps.clusterer.getBounds();
            if (!this.map) {
              if (_bounds[0][0] == _bounds[1][0]) {
                this.makeMap({ center: _bounds[0] });
              } else {
                this.makeMap({ bounds: _bounds });
                this.map.setBounds(_bounds, {
                  zoomMargin: 45,
                  checkZoomRange: true,
                  duration: 500
                });
              }
              template.ymaps.clearMarks();
              this.map.geoObjects.add(template.ymaps.clusterer);
              widjet.hideLoader();
            } else {
              if (_bounds[0][0] == _bounds[1][0]) {
                this.map.setCenter(_bounds[0]);
                this.map.setZoom(10);
                template.ymaps.clearMarks();
                this.map.geoObjects.add(template.ymaps.clusterer);
              } else {
                this.map.setBounds(template.ymaps.clusterer.getBounds(), {
                  zoomMargin: 45,
                  checkZoomRange: true,
                  duration: 500
                }).then(
                  function() {
                    template.ymaps.clearMarks();
                    this.map.geoObjects.add(template.ymaps.clusterer);
                    if (this.map.getZoom() > 12) {
                      this.map.setZoom(12);
                    }
                  },
                  function() {
                    template.ymaps.clearMarks();
                    this.map.geoObjects.add(template.ymaps.clusterer);
                    if (this.map.getZoom() > 12) {
                      this.map.setZoom(12);
                    }
                  },
                  this
                );
              }
            }
          } else {
            template.ymaps.clearMarks();
            widjet.hideLoader();
          }
        }
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel-content").mCustomScrollbar();
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type").mCustomScrollbar();
        this.readyToBlink = true;
      },
      makeUpCenter: function(cords) {
        var projection = this.map.options.get("projection");
        cords = this.map.converter.globalToPage(
          projection.toGlobalPixels(
            cords,
            this.map.getZoom()
          )
        );
        var ww = ipjq(IDS.get("panel")).width();
        if (ipjq(IDS.get("cdek_widget_cnt")).width() - ww > 100) {
          cords[0] = cords[0] + ww / 2;
        }
        cords = projection.fromGlobalPixels(
          this.map.converter.pageToGlobal(cords),
          this.map.getZoom()
        );
        return cords;
      },
      selectMark: function(wat) {
        var cityPvz = DATA.PVZ.getCurrent();
        if (parseInt(DATA.city.current) !== parseInt(cityPvz[wat].CityCode)) {
          DATA.city.set(parseInt(cityPvz[wat].CityCode));
          city = DATA.city.getName(cityPvz[wat].CityCode);
          ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-box input[type=text]").val(city);
          CALCULATION.calculate();
          template.controller.updatePrices();
        } else if (parseInt(DATA.city.current) === 44) {
          CALCULATION.calculate();
          template.controller.updatePrices();
        }
        this.map.setZoom(16);
        this.map.setCenter(template.ymaps.makeUpCenter([cityPvz[wat].cY, cityPvz[wat].cX]));
        let _detailPanel = ipjq(IDS.get("panel")).find(IDS.get("detail_panel"));
        _detailPanel.html("");
        let _photoHTML = "";
        if (typeof cityPvz[wat].Picture != "undefined") {
          for (let _imgIndex in cityPvz[wat].Picture) {
            _photoHTML += HTML.getBlock("image_c", { D_PHOTO: cityPvz[wat].Picture[_imgIndex] });
          }
        }
        let paramsD;
        let _block = ipjq(HTML.getBlock("panel_details", paramsD = {
          D_NAME: cityPvz[wat].Name,
          D_ADDR: cityPvz[wat].Address,
          D_TIME: cityPvz[wat].WorkTime.replace(new RegExp(",", "g"), "<br/>"),
          D_WAY: cityPvz[wat].AddressComment.search("http") == -1 ? cityPvz[wat].AddressComment : "",
          D_IMGS: _photoHTML
        }));
        if (paramsD.D_WAY == "") {
          _block.find(".CDEK-widget__way").remove();
        }
        if (paramsD.D_IMGS == "") {
          _block.find(".sdek_image_block").remove();
        }
        _block.find(IDS.get("choose_button")).on("click", { id: wat }, function(event) {
          template.controller.choosePVZ(event.data.id);
        });
        _detailPanel.html(_block);
        _detailPanel.find(".CDEK-widget__panel-content").mCustomScrollbar();
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel-list").css("left", "-330px");
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel-details").css("right", "0px");
      },
      blinkPVZ: function(event) {
        if (event.data.link.readyToBlink) {
          var cityPvz = DATA.PVZ.getCurrent();
          if (template.ui.currentmark == cityPvz[event.data.id].placeMark) {
            return;
          }
          if (event.data.ifOn) {
            event.data.link.clusterer.remove(cityPvz[event.data.id].placeMark);
            event.data.link.map.geoObjects.add(cityPvz[event.data.id].placeMark);
            cityPvz[event.data.id].placeMark.options.set({ iconImageHref: widjet.options.get("path") + "images/sdekActive.png" });
          } else {
            cityPvz[event.data.id].placeMark.options.set({ iconImageHref: widjet.options.get("path") + "images/sdekNActive.png" });
            event.data.link.map.geoObjects.remove(cityPvz[event.data.id].placeMark);
            event.data.link.clusterer.add(cityPvz[event.data.id].placeMark);
          }
        }
      },
      getClickAddress: function(e) {
        ymaps.geocode(
          e.get("coords"),
          { kind: "house" }
        ).then(function(res) {
          template.ui.addressSearch.mapClick(res.geoObjects.get(0));
        });
      },
      getSearchAddress: function(string, callback) {
        let country = widjet.options.get("country");
        if (country) {
          string = country + ", " + string;
        }
        ymaps.geocode(string, {
          kind: "house"
        }).then(function(res) {
          var info = res.geoObjects.get(0);
          var obReturn = {
            name: info.properties.get("name"),
            descr: info.properties.get("description"),
            coords: info.geometry.getCoordinates()
          };
          if (typeof callback !== "undefined") {
            callback(obReturn);
          }
          return obReturn;
        });
      },
      makeBaloon: function(coords, html) {
        var bln = new ymaps.Placemark(coords, {
          balloonContent: html
        }, {
          balloonCloseButton: false,
          iconLayout: "default#image"
          //iconImageHref: '/bitrix/images/ipol.sdek/widjet/sdekNActive.png',
          //iconImageSize: [40, 43],
          //iconImageOffset: [-10, -31]
        });
        template.ymaps.map.geoObjects.add(bln);
        return bln;
      },
      killBaloon: function(wat) {
        template.ymaps.map.geoObjects.remove(wat);
      }
    }
  };
  widjet.binders.add(template.controller.updatePrices, "onCalculate");
  widjet.sdekSetPVZS = function(mtypes) {
    template.ymaps.clearMarks();
    if (typeof mtypes !== "undefined") {
      template.ymaps.placeMarks(mtypes);
      return;
    }
    template.ymaps.placeMarks();
  };
  widjet.sdekSetPVZSWithAddress = function(address) {
    if (address !== "") {
      ipjq(".CDEK-widget__panel-list__item").each(function(index, elem) {
        let pvzAddress = ipjq(elem).find(".CDEK-widget__panel-list__item-adress")[0].innerText;
        if (pvzAddress.toLowerCase().indexOf(address.toLowerCase()) !== -1) {
          ipjq(elem).show();
        } else {
          ipjq(elem).hide();
        }
      });
    } else {
      ipjq(".CDEK-widget__panel-list__item").each(function(index, elem) {
        ipjq(elem).show();
      });
    }
  };
  widjet.chooseCourier = function() {
    template.controller.chooseCOURIER();
  };
  widjet.sdekWidgetEvents = function() {
    ipjq(".CDEK-widget__popup__close-btn").off("click").on("click", function() {
      ipjq(this).closest(".CDEK-widget__popup-mask").hide();
    });
    ipjq(IDS.get("cdek_widget_cnt")).on("keyup", ".CDEK-widget__panel-address-search", "input", function(event) {
      widjet.sdekSetPVZSWithAddress(event.target.value);
    });
    ipjq(IDS.get("cdek_widget_cnt")).on("click", ".CDEK-widget__tag-postamat", "p", function(event) {
      if (ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__tag-postamat").hasClass("active")) {
        widjet.sdekSetPVZS();
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__tag-postamat").removeClass("active");
      } else {
        widjet.sdekSetPVZS({ postamat: true });
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__tag-postamat").addClass("active");
      }
    });
    ipjq(IDS.get("cdek_widget_cnt")).on("click", ".CDEK-widget__tag-cash", "p", function(event) {
      if (ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__tag-cash").hasClass("active")) {
        widjet.sdekSetPVZS();
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__tag-cash").removeClass("active");
      } else {
        widjet.sdekSetPVZS({ cash: true });
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__tag-cash").addClass("active");
      }
    });
    ipjq(IDS.get("cdek_widget_cnt")).on("click", ".CDEK-widget__tag-fitting-room", "p", function(event) {
      if (ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__tag-fitting-room").hasClass("active")) {
        widjet.sdekSetPVZS();
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__tag-fitting-room").removeClass("active");
      } else {
        widjet.sdekSetPVZS({ dress: true });
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__tag-fitting-room").addClass("active");
      }
    });
    ipjq(IDS.get("cdek_widget_cnt")).on("click", ".CDEK-widget__sidebar-button", { widjet }, function() {
      var _this = ipjq(this);
      _this.toggleClass("active");
      var idHint = _this.attr("data-hint");
      var wid = ipjq(IDS.get("cdek_widget_cnt")).find(idHint).outerWidth();
      if (_this.hasClass("CDEK-widget__sidebar-button-point")) {
        if (ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__sidebar-button-point.active").length) {
          var mtypes = {};
          ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__sidebar-button-point.active").each(function() {
            mtypes[ipjq(this).data("mtype")] = true;
          });
          widjet.sdekSetPVZS(mtypes);
        } else {
          widjet.sdekSetPVZS();
        }
      } else {
        ipjq(IDS.get("cdek_widget_cnt")).find(idHint).css({
          right: -wid,
          "opacity": "0"
        });
        if (_this.hasClass("CDEK-widget__sidebar-burger")) {
          if (_this.hasClass("close")) {
            _this.removeClass("close");
          }
          _this.toggleClass("open");
          if (!_this.hasClass("open")) {
            _this.addClass("close");
          }
          if (ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel").hasClass("open")) {
            if (_this.hasClass("active")) {
              ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel-contacts").fadeOut(600);
              ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel-list, .CDEK-widget__panel-details").fadeIn(600);
              ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__sidebar-button_phone").removeClass("active");
            } else {
              ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel-list, .CDEK-widget__panel-details").fadeOut(600);
              ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel").removeClass("open");
            }
          } else {
            ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel").addClass("open");
            ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel-list, .CDEK-widget__panel-details").fadeIn(600);
          }
        }
        if (_this.hasClass("CDEK-widget__sidebar-button_phone")) {
          if (ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel").hasClass("open")) {
            if (_this.hasClass("active")) {
              ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel-list, .CDEK-widget__panel-details").fadeOut(600);
              ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel-contacts").fadeIn(600);
              ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__sidebar-burger").removeClass("active").removeClass("open").addClass("close");
            } else {
              ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel-contacts").fadeOut(600);
              ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel").removeClass("open");
            }
          } else {
            ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel").addClass("open");
            ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel-contacts").fadeIn(600);
          }
        }
      }
    }).on("click", ".CDEK-widget__choose", function() {
      ipjq(this).addClass("widget__loading");
    });
    ipjq(IDS.get("cdek_widget_cnt")).on("mousemove", ".CDEK-widget__sidebar-button", function() {
      if (!ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel").hasClass("open")) {
        var idHint = ipjq(this).attr("data-hint");
        ipjq(IDS.get("cdek_widget_cnt")).find(idHint).css({
          right: "67px",
          "opacity": "1"
        });
      }
    }).on("mouseleave", ".CDEK-widget__sidebar-button", function() {
      var idHint = ipjq(this).attr("data-hint");
      var wid = ipjq(IDS.get("cdek_widget_cnt")).find(idHint).outerWidth();
      ipjq(IDS.get("cdek_widget_cnt")).find(idHint).css({
        right: -wid,
        "opacity": "0"
      });
    }).on("hover", ".CDEK-widget__panel-headline", function() {
      if (ipjq(this).outerWidth() <= ipjq(this).find("span").outerWidth()) {
        ipjq(this).addClass("hover-long");
      }
    }, function() {
      if (ipjq(this).hasClass("hover-long")) {
        ipjq(this).removeClass("hover-long");
      }
    });
    ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__sidebar-button").each(function(index, el) {
      var idHint = ipjq(el).attr("data-hint");
      var top = (ipjq(el).outerHeight() + -ipjq(IDS.get("cdek_widget_cnt")).find(idHint).outerHeight()) / 2 + 62 * index;
      var wid = ipjq(IDS.get("cdek_widget_cnt")).find(idHint).outerWidth();
      ipjq(IDS.get("cdek_widget_cnt")).find(idHint).css({
        "right": -wid,
        "top": top,
        "opacity": "0"
      });
    });
    ipjq(IDS.get("cdek_widget_cnt")).on("click", ".CDEK-widget__panel-details__back", function() {
      ipjq(this).parents(".CDEK-widget__panel-details").css("right", "-330px");
      ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__panel-list").css("left", "0px");
    }).on("click", ".CDEK-widget__panel-details__block-img", function() {
      var src = ipjq(this).find("img").attr("src");
      var $block = ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__photo");
      $block.find("img").attr("src", src);
      $block.addClass("active");
    }).on("click", ".CDEK-widget__photo", function(e) {
      if (!ipjq(e.target).is("img")) {
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__photo").removeClass("active");
      }
    }).on("focusin", ".CDEK-widget__search-box input[type=text]", function() {
      ipjq(this).val("");
      template.html.setDefaultCities();
      if (ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type").hasClass("CDEK-widget__delivery-type_close")) {
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-list ul").addClass("open").find("li").removeClass("no-active");
        return;
      }
      ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type").addClass("CDEK-widget__delivery-type_close");
      setTimeout(function() {
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-list ul").addClass("open").find("li").removeClass("no-active");
      }, 1e3);
    }).on("click", ".CDEK-widget__search-list ul li", function() {
      template.ymaps.removeSearchBox();
      template.controller.selectCity(ipjq(this).data("cityid"));
    }).on("keydown", ".CDEK-widget__search-box input[type=text]", function(e) {
      var $liActive = ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-list ul li:not(.no-active)");
      var $liFocus = $liActive.filter(".focus");
      if (e.keyCode === 40) {
        if ($liFocus.length == 0) {
          $liActive.first().addClass("focus");
        } else {
          $liFocus.removeClass("focus");
          if ($liFocus.nextAll().filter(":not(.no-active)").eq(0).length != 0) {
            $liFocus.nextAll().filter(":not(.no-active)").eq(0).addClass("focus");
          } else {
            $liActive.first().addClass("focus");
          }
        }
      }
      if (e.keyCode === 38) {
        if ($liFocus.length == 0) {
          $liActive.last().addClass("focus");
        } else {
          $liFocus.removeClass("focus");
          if ($liFocus.prevAll().filter(":not(.no-active)").eq(0).length != 0) {
            $liFocus.prevAll().filter(":not(.no-active)").eq(0).addClass("focus");
          } else {
            $liActive.last().addClass("focus");
          }
        }
      }
    }).on("keyup", ".CDEK-widget__search-box input[type=text]", function(e) {
      const currentValue = ipjq(this).val();
      console.log(ipjq(this).val());
      let filter;
      try {
        filter = new RegExp("^(" + currentValue + ")+.*", "i");
      } catch (e2) {
        filter = "";
      }
      console.log(filter);
      var $li = ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-list ul li");
      const $ul = ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-list ul");
      console.log(213213);
      if (e.keyCode === 13) {
        var $liActive = $li.not(".no-active");
        var $liFocus = $liActive.filter(".focus");
        if ($liFocus.length == 0) {
          template.controller.selectCity();
        } else {
          template.controller.selectCity($liFocus.find(".CDEK-widget__search-list__city-name").text());
          $liFocus.removeClass("focus");
        }
        if (DATA.city.getName(DATA.city.current) != ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-box input[type=text]").val()) {
          type = "courier";
          setTimeout(function() {
            ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type").addClass("CDEK-widget__delivery-type_close");
          }, 1001);
          widjet.chooseCourier();
        }
        return;
      }
      console.log(213213);
      if (filter !== "") {
        const oldIds = [];
        $ul.children().each((i, el) => {
          oldIds.push(el.getAttribute("data-cityid"));
        });
        const citiesToShow = template.html.loadedCities.filter((el) => el["CITYNAME"].includes(currentValue)).slice(0, 7);
        const currentIds = citiesToShow.map((el) => el["CITYID"]);
        if (citiesToShow.length === 0) {
          $ul.removeClass("open");
        } else if (!$ul.hasClass("open")) {
          $ul.addClass("open");
        }
        if (oldIds.length === currentIds.length) {
          if (oldIds.sort().toString() === currentIds.sort().toString()) {
            return;
          }
        }
        $ul.empty();
        citiesToShow.forEach((el, idx) => {
          const _block = HTML.getBlock("city", el);
          const li = ipjq(_block);
          li.removeClass("no-active");
          $ul.prepend(li);
        });
      } else {
        $li.removeClass("no-active");
      }
    }).on("click", function(e) {
      if (ipjq(e.target).closest(".CDEK-widget__search").length == 0 && ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-list ul li").not(".no-active").length != 0) {
        template.controller.putCity(template.controller.getCity());
      }
    }).on("click", ".CDEK-widget__delivery-type__item", { widjet }, function(e) {
      var type2 = ipjq(this).attr("data-delivery-type");
      if (type2 === "pvz") {
        template.ymaps.addSearchBox();
      }
      if (!ipjq(this).hasClass("active")) {
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type__item.active").removeClass("active");
        ipjq(this).addClass("active");
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type__button").attr("class", "CDEK-widget__delivery-type__button").addClass("CDEK-widget__delivery-type__button_" + type2);
      }
      if (type2 == "courier") {
        e.data.widjet.chooseCourier();
      }
      ipjq(this).parents(".CDEK-widget__delivery-type").addClass("CDEK-widget__delivery-type_close");
    }).on("click", ".CDEK-widget__delivery-type__button", function() {
      template.ymaps.removeSearchBox();
      template.controller.chooseDeliveryType();
      if (DATA.city.getName(DATA.city.current) != ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-box input[type=text]").val()) {
        type = "courier";
        setTimeout(function() {
          ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__delivery-type").addClass("CDEK-widget__delivery-type_close");
        }, 1001);
        widjet.chooseCourier();
      }
    }).on("click", ".CDEK-widget__courier-address__button", function() {
      template.ui.addressSearch.search();
    });
  };
  widjet.city = {
    get: function() {
      return DATA.city.current;
    },
    set: function(name) {
      let newCity = DATA.city.set(name);
      if (newCity !== false) {
        ipjq(IDS.get("cdek_widget_cnt")).find(".CDEK-widget__search-box input[type=text]").val(DATA.city.getName(newCity));
      }
      template.controller.loadCity();
    },
    check: function(name) {
      return DATA.city.getId(name);
    }
  };
  widjet.PVZ = {
    get: function(cityName) {
      return DATA.PVZ.getCityPVZ(cityName);
    },
    check: function(cityName) {
      return DATA.PVZ.check(cityName);
    }
  };
  widjet.cargo = {
    add: function(item) {
      cargo.add(item);
    },
    reset: function() {
      cargo.reset();
    },
    get: function() {
      return cargo.get();
    }
  };
  widjet.calculate = function() {
    CALCULATION.calculate();
    return CALCULATION.profiles;
  };
  if (!widjet.options.get("link")) {
    widjet.open = function() {
      template.controller.open();
    };
    widjet.close = function() {
      template.controller.close();
    };
  }
  return widjet;
}
const _sfc_main$3 = {
  el: "#s",
  mounted() {
    var insertScript = document.createElement("script");
    insertScript.setAttribute("src", "https://widget.cdek.ru/widget/scripts/ipjq.js");
    document.body.appendChild(insertScript);
    insertScript = document.createElement("script");
    insertScript.setAttribute("src", "https://api-maps.yandex.ru/2.1/?apikey=f4e034c2-8c37-4168-8b97-99b6b3b268d7&amp;lang=ru_RU");
    document.body.appendChild(insertScript);
    insertScript = document.createElement("script");
    insertScript.setAttribute("src", "https://widget.cdek.ru/widget/scripts/jquery.mCustomScrollbar.concat.min.js");
    document.body.appendChild(insertScript);
  },
  data() {
    return {
      orderWidjet: ISDEKWidjet({
        popup: true,
        defaultCity: "\u0422\u0430\u043C\u0431\u043E\u0432",
        cityFrom: "\u0423\u0432\u0430\u0440\u043E\u0432\u043E",
        goods: [
          // установим данные о товарах из корзины
          { length: 10, width: 20, height: 20, weight: 5 }
        ],
        onReady: function() {
          ipjq("#linkForWidjet").css("display", "inline");
        },
        onChoose: (info) => {
          this.$emit("onChoise", info);
          this.orderWidjet.close();
        }
      })
    };
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "s" }, _attrs))}><button style="${ssrRenderStyle({ "background": "rgb(76, 175, 80)", "cursor": "pointer", "width": "100%", "border": "medium none", "border-radius": "6px", "font-size": "16px", "padding": "2%", "margin-top": "1%" })}"> \u0412\u044B\u0431\u0440\u0430\u0442\u044C \u043F\u0443\u043D\u043A \u0432\u044B\u0434\u0430\u0447\u0438 </button><div id="linkForWidjet" style="${ssrRenderStyle({ "display": "none" })}"></div><div id="oDcfl_CDEK_popup" class="CDEK-widget__popup-mask" style="${ssrRenderStyle({ "display": "none" })}"><div class="CDEK-widget__popup"><a class="CDEK-widget__popup__close-btn" href="#"></a><div class="CDEK-widget" id="oDcfl_cdek_widget_cnt"><div class="CDEK-widget__preloader" id="oDcfl_preloader"><div class="CDEK-widget__preloader-truck"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440.34302 315.71001"><g><path class="path1" d="M416.43,188.455q-1.014-1.314-1.95-2.542c-7.762-10.228-14.037-21.74-19.573-31.897-5.428-9.959-10.555-19.366-16.153-25.871-12.489-14.513-24.24-21.567-35.925-21.567H285.128c-0.055.001-5.567,0.068-12.201,0.068h-9.409a14.72864,14.72864,0,0,0-14.262,11.104l-0.078.305V245.456l0.014,0.262a4.86644,4.86644,0,0,1-1.289,3.472c-1.587,1.734-4.634,2.65-8.812,2.65H14.345C6.435,251.839,0,257.893,0,265.334v46.388c0,7.441,6.435,13.495,14.345,13.495h49.36a57.8909,57.8909,0,0,0,115.335,0h82.61a57.89089,57.89089,0,0,0,115.335,0H414.53a25.8416,25.8416,0,0,0,25.813-25.811v-44.29C440.344,219.47,425.953,200.805,416.43,188.455ZM340.907,320.132a21.5865,21.5865,0,1,1-21.59-21.584A21.61074,21.61074,0,0,1,340.907,320.132ZM390.551,207.76c-0.451.745-1.739,1.066-3.695,0.941l-99.197-.005V127.782h42.886c11.539,0,19.716,5.023,28.224,17.337,5.658,8.19,20.639,33.977,21.403,35.293,0.532,1.027,1.079,2.071,1.631,3.125C386.125,191.798,392.658,204.279,390.551,207.76ZM121.372,298.548a21.58351,21.58351,0,1,1-21.583,21.584A21.6116,21.6116,0,0,1,121.372,298.548Z" transform="translate(0 -62.31697)"></path><path class="path2" d="M30.234,231.317h68a12.51354,12.51354,0,0,0,12.5-12.5v-50a12.51354,12.51354,0,0,0-12.5-12.5h-68a12.51354,12.51354,0,0,0-12.5,12.5v50A12.51418,12.51418,0,0,0,30.234,231.317Z" transform="translate(0 -62.31697)"></path><path class="path3" d="M143.234,231.317h68a12.51354,12.51354,0,0,0,12.5-12.5v-50a12.51354,12.51354,0,0,0-12.5-12.5h-68a12.51354,12.51354,0,0,0-12.5,12.5v50A12.51418,12.51418,0,0,0,143.234,231.317Z" transform="translate(0 -62.31697)"></path><path class="path4" d="M30.234,137.317h68a12.51354,12.51354,0,0,0,12.5-12.5v-50a12.51355,12.51355,0,0,0-12.5-12.5h-68a12.51355,12.51355,0,0,0-12.5,12.5v50A12.51418,12.51418,0,0,0,30.234,137.317Z" transform="translate(0 -62.31697)"></path><path class="path5" d="M143.234,137.317h68a12.51354,12.51354,0,0,0,12.5-12.5v-50a12.51354,12.51354,0,0,0-12.5-12.5h-68a12.51354,12.51354,0,0,0-12.5,12.5v50A12.51418,12.51418,0,0,0,143.234,137.317Z" transform="translate(0 -62.31697)"></path></g></svg><div class="CDEK-widget__preloader-truck__grass"></div><div class="CDEK-widget__preloader-truck__road"></div></div></div><div id="oDcfl_SDEK_map" class="CDEK-widget__map"></div><div class="CDEK-widget__search CDEK-widget__inaccessible"><div class="CDEK-widget__search-box"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.63557 50.41538"><path class="path" d="M51.353,0.914A0.99853,0.99853,0,0,0,50.218.701L0.583,23.481a1,1,0,0,0,.252,1.895l22.263,3.731,2.545,21.038a1.00164,1.00164,0,0,0,.824.865,0.97388,0.97388,0,0,0,.169.015,0.999,0.999,0,0,0,.896-0.556l24-48.415A0.99978,0.99978,0,0,0,51.353.914ZM27.226,46.582L24.994,28.125a1.00155,1.00155,0,0,0-.828-0.866L4.374,23.941,48.485,3.697Z" transform="translate(-0.0002 -0.6096)"></path></svg><input type="text" name="town" value="\u041A\u0430\u0437\u0430\u043D\u044C" placeholder="\u041F\u043E\u0438\u0441\u043A \u0433\u043E\u0440\u043E\u0434\u0430" id="oDcfl_cdek_search_input"> <button class="CDEK-widget__delivery-type__button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 608.99721 611.84603"><g><path class="CDEK-widget__delivery_courier" d="M417.19812,302.72005a22.21621,22.21621,0,0,0-21.362-20.04709l-72.26781-1.108a9.97688,9.97688,0,0,1-9.10476-7.907L298.5408,172.42893c-0.57712-3.667-3.99636-18.61788-22.66187-18.61788L186.01,157.72438c-11.83932.51451-21.464,6.27084-21.464,22.42639,0,0-.3784,224.99753-0.83847,233.15088l-3.14426,55.66853a91.98249,91.98249,0,0,1-6.32529,26.27846l-36.3755,82.33218a18.97718,18.97718,0,0,0,13.0671,26.65825l12.1102,3.00544a23.2673,23.2673,0,0,0,5.60523.67377c9.77581,0,19.127-5.67329,23.27031-14.11791l34.57743-70.4806a171.14444,171.14444,0,0,0,10.59795-29.41047l19.5108-81.27592,47.2171,72.20793c3.8929,5.95368,8.009,17.37786,8.808,24.4477l9.1279,80.84172a24.0889,24.0889,0,0,0,23.36287,20.86923l13.81027-.04765a20.1837,20.1837,0,0,0,20.24446-22.42911l-9.53353-96.11388a139.95253,139.95253,0,0,0-7.24815-30.64368L300.08163,351.25756l-0.26134-23.29618,98.33117-3.63972a19.785,19.785,0,0,0,19.063-21.41777Zm-92.0808,301.47133h0v0Z" transform="translate(-2.00187 0.84609)"></path> <path class="CDEK-widget__delivery_courier" d="M214.73855,132.44774a66.665,66.665,0,0,0,66.24334-73.88758l22.33112-2.5195c7.78172-.87795,15.68051-7.08481,18.37287-14.43777L329.16542,21.176A13.0559,13.0559,0,0,0,328.0098,9.059a12.51735,12.51735,0,0,0-10.50812-5.1193c-0.51043,0-1.03856.0245-1.58029,0.07622l-64.57048,6.14153A66.62573,66.62573,0,1,0,214.73855,132.44774Z" transform="translate(-2.00187 0.84609)"></path> <path class="CDEK-widget__delivery_courier" d="M496.86108,236.73808l-6.42465-92.34484a21.71437,21.71437,0,0,0-21.3579-19.88784l-123.44178.21506A19.38181,19.38181,0,0,0,326.194,145.60194l6.42465,92.34484a21.70638,21.70638,0,0,0,21.32113,19.88785l123.47854-.21507A19.37986,19.37986,0,0,0,496.86108,236.73808ZM353.93843,251.02748h0Z" transform="translate(-2.00187 0.84609)"></path></g> <path class="CDEK-widget__delivery_pvz" d="M515.78535,336.442L609.556,529.07327c3.81317,7.83436-.195,14.2438-8.90811,14.2438H12.35346c-8.713,0-12.72227-6.40938-8.90808-14.2438L97.217,336.442a10.86137,10.86137,0,0,1,8.90808-5.57153h80.40459a11.25693,11.25693,0,0,1,7.44629,3.4251c5.4551,6.30391,11.0117,12.46254,16.55239,18.55849,5.26205,5.78647,10.552,11.64856,15.80011,17.648H130.908a10.85641,10.85641,0,0,0-8.90808,5.57153L59.88013,503.68647H553.11832L491.00357,376.07364a10.85667,10.85667,0,0,0-8.90908-5.57153H386.458c5.24714-5.99941,10.539-11.86153,15.80109-17.648,5.55759-6.11387,11.14506-12.26057,16.6131-18.56645a11.2442,11.2442,0,0,1,7.43335-3.41714h80.57375A10.85489,10.85489,0,0,1,515.78535,336.442ZM444.3625,204.79909c0,105.257-87.626,124.9977-128.83681,226.15a9.851,9.851,0,0,1-18.26991-.03981c-37.17572-91.20135-112.08538-116.211-126.41772-197.45847C156.72663,153.46615,212.10559,75.11644,292.96492,67.47312A137.99029,137.99029,0,0,1,444.3625,204.79909Zm-65.106,0a72.8568,72.8568,0,1,0-72.8568,72.8568A72.85625,72.85625,0,0,0,379.25652,204.79909Z" transform="translate(-2.00187 0.84609)"></path> <path class="CDEK-widget__delivery_box" d="M2.65884,483.52043L2.00192,205.83482a19.01632,19.01632,0,0,1,26.49046-17.53019L281.28291,296.368a19.0146,19.0146,0,0,1,11.541,17.43932l0.65691,277.68561a19.01643,19.01643,0,0,1-26.49046,17.53118L14.19987,500.96076A19.01337,19.01337,0,0,1,2.65884,483.52043ZM581.8529,218.90533l-233.27959,101.03,0.607,256.98364L582.46091,475.889l-0.608-256.98365m9.4395-33.50094a19.03627,19.03627,0,0,1,19.04968,18.99079L610.999,482.08078A19.01452,19.01452,0,0,1,599.53983,499.575L347.26446,608.83345a18.97537,18.97537,0,0,1-26.57333-17.40334L320.03422,313.7435a19.01226,19.01226,0,0,1,11.46017-17.49426L583.76973,186.99181a18.96546,18.96546,0,0,1,7.52267-1.58742h0ZM304.6555,28.99646L62.66821,137.04388l242.49546,106.8993L547.15193,135.89676,304.6555,28.99646M304.58661-.42119a19.0199,19.0199,0,0,1,7.71532,1.61535L578.26779,118.44046c15.0872,6.65207,15.13814,28.04191.08184,34.76386L312.94086,271.70855a19.01736,19.01736,0,0,1-15.42366.03693L31.55236,154.4992c-15.0882-6.65107-15.13812-28.04191-.08286-34.76386L296.87727,1.2311a19.00856,19.00856,0,0,1,7.70934-1.65228h0Z" transform="translate(-2.00187 0.84609)"></path> <g><path class="CDEK-widget__delivery_post" d="M583.48644,1.00006H333.42136V278.85179H611.27187V28.78547A27.78592,27.78592,0,0,0,583.48644,1.00006ZM440.37361,85.39856a23.15306,23.15306,0,1,1,18.19131,27.22786A23.15377,23.15377,0,0,1,440.37361,85.39856Zm87.54323,119.35919H398.25316V149.18813H527.91684v55.56962Z" transform="translate(-0.00001 -1.00006)"></path> <path class="CDEK-widget__delivery_post" d="M55.56963,334.42141H0V584.48774a27.78565,27.78565,0,0,0,27.78541,27.78418h250.0663V334.42141H55.56963ZM125.4755,400.2955a23.15306,23.15306,0,1,1,18.19131,27.22786A23.15373,23.15373,0,0,1,125.4755,400.2955ZM213.0187,519.6547H83.355V464.08509H213.01871V519.6547h0Z" transform="translate(-0.00001 -1.00006)"></path> <path class="CDEK-widget__delivery_post" d="M27.78542,1.00006A27.7859,27.7859,0,0,0,0,28.78547v250.0663H277.85174V1.00006H27.78542Zm97.69008,84.3985a23.15306,23.15306,0,1,1,18.19131,27.22786A23.15376,23.15376,0,0,1,125.4755,85.39856Zm87.5432,119.35919H83.355V149.18813H213.01871v55.56962h0Z" transform="translate(-0.00001 -1.00006)"></path> <path class="CDEK-widget__delivery_post" d="M583.48644,334.42141H333.42136V612.27192H583.48768a27.78567,27.78567,0,0,0,27.78418-27.78542V334.42141H583.48644ZM440.37361,400.2955a23.15307,23.15307,0,1,1,18.19131,27.22786A23.15375,23.15375,0,0,1,440.37361,400.2955ZM527.91684,519.6547H398.25316V464.08509H527.91684V519.6547Z" transform="translate(-0.00001 -1.00006)"></path></g></svg></button></div><div class="CDEK-widget__delivery-type"><div class="CDEK-widget__delivery-type__box" id="oDcfl_cdek_delivery_types"><div class="CDEK-widget__delivery-type__title" id="oDcfl_cdek_delivery_type_title"><span class="CDEK_no-avail">\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445 \u0441\u043F\u043E\u0441\u043E\u0431\u043E\u0432 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</span><span class="CDEK_choose" style="${ssrRenderStyle({ "display": "none" })}">\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u043F\u043E\u0441\u043E\u0431 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</span></div><div style="${ssrRenderStyle({ "text-align": "center", "padding-bottom": "10px", "display": "none" })}" id="oDcfl_cdek_delivery_type_none"><span>\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0440\u0443\u0433\u043E\u0439 \u043D\u0430\u0441\u0435\u043B\u0435\u043D\u043D\u044B\u0439 \u043F\u0443\u043D\u043A\u0442</span></div></div></div><div class="CDEK-widget__courier-address"><div class="CDEK-widget__courier-address__box CDEK-widget__courier-address__box_close" id="oDcfl_cdek_courier_address"><div class="CDEK-widget__courier-address__title" id="oDcfl_cdek_courier_address_title"><span>\u0423\u0442\u043E\u0447\u043D\u0438\u0442\u0435 \u0430\u0434\u0440\u0435\u0441</span></div><div class="CDEK-widget__courier-address__item" data-delivery-address="address"><input type="text" placeholder="\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438" id="oDcfl_cdek_courier_address_place"> <button class="CDEK-widget__courier-address__button">OK</button></div></div></div><div class="CDEK-widget__search-list"><div class="CDEK-widget__search-list__box"><ul id="oDcfl_city_list"><li class="no-active" data-cityid="17"><p class="CDEK-widget__search-list__city-name">\u041F\u0443\u0448\u043A\u0438\u043D\u043E</p><p class="CDEK-widget__search-list__city-details">\u041C\u043E\u0441\u043A\u043E\u0432\u0441\u043A\u0430\u044F \u043E\u0431\u043B\u0430\u0441\u0442\u044C, \u0420\u043E\u0441\u0441\u0438\u044F</p></li><li class="no-active" data-cityid="13"><p class="CDEK-widget__search-list__city-name">\u0411\u0435\u043B\u043E\u0440\u0435\u0447\u0435\u043D\u0441\u043A</p><p class="CDEK-widget__search-list__city-details">\u041A\u0440\u0430\u0441\u043D\u043E\u0434\u0430\u0440\u0441\u043A\u0438\u0439 \u043A\u0440\u0430\u0439, \u0420\u043E\u0441\u0441\u0438\u044F</p></li><li class="no-active" data-cityid="12"><p class="CDEK-widget__search-list__city-name">\u041D\u043E\u0432\u044B\u0439 \u0423\u0440\u0435\u043D\u0433\u043E\u0439</p><p class="CDEK-widget__search-list__city-details">\u042F\u043C\u0430\u043B\u043E-\u041D\u0435\u043D\u0435\u0446\u043A\u0438\u0439 \u0430\u0432\u0442\u043E\u043D\u043E\u043C\u043D\u044B\u0439 \u043E\u043A\u0440\u0443\u0433, \u0420\u043E\u0441\u0441\u0438\u044F</p></li><li class="no-active" data-cityid="11"><p class="CDEK-widget__search-list__city-name">\u041D\u043E\u0432\u043E\u0442\u0440\u043E\u0438\u0446\u043A</p><p class="CDEK-widget__search-list__city-details">\u041E\u0440\u0435\u043D\u0431\u0443\u0440\u0433\u0441\u043A\u0430\u044F \u043E\u0431\u043B\u0430\u0441\u0442\u044C, \u0420\u043E\u0441\u0441\u0438\u044F</p></li><li class="no-active" data-cityid="7"><p class="CDEK-widget__search-list__city-name">\u041C\u0438\u0430\u0441\u0441</p><p class="CDEK-widget__search-list__city-details">\u0427\u0435\u043B\u044F\u0431\u0438\u043D\u0441\u043A\u0430\u044F \u043E\u0431\u043B\u0430\u0441\u0442\u044C, \u0420\u043E\u0441\u0441\u0438\u044F</p></li><li class="no-active" data-cityid="6"><p class="CDEK-widget__search-list__city-name">\u0410\u043B\u0442\u0430\u0439\u0441\u043A\u043E\u0435</p><p class="CDEK-widget__search-list__city-details">\u0410\u043B\u0442\u0430\u0439\u0441\u043A\u0438\u0439 \u043A\u0440\u0430\u0439, \u0420\u043E\u0441\u0441\u0438\u044F</p></li><li class="no-active" data-cityid="5"><p class="CDEK-widget__search-list__city-name">\u0423\u0441\u0438\u043D\u0441\u043A</p><p class="CDEK-widget__search-list__city-details">\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u043E\u043C\u0438, \u0420\u043E\u0441\u0441\u0438\u044F</p></li></ul></div></div></div><div class="CDEK-widget__sidebar CDEK-widget__inaccessible" id="oDcfl_sidebar"><div class="CDEK-widget__sidebar-burger CDEK-widget__sidebar-button" data-hint="#list"><span></span><span></span><span></span></div><hr><div class="CDEK-widget__sidebar-button CDEK-widget__sidebar-button_phone" data-hint="#contacts"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 444.41148 446.40002"><path class="phone" d="M374.456,293.506c-9.7-10.1-21.4-15.5-33.8-15.5-12.3,0-24.1,5.3-34.2,15.4l-31.6,31.5c-2.6-1.4-5.2-2.7-7.7-4-3.6-1.8-7-3.5-9.9-5.3-29.6-18.8-56.5-43.3-82.3-75-12.5-15.8-20.9-29.1-27-42.6,8.2-7.5,15.8-15.3,23.2-22.8,2.8-2.8,5.6-5.7,8.4-8.5,21-21,21-48.2,0-69.2l-27.3-27.3c-3.1-3.1-6.3-6.3-9.3-9.5-6-6.2-12.3-12.6-18.8-18.6-9.7-9.6-21.3-14.7-33.5-14.7s-24,5.1-34,14.7l-0.2.2-34,34.3a73.16053,73.16053,0,0,0-21.7,46.5c-2.4,29.2,6.2,56.4,12.8,74.2,16.2,43.7,40.4,84.2,76.5,127.6,43.8,52.3,96.5,93.6,156.7,122.7,23,10.9,53.7,23.8,88,26,2.1,0.1,4.3.2,6.3,0.2,23.1,0,42.5-8.3,57.7-24.8,0.1-.2.3-0.3,0.4-0.5,5.2-6.3,11.2-12,17.5-18.1,4.3-4.1,8.7-8.4,13-12.9,9.9-10.3,15.1-22.3,15.1-34.6,0-12.4-5.3-24.3-15.4-34.3Zm35.8,105.3c-0.1,0-.1.1,0,0-3.9,4.2-7.9,8-12.2,12.2a262.94685,262.94685,0,0,0-19.3,20c-10.1,10.8-22,15.9-37.6,15.9-1.5,0-3.1,0-4.6-.1-29.7-1.9-57.3-13.5-78-23.4-56.6-27.4-106.3-66.3-147.6-115.6-34.1-41.1-56.9-79.1-72-119.9-9.3-24.9-12.7-44.3-11.2-62.6a45.90488,45.90488,0,0,1,13.8-29.7l34.1-34.1c4.9-4.6,10.1-7.1,15.2-7.1,6.3,0,11.4,3.8,14.6,7l0.3,0.3c6.1,5.7,11.9,11.6,18,17.9,3.1,3.2,6.3,6.4,9.5,9.7l27.3,27.3c10.6,10.6,10.6,20.4,0,31-2.9,2.9-5.7,5.8-8.6,8.6-8.4,8.6-16.4,16.6-25.1,24.4a2.35721,2.35721,0,0,0-.5.5c-8.6,8.6-7,17-5.2,22.7l0.3,0.9c7.1,17.2,17.1,33.4,32.3,52.7l0.1,0.1c27.6,34,56.7,60.5,88.8,80.8a136.53623,136.53623,0,0,0,12.3,6.7c3.6,1.8,7,3.5,9.9,5.3,0.4,0.2.8,0.5,1.2,0.7a21.67755,21.67755,0,0,0,9.9,2.5c8.3,0,13.5-5.2,15.2-6.9l34.2-34.2c3.4-3.4,8.8-7.5,15.1-7.5,6.2,0,11.3,3.9,14.4,7.3l0.2,0.2,55.1,55.1C420.456,377.706,420.456,388.206,410.256,398.806Z" transform="translate(-0.34447 -27.40598)"></path></svg></div></div><div class="CDEK-widget__panel" id="oDcfl_panel"><div class="CDEK-widget__panel-list" id="oDcfl_pointlist"></div> <div class="CDEK-widget__panel-details" id="oDcfl_detail_panel"></div> <div class="CDEK-widget__panel-contacts"><div class="CDEK-widget__panel-headline"><span>\u0421\u043B\u0443\u0436\u0431\u0430 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438</span></div> <div class="CDEK-widget__panel-content"><p>\u0415\u0441\u043B\u0438 \u0443 \u0432\u0430\u0441 \u0435\u0441\u0442\u044C \u0432\u043E\u043F\u0440\u043E\u0441\u044B, \u043C\u043E\u0436\u0435\u0442\u0435<br> \u0437\u0430\u0434\u0430\u0442\u044C \u0438\u0445 \u043D\u0430\u0448\u0438\u043C \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442\u0430\u043C</p> <p><a href="tel:88002501405" class="CDEK-widget__phone"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 444.41148 446.40002"><path class="path" d="M374.456,293.506c-9.7-10.1-21.4-15.5-33.8-15.5-12.3,0-24.1,5.3-34.2,15.4l-31.6,31.5c-2.6-1.4-5.2-2.7-7.7-4-3.6-1.8-7-3.5-9.9-5.3-29.6-18.8-56.5-43.3-82.3-75-12.5-15.8-20.9-29.1-27-42.6,8.2-7.5,15.8-15.3,23.2-22.8,2.8-2.8,5.6-5.7,8.4-8.5,21-21,21-48.2,0-69.2l-27.3-27.3c-3.1-3.1-6.3-6.3-9.3-9.5-6-6.2-12.3-12.6-18.8-18.6-9.7-9.6-21.3-14.7-33.5-14.7s-24,5.1-34,14.7l-0.2.2-34,34.3a73.16053,73.16053,0,0,0-21.7,46.5c-2.4,29.2,6.2,56.4,12.8,74.2,16.2,43.7,40.4,84.2,76.5,127.6,43.8,52.3,96.5,93.6,156.7,122.7,23,10.9,53.7,23.8,88,26,2.1,0.1,4.3.2,6.3,0.2,23.1,0,42.5-8.3,57.7-24.8,0.1-.2.3-0.3,0.4-0.5,5.2-6.3,11.2-12,17.5-18.1,4.3-4.1,8.7-8.4,13-12.9,9.9-10.3,15.1-22.3,15.1-34.6,0-12.4-5.3-24.3-15.4-34.3Zm35.8,105.3c-0.1,0-.1.1,0,0-3.9,4.2-7.9,8-12.2,12.2a262.94685,262.94685,0,0,0-19.3,20c-10.1,10.8-22,15.9-37.6,15.9-1.5,0-3.1,0-4.6-.1-29.7-1.9-57.3-13.5-78-23.4-56.6-27.4-106.3-66.3-147.6-115.6-34.1-41.1-56.9-79.1-72-119.9-9.3-24.9-12.7-44.3-11.2-62.6a45.90488,45.90488,0,0,1,13.8-29.7l34.1-34.1c4.9-4.6,10.1-7.1,15.2-7.1,6.3,0,11.4,3.8,14.6,7l0.3,0.3c6.1,5.7,11.9,11.6,18,17.9,3.1,3.2,6.3,6.4,9.5,9.7l27.3,27.3c10.6,10.6,10.6,20.4,0,31-2.9,2.9-5.7,5.8-8.6,8.6-8.4,8.6-16.4,16.6-25.1,24.4a2.35721,2.35721,0,0,0-.5.5c-8.6,8.6-7,17-5.2,22.7l0.3,0.9c7.1,17.2,17.1,33.4,32.3,52.7l0.1,0.1c27.6,34,56.7,60.5,88.8,80.8a136.53623,136.53623,0,0,0,12.3,6.7c3.6,1.8,7,3.5,9.9,5.3,0.4,0.2.8,0.5,1.2,0.7a21.67755,21.67755,0,0,0,9.9,2.5c8.3,0,13.5-5.2,15.2-6.9l34.2-34.2c3.4-3.4,8.8-7.5,15.1-7.5,6.2,0,11.3,3.9,14.4,7.3l0.2,0.2,55.1,55.1C420.456,377.706,420.456,388.206,410.256,398.806Z" transform="translate(-0.34447 -27.40598)"></path></svg> 8 800 250-14-05 </a></p> <p class="CDEK-widget__panel-content-mail"><a href="mailto:sale@cdek.ru" target="_blank" class="CDEK-widget__mail"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 44.676"><path class="path" d="M58,10.324H6a6.006,6.006,0,0,0-6,6V49a6.006,6.006,0,0,0,6,6H58a6.006,6.006,0,0,0,6-6V16.324A6.00668,6.00668,0,0,0,58,10.324Zm-0.982,4L32,32.367,6.982,14.324H57.018ZM58,51H6a2.00073,2.00073,0,0,1-2-2V17.107l26.83,19.35a2.004,2.004,0,0,0,2.34,0L60,17.107V49A2.00073,2.00073,0,0,1,58,51Z" transform="translate(0 -10.32397)"></path></svg> <span>sale@cdek.ru</span></a></p></div> <div class="CDEK-widget__developer"> \u0420\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u043E \u0432 <a href="https://ipolh.com/" target="_blank" class="IPOL-logo"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 351.414 45.4688"><defs><clipPath id="IPOL-logo__clip-a" transform="translate(-220.293 -283.2656)"><path class="IPOL-logo__path-a" d="M383.41109,285.4717a17.92737,17.92737,0,0,0-6.0595-2.0029,18.14886,18.14886,0,0,0-2.5938-.2081h-45.4736a18.14886,18.14886,0,0,0-2.5938.2081,17.96788,17.96788,0,0,0-15.4482,17.8339l-0.001,27.4366h9.3897s0.0009-26.3389.0009-27.4366a8.65226,8.65226,0,0,1,8.6534-8.6523h45.4716a8.6529,8.6529,0,0,1,8.6534,8.6523v27.4092h4.3105c0.1279,0.0108.2549,0.0274,0.3848,0.0274,0.1162,0,.2246-0.0205.3379-0.0274h4.3574s-0.001-26.9131-.001-27.4092A18.03477,18.03477,0,0,0,383.41109,285.4717Z"></path></clipPath> <linearGradient id="IPOL-logo__gradient-b" y1="22.7344" x2="351.414" y2="22.7344" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ac3994"></stop> <stop offset="1" stop-color="#11b9e7"></stop></linearGradient> <clipPath id="IPOL-logo__clip-c" transform="translate(-220.293 -283.2656)"><path class="IPOL-logo__path-a" d="M474.36129,285.4717h-0.0019a17.9352,17.9352,0,0,0-6.0596-2.0029,18.14537,18.14537,0,0,0-2.59279-.2081H420.23239a18.172,18.172,0,0,0-2.5947.2081,17.96887,17.96887,0,0,0-15.4463,17.8339v9.3907a18.19439,18.19439,0,0,0,18.041,18.0459H465.707a18.1599,18.1599,0,0,0,2.59279-.208,17.9235,17.9235,0,0,0,6.0596-2.0069h0.0019a18.03575,18.03575,0,0,0,9.38671-15.831v-9.3907A18.03694,18.03694,0,0,0,474.36129,285.4717Zm-0.0019,25.2217a8.65245,8.65245,0,0,1-8.6543,8.6523h-45.4727a8.6526,8.6526,0,0,1-8.6523-8.6523v-9.3907a8.6526,8.6526,0,0,1,8.6523-8.6523h45.4727a8.65245,8.65245,0,0,1,8.6543,8.6523v9.3907Z"></path></clipPath> <clipPath id="IPOL-logo__clip-e" transform="translate(-220.293 -283.2656)"><path class="IPOL-logo__path-a" d="M518.42679,283.2607a18.18435,18.18435,0,0,0-17.0264,12.0674l-0.2832.8389-10.9688,32.5723h9.9063l10.3398-30.7002c0.0147-.0381.02351-0.0791,0.0391-0.1162a8.68575,8.68575,0,0,1,7.9932-5.2725h43.8906v36.0889H571.707V283.2607H518.42679Z"></path></clipPath> <clipPath id="IPOL-logo__clip-g" transform="translate(-220.293 -283.2656)"><path class="IPOL-logo__path-a" d="M292.46289,319.3457h-54.126a8.65217,8.65217,0,0,1-8.6533-8.6523c0-.1739-0.0029-0.9844-0.0078-2.2198h0.0068V283.2705h-0.1045s-2.0498-.0039-4.582-0.0098h-0.0166c-2.5303.0059-4.6514,0.0098-4.6514,0.0098H220.293v25.2031h0.00389c-0.002,1.2266-.003,2.0342-0.003,2.2198a18.19664,18.19664,0,0,0,18.042,18.0459h63.5166V283.2607h-9.3896v36.085Z"></path></clipPath> <linearGradient id="IPOL-logo__gradient-h" x1="0.00049" y1="22.7344" x2="351.414" y2="22.7344" xlink:href="#IPOL-logo__gradient-b"></linearGradient></defs> <g class="IPOL-logo__group-b" style="${ssrRenderStyle({ "clip-path": "url(#IPOL-logo__clip-a)" })}"><rect class="IPOL-logo__rect-c" width="351.414" height="45.4688"></rect></g> <g class="IPOL-logo__group-d" style="${ssrRenderStyle({ "clip-path": "url(#IPOL-logo__clip-c)" })}"><rect class="IPOL-logo__rect-c" width="351.414" height="45.4688"></rect></g> <g class="IPOL-logo__group-e" style="${ssrRenderStyle({ "clip-path": "url(#IPOL-logo__clip-e)" })}"><rect class="IPOL-logo__rect-c" width="351.414" height="45.4688"></rect></g> <g class="IPOL-logo__group-f" style="${ssrRenderStyle({ "clip-path": "url(#IPOL-logo__clip-g)" })}"><rect class="IPOL-logo__rect-g" x="0.00049" width="351.41351" height="45.4688"></rect></g></svg></a></div></div></div><a href="https://www.cdek.ru/" target="_blank" class="CDEK-widget__logo CDEK-widget__inaccessible"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 212.68346 47.2252"><defs><linearGradient id="CDEK-widget__logo-gradient" data-name="\u0411\u0435\u0437\u044B\u043C\u044F\u043D\u043D\u044B\u0439 \u0433\u0440\u0430\u0434\u0438\u0435\u043D\u0442" x1="10717.5556" y1="-10111.60892" x2="12379.5556" y2="-10111.60892" gradientTransform="matrix(0.02835, 0, 0, -0.02835, -299.26929, -256.66611)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"></stop> <stop offset="1" stop-color="#00732c"></stop></linearGradient></defs><g><g><g><rect class="CDEK-widget__logo-a" x="57.65669" y="1.98425" width="42.26457" height="43.34173"></rect><path class="CDEK-widget__logo-b" d="M89.65984,18.79367H85.20945c-8.92913,0-16.55433,22.36535-6.0378,22.36535H85.9748c3.88346,0,6.7748,1.41732,5.49921,5.21575l-1.78583,5.27244h-7.2l-5.811-.05669c-7.42677-.085-12.24567-3.74173-13.9748-9.26929-1.84252-5.9811.7937-18.53858,8.44724-26.53228C75.6,11.16847,81.75118,8.36218,89.74488,8.36218h14.59843l-2.26772,6.51969c-1.53071,4.22362-4.53543,3.91181-6.26457,3.91181H89.65984Z" transform="translate(-4.47874 -6.34958)"></path></g> <g><g><rect class="CDEK-widget__logo-a" x="133.73858" y="18.3685" width="32.17323" height="10.57323"></rect> <path class="CDEK-widget__logo-b" d="M170.33386,24.74643H146.74961c-3.88346,0-5.64094,1.02047-6.32126,3.31654l-2.211,7.2h23.55591c3.85512,0,5.64094-1.07717,6.32126-3.37323Z" transform="translate(-4.47874 -6.34958)"></path></g><g><rect class="CDEK-widget__logo-a" x="127.98425" y="1.98425" width="43.39843" height="43.34173"></rect> <path class="CDEK-widget__logo-b" d="M164.60787,41.159H141.02362c-3.88346,0-5.64094,1.07717-6.32126,3.31654l-2.211,7.17165H156.0189c3.88346,0,5.66929-1.07717,6.34961-3.31654Zm0,0h0ZM175.80472,8.36218H152.27716c-3.91181,0-5.69764,1.02047-6.378,3.28819l-2.211,7.14331h23.55591c3.91181,0,5.66929-1.07717,6.378-3.31654Z" transform="translate(-4.47874 -6.34958)"></path></g></g> <g><rect class="CDEK-widget__logo-a" x="89.85827" y="1.98425" width="43.93701" height="43.34173"></rect><path class="CDEK-widget__logo-b" d="M116.674,18.737h5.86772c4.96063,0,3.82677,6.26457,1.27559,12.3874-2.18268,5.35748-6.15118,10.03465-10.885,10.03465H103.1811c-3.88346,0-5.69764,1.07717-6.463,3.31654L94.337,51.64721h7.17165l6.97323-.05669c6.20787-.085,11.33858-0.51024,17.23465-5.86772,6.29291-5.64094,13.63465-20.32441,12.3874-28.77165-0.99213-6.66142-4.59213-8.589-13.20945-8.589H109.07716L99.94961,35.20627h5.811c3.45827,0,5.21575.05669,7.02992-4.90394Z" transform="translate(-4.47874 -6.34958)"></path></g> <g><rect class="CDEK-widget__logo-a" x="161.88661" y="1.95591" width="50.79685" height="43.37008"></rect><path class="CDEK-widget__logo-b" d="M166.36535,51.64721h11.08346l4.79055-13.63465L187.2,33.84564l3.88346,12.33071c1.24724,3.79843,2.49449,5.47087,5.21575,5.47087h8.47559L196.04409,27.411,217.10551,8.30548h-13.6063l-12.86929,13.578c-1.44567,1.61575-2.948,3.14646-4.50709,5.04567H185.9811l6.463-18.62362h-11.1685Z" transform="translate(-4.47874 -6.34958)"></path></g></g> <g><g><rect class="CDEK-widget__logo-a" width="47.2252" height="47.2252"></rect> <path class="CDEK-widget__logo-c" d="M22.22362,7.11493L24.57638,6.633l2.35276-.22677h2.35276L31.578,6.633l2.23937,0.45354L36,7.7669l2.09764,0.85039,2.0126,1.07717,1.89921,1.2189,1.75748,1.41732,1.61575,1.5874,1.474,1.75748,1.30394,1.89921,1.13386,2.04094,0.90709,2.18268,0.70866,2.29606,0.48189,2.35276,0.25512,2.3811v2.32441l-0.25512,2.29606-0.45354,2.26772-0.652,2.15433-0.85039,2.126-1.07717,1.98425-1.24724,1.89921-1.41732,1.75748-1.5874,1.64409-1.75748,1.474-1.89921,1.30394-2.04094,1.10551-2.18268.93543-2.29606.70866-2.35276.48189-2.35276.22677H26.90079l-2.29606-.22677L22.337,52.83777l-2.18268-.68031-2.09764-.85039-1.98425-1.07717-1.89921-1.24724L12.3874,47.56532l-1.61575-1.5874-1.474-1.72913L7.9937,42.32123,6.85984,40.28029,5.95276,38.126l-0.737-2.29606L4.7622,33.44879,4.53543,31.096V28.77162L4.7622,26.47556l0.45354-2.23937,0.68031-2.18268,0.85039-2.09764,1.04882-2.0126,1.24724-1.89921,1.41732-1.75748,1.5874-1.64409,1.75748-1.474,1.89921-1.30394,2.04094-1.13386,2.18268-.90709Z" transform="translate(-4.47874 -6.34958)"></path></g><g><rect class="CDEK-widget__logo-a" x="9.26929" y="14.14488" width="36.17008" height="26.70236"></rect> <path class="CDEK-widget__logo-d" d="M17.40472,21.82674A46.83559,46.83559,0,0,0,27.18425,23.074c5.726,0.22677,11.99055.05669,19.53071,0h2.60787c0.62362,0,.7937.68031,0.11339,0.90709l-2.29606.652C32.99528,28.885,22.252,34.15745,14.51339,46.885c-0.31181.51024-.7937,0.25512-0.737-0.3685,0.822-5.89606,1.67244-10.77165,4.337-16.15748-1.53071-2.211-1.10551-4.62047-2.69291-8.13543-0.17008-.39685-0.3685-0.737-0.45354-0.99213-0.19843-.62362.14173-0.822,0.62362-0.652C16.7811,21.08973,15.93071,21.51493,17.40472,21.82674Z" transform="translate(-4.47874 -6.34958)"></path></g><g><rect class="CDEK-widget__logo-a" x="8.16378" y="14.0315" width="31.63465" height="23.83937"></rect> <path class="CDEK-widget__logo-e" d="M17.348,21.7984a51.83,51.83,0,0,0,9.77953,1.24724c5.13071,0.17008,10.68661.05669,17.12126,0-12.64252,4.05354-22.8189,9.89291-30.189,21.14646a45.40689,45.40689,0,0,1,4.05354-13.86142c-0.3685-.51024-0.737-1.02047-1.10551-1.5874,0.085-.17008.17008-0.39685,0.25512-0.56693a46.864,46.864,0,0,1-4.62047-7.48346c0-.31181.31181-0.34016,0.652-0.25512A20.61427,20.61427,0,0,0,17.348,21.7984Z" transform="translate(-4.47874 -6.34958)"></path></g><g><rect class="CDEK-widget__logo-a" x="5.86772" y="9.89291" width="37.27559" height="27.72283"></rect> <path class="CDEK-widget__logo-d" d="M15.052,17.68816a56.892,56.892,0,0,0,9.80787,1.24724c5.726,0.17008,11.9622,0,19.50236,0h2.63622c0.652,0,.822.68031,0.14173,0.85039l-2.32441.70866c-14.11654,4.252-25.285,10.34646-33.02362,23.10236-0.34016.51024-.87874,0.4252-0.737-0.17008,0.99213-5.83937,2.06929-11.84882,4.79055-17.14961A44.09769,44.09769,0,0,1,10.8,17.94328c-0.17008-.4252-0.31181-0.68031-0.39685-0.93543-0.17008-.652.22677-0.90709,0.737-0.652A25.08521,25.08521,0,0,0,15.052,17.68816Z" transform="translate(-4.47874 -6.34958)"></path></g></g></g></svg></a><div class="CDEK-widget__photo"><div class="CDEK-widget__photo-block"><div class="CDEK-widget__photo-block__cross"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.6435 15.64375"><path class="cross" d="M8.882,7.821L15.423,1.28A0.75024,0.75024,0,1,0,14.362.219L7.821,6.76,1.28,0.22A0.75024,0.75024,0,0,0,.219,1.281L6.76,7.822l-6.54,6.54a0.74989,0.74989,0,1,0,1.06,1.061L7.821,8.882l6.541,6.541a0.74989,0.74989,0,1,0,1.06-1.061Z" transform="translate(0.00075 0.00078)"></path></svg></div><img src="#"></div></div> <div class="CDEK-widget__sidebar-button__hint" id="list">\u0421\u043F\u0438\u0441\u043E\u043A \u043F\u0443\u043D\u043A\u0442\u043E\u0432 \u0432\u044B\u0434\u0430\u0447\u0438 \u0437\u0430\u043A\u0430\u0437\u043E\u0432</div> <div class="CDEK-widget__sidebar-button__hint" id="delivery">\u0421\u043F\u043E\u0441\u043E\u0431 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</div> <div class="CDEK-widget__sidebar-button__hint" id="point1">\u0420\u0430\u0441\u0447\u0435\u0442 \u043A\u0430\u0440\u0442\u043E\u0439</div> <div class="CDEK-widget__sidebar-button__hint" id="point2">\u041F\u043E\u0441\u0442\u0430\u043C\u0430\u0442\u044B \u0421\u0414\u042D\u041A</div> <div class="CDEK-widget__sidebar-button__hint" id="point3">\u0421 \u043F\u0440\u0438\u043C\u0435\u0440\u043A\u043E\u0439</div> <div class="CDEK-widget__sidebar-button__hint" id="contacts">\u0421\u043B\u0443\u0436\u0431\u0430 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438</div> <div id="oDcfl_SDEK_closer" class="SDEK_closer"></div></div></div></div></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/SDEKcart.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const SDEKcart = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$2 = {
  components: { SDEKcart },
  el: "#check_form",
  data() {
    return {
      USER_STATE: this.$store.getUser,
      delivery_info: null
    };
  },
  methods: {
    order_info_select() {
      if (this.delivery_info == null) {
        return {
          status: false
        };
      } else {
        return {
          status: true
        };
      }
    },
    async onChoise(info) {
      console.log(info);
      this.delivery_info = await info;
      this.$emit("delivery", this.delivery_info.price);
    }
  },
  setup() {
    const state = reactive({
      adress: {
        value: ""
      },
      index: {
        value: ""
      }
    });
    const rules = {
      adress: {
        value: {
          required: helpers.withMessage("\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F", required)
        }
      },
      index: {
        value: {
          required: helpers.withMessage("\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F", required)
        }
      }
    };
    const v$ = useVuelidate(rules, state);
    return { state, v$ };
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_SDEKcart = resolveComponent("SDEKcart");
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "check_form" }, _attrs))} data-v-0433fbb5><p class="VAG" align="left" data-v-0433fbb5>\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430</p><div class="h_sto" data-v-0433fbb5>`);
  if ($data.delivery_info) {
    _push(`<div data-v-0433fbb5><div class="relative" data-v-0433fbb5><input type="text" disabled${ssrRenderAttr("value", $data.delivery_info.price)} data-v-0433fbb5><span class="floating-label active" data-v-0433fbb5>\u0426\u0435\u043D\u0430</span></div><div class="relative" data-v-0433fbb5><input type="text" disabled${ssrRenderAttr("value", $data.delivery_info.id)} data-v-0433fbb5><span class="floating-label active" data-v-0433fbb5>\u041D\u043E\u043C\u0435\u0440 \u043F\u043E\u0441\u0442\u043C\u0430\u0442\u0430</span></div><div class="relative" data-v-0433fbb5><input type="text" disabled${ssrRenderAttr("value", $data.delivery_info.PVZ.Address)} data-v-0433fbb5><span class="floating-label active" data-v-0433fbb5>\u0410\u0434\u0440\u0435\u0441</span></div><div class="relative" data-v-0433fbb5><input type="text" disabled${ssrRenderAttr("value", $data.delivery_info.term)} data-v-0433fbb5><span class="floating-label active" data-v-0433fbb5>\u041F\u0440\u0438\u043C\u0435\u0440\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</span></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
  _push(ssrRenderComponent(_component_SDEKcart, {
    onOnChoise: ($event) => $options.onChoise($event)
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/Checkout.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const Checkout = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-0433fbb5"]]);
async function createOrderPayment(payment_data) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/payments/create/`,
      method: "post",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      },
      data: {
        ...payment_data
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
async function addOrder(delivery_price) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/order/create`,
      method: "post",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      },
      data: {
        delivery_price
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
async function createDeliveryLait(order_id) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/delivery/create/lait`,
      method: "post",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      },
      data: {
        order_id
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
const _sfc_main$1 = {
  el: "#sub_order",
  props: ["items", "forms_validate", "delivery_price"],
  data() {
    return {
      order_create: null
    };
  },
  methods: {
    async submin_order() {
      await this.$emit("forms_validate_met");
      if (this.forms_validate.status) {
        console.log(213);
        let response_order = await addOrder(this.delivery_price);
        console.log(2132, response_order);
        this.order_create = response_order.data;
        let created_delivery = await this.create_delivery_lait();
        if (created_delivery) {
          await this.create_payment();
        } else {
          alert("\u0421 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u043E\u0439 \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0430, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443");
        }
      }
    },
    async create_payment() {
      let response_payment = await createOrderPayment({
        "payment_service": "yookassa",
        "order_service": "online_shop",
        "order_id": this.order_create.id,
        "currency": "RUB"
      });
      document.location.href = response_payment.data.payment_url;
    },
    async create_delivery_lait() {
      let response_delivery = await createDeliveryLait(this.order_create.id);
      if (response_delivery.status == 200) {
        return true;
      } else {
        return false;
      }
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_RouterLink = resolveComponent("RouterLink");
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: "sub_order",
    class: "w-sto"
  }, _attrs))} data-v-520dfe76>`);
  if ($props.items.length) {
    _push(ssrRenderComponent(_component_RouterLink, { to: "/checkout" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button class="w-sto" data-v-520dfe76${_scopeId}><div class="fon_btn" data-v-520dfe76${_scopeId}></div>\u041E\u043F\u043B\u0430\u0442\u0438\u0442\u044C \u043E\u043D\u043B\u0430\u0439\u043D</button>`);
        } else {
          return [
            createVNode("button", {
              onClick: $options.submin_order,
              class: "w-sto"
            }, [
              createVNode("div", { class: "fon_btn" }),
              createTextVNode("\u041E\u043F\u043B\u0430\u0442\u0438\u0442\u044C \u043E\u043D\u043B\u0430\u0439\u043D")
            ], 8, ["onClick"])
          ];
        }
      }),
      _: 1
    }, _parent));
  } else {
    _push(ssrRenderComponent(_component_RouterLink, { to: "/catalog" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<button class="w-sto" data-v-520dfe76${_scopeId}><div class="fon_btn" data-v-520dfe76${_scopeId}></div> \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u043E\u0432\u0430\u0440</button>`);
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddtionalComp/Submit_order.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Submit_order = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-520dfe76"]]);
const _sfc_main = {
  el: "#checkout",
  components: {
    BasketInfo,
    Checkout,
    ProductListInfo,
    Submit_order,
    OrderProductList
  },
  data() {
    return {
      forms_validate: false,
      delivery_price: 0
    };
  },
  methods: {
    forms_validate_met() {
      this.forms_validate = this.$refs.checkout_form.order_info_select();
    },
    async delivery_price_select(delivery_price) {
      this.delivery_price = await delivery_price;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_client_only = __nuxt_component_0;
  const _component_order_product_list = resolveComponent("order-product-list");
  const _component_Submit_order = resolveComponent("Submit_order");
  const _component_ProductListInfo = resolveComponent("ProductListInfo");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "sot-ob" }, _attrs))} data-v-7127f7b6><div class="wrapper flex" data-v-7127f7b6><div class="user_card flex auto" data-v-7127f7b6><div class="interactiv user_card_div auto" id="checkout" data-v-7127f7b6><div class="w-sto kor" id="kor" data-v-7127f7b6><p class="small-big VAG" data-v-7127f7b6>\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435</p><div class="w-sto flex kor_block jus-sp" data-v-7127f7b6><div class="w-sto-1000px checkout" data-v-7127f7b6>`);
  _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
  _push(`<p align="left" class="VAG small" data-v-7127f7b6>\u0422\u043E\u0432\u0430\u0440\u044B</p>`);
  _push(ssrRenderComponent(_component_order_product_list, {
    orderList: _ctx.$store.getUser.basket
  }, null, _parent));
  _push(`</div><div class="w-sto-1000px register_zakaz" data-v-7127f7b6>`);
  _push(ssrRenderComponent(_component_Submit_order, {
    delivery_price: $data.delivery_price,
    onForms_validate_met: $options.forms_validate_met,
    items: _ctx.$store.getUser.basket,
    forms_validate: $data.forms_validate
  }, null, _parent));
  _push(ssrRenderComponent(_component_ProductListInfo, {
    ordered: true,
    items: _ctx.$store.getUser.basket,
    delivery_price: $data.delivery_price
  }, null, _parent));
  _push(`</div></div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/checkout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const checkout = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-7127f7b6"]]);

export { checkout as default };
//# sourceMappingURL=checkout-2f1968e6.mjs.map
