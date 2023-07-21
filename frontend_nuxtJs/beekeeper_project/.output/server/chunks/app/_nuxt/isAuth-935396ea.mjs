import { sendRedirect } from 'h3';
import { e as useMainStore, u as useCookie, v as verifAssessToken, n as navigateTo } from '../server.mjs';
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

const isAuth = async (event) => {
  const stores = useMainStore();
  if (useCookie("assess").value || useCookie("refresh").value) {
    console.log("\u0415\u0441\u0442\u044C \u0442\u043E\u043A\u0435\u043D");
    stores.assess_token = useCookie("assess");
    let assess_response = await verifAssessToken(stores.assess_token);
    if (!(assess_response.status == 200)) {
      if (useCookie("refresh")) {
        console.log("\u0415\u0441\u0442\u044C \u0440\u0435\u0444\u0440\u0435\u0448");
        return;
      } else {
        console.log("\u041D\u0435\u0442 \u0440\u0435\u0444\u0440\u0435\u0448\u0430");
        if (event.req.url != "/login") {
          return sendRedirect(event, "/login", 302);
        } else {
          event.context.$assess_token = "123";
        }
      }
    }
  } else {
    console.log("\u041D\u0435\u0442 \u0442\u043E\u043A\u0435\u043D\u0430");
    if (event.href != "/login") {
      return navigateTo("/login");
    }
  }
};

export { isAuth as default };
//# sourceMappingURL=isAuth-935396ea.mjs.map
