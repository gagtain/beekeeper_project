import axios from 'axios';
import { a as api_root } from './main-cf4969ae.mjs';

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
//# sourceMappingURL=SearchCountDelivery-62f6eb77.mjs.map
