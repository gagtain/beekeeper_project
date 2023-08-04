import axios from 'axios';
import { a as api_root } from './main-cf4969ae.mjs';

async function searchCountOrders(params) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/orders/search/count?${params}`,
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

export { searchCountOrders as s };
//# sourceMappingURL=SearchCountOrders-e19df010.mjs.map
