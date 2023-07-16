import "vue";
import "hookable";
import { a as api_root, u as useCookie } from "../server.mjs";
import "devalue";
import "klona";
import axios from "axios";
async function newsList(from, size) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/news/list?from=${from}&size=${size}`,
      method: "get",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
export {
  newsList as n
};
//# sourceMappingURL=newsList-54d7dd14.js.map
