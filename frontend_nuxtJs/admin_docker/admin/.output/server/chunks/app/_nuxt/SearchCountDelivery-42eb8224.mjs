import axios from 'axios';
import { b as api_root } from '../server.mjs';

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
//# sourceMappingURL=SearchCountDelivery-42eb8224.mjs.map
