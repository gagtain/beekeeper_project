import axios from 'axios';
import { a as api_root } from './main-e749bd40.mjs';

async function searchCountDelivery(params) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/delivery/search/count?${params}`,
      method: "get",
      headers: {
        //     "Authorization": `Bearer ${useCookie('assess').value}`
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

export { searchCountDelivery as s };
//# sourceMappingURL=SearchCountDelivery-568ac941.mjs.map
