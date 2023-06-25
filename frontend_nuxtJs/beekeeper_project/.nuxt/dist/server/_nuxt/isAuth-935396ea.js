import "vue";
import "hookable";
import { e as useMainStore, u as useCookie, v as verifAssessToken, n as navigateTo } from "../server.mjs";
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
    console.log("Есть токен");
    stores.assess_token = useCookie("assess");
    let assess_response = await verifAssessToken(stores.assess_token);
    if (!(assess_response.status == 200)) {
      if (useCookie("refresh")) {
        console.log("Есть рефреш");
        return;
      } else {
        console.log("Нет рефреша");
        if (event.req.url != "/login") {
          return sendRedirect(event, "/login", 302);
        } else {
          event.context.$assess_token = "123";
        }
      }
    }
  } else {
    console.log("Нет токена");
    if (event.href != "/login") {
      return navigateTo("/login");
    }
  }
};
export {
  isAuth as default
};
//# sourceMappingURL=isAuth-935396ea.js.map
