import axios from "axios";
import { b as api_root } from "../server.mjs";
async function newsList(from, size) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/news/list?from=${from}&size=${size}`,
      method: "get",
      headers: {},
      withCredentials: true
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
export {
  newsList as n
};
//# sourceMappingURL=newsList-b6c2f51f.js.map