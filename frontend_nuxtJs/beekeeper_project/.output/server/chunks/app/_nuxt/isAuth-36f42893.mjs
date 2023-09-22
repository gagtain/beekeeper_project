import { defineEventHandler } from 'h3';
import { h as useMainStore, i as useCookie, v as verifAssessToken } from '../server.mjs';
import 'vue';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'destr';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'ufo';
import 'cookie-es';
import 'ohash';
import 'axios';
import 'vue/server-renderer';
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

const isAuth = defineEventHandler(
  async (event) => {
    console.log(event);
    const stores = useMainStore();
    console.log(useCookie("assess").value, 2132);
    console.log(useCookie().value);
    if (useCookie("assess").value || useCookie("refresh").value) {
      stores.assess_token = useCookie("assess");
      let assess_response = await verifAssessToken(stores.assess_token);
      if (!(assess_response.status == 200)) {
        if (useCookie("refresh")) {
          console.log("\u0415\u0441\u0442\u044C \u0440\u0435\u0444\u0440\u0435\u0448");
          return;
        } else {
          if (event.href != "/login" && event.href != "/register") {
            return "/login";
          }
        }
      } else {
        console.log(222);
        stores.userSet(assess_response.data);
      }
    } else {
      let assess_response = await verifAssessToken();
      console.log(assess_response.status, 123);
      if (!(assess_response.status == 200)) {
        if (event.href != "/login" && event.href != "/register") {
          return "/login";
        }
      } else {
        console.log(222);
        stores.userSet(assess_response.data);
        return;
      }
    }
  }
);

export { isAuth as default };
//# sourceMappingURL=isAuth-36f42893.mjs.map
