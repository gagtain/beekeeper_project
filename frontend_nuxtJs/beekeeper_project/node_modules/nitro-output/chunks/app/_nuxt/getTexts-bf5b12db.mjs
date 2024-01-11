import axios from 'axios';
import { b as api_root } from '../server.mjs';

async function getTextList() {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/text`,
      method: "get",
      headers: {},
      withCredentials: true
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

export { getTextList as g };
//# sourceMappingURL=getTexts-bf5b12db.mjs.map
