import axios from 'axios';
import { b as api_root } from '../server.mjs';

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
//# sourceMappingURL=SearchCountOrders-4d81b291.mjs.map
