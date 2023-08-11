import "vue";
import "hookable";
import { h as useMainStore, i as useCookie, v as verifAssessToken, n as navigateTo } from "../server.mjs";
import "devalue";
import "klona";
import "ofetch";
import "#internal/nitro";
import "unctx";
import "@vue/devtools-api";
import "destr";
import "h3";
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
const isAuth = async (event) => {
  const stores = useMainStore();
  if (useCookie("assess").value || useCookie("refresh").value) {
    stores.assess_token = useCookie("assess");
    let assess_response = await verifAssessToken(stores.assess_token);
    if (!(assess_response.status == 200)) {
      if (useCookie("refresh")) {
        console.log("Есть рефреш");
        return;
      } else {
        if (event.href != "/login" && event.href != "/register") {
          return navigateTo("/login");
        }
      }
    } else {
      stores.userSet(assess_response.data);
    }
  } else {
    let assess_response = await verifAssessToken();
    console.log(assess_response.status);
    if (!(assess_response.status == 200)) {
      if (event.href != "/login" && event.href != "/register") {
        return navigateTo("/login");
      }
    } else {
      stores.userSet(assess_response.data);
    }
  }
};
export {
  isAuth as default
};
//# sourceMappingURL=isAuth-9eaf0961.js.map
