import "vue";
import "hookable";
import { defineEventHandler } from "h3";
import { h as useMainStore, i as useCookie, v as verifAssessToken } from "../server.mjs";
import "devalue";
import "klona";
import "ofetch";
import "#internal/nitro";
import "unctx";
import "@vue/devtools-api";
import "destr";
import "@unhead/ssr";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "ufo";
import "cookie-es";
import "ohash";
import "axios";
import "vue/server-renderer";
import "defu";
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
          console.log("Есть рефреш");
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
export {
  isAuth as default
};
//# sourceMappingURL=isAuth-36f42893.js.map
