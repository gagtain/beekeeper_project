import { a as api_root, u as useCookie } from '../server.mjs';
import axios from 'axios';

async function removeBasket(pk, type_weight_id, productItemId) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/basket/${pk}`,
      method: "delete",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      },
      data: {
        id: productItemId,
        weight: type_weight_id
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
async function addBasket(pk, type_weight_id) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/basket/${pk}`,
      method: "post",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      },
      data: {
        type_weight: type_weight_id
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
async function addFavorite(pk, type_weight_id) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/favorite/${pk}`,
      method: "post",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      },
      data: {
        type_weight: type_weight_id
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
async function removeFavorite(pk, type_weight_id, favoriteItem_pk) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/favorite/${pk}`,
      method: "delete",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      },
      data: {
        pk: favoriteItem_pk,
        weight_id: type_weight_id
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

export { addBasket as a, addFavorite as b, removeFavorite as c, removeBasket as r };
//# sourceMappingURL=removeFavorite-8c059756.mjs.map
