import axios from 'axios';
import { a as api_root } from './main-e749bd40.mjs';

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
//# sourceMappingURL=SearchCountOrders-218e6e70.mjs.map
