import axios from 'axios';
import { a as api_root } from './main-cf4969ae.mjs';

async function searchDelivery(params) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/delivery/search?${params}`,
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

export { searchDelivery as s };
//# sourceMappingURL=SearchDelivery-1eaa006e.mjs.map
