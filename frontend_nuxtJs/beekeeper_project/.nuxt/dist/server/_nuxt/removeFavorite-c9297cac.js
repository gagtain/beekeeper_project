import "vue";
import "hookable";
import { a as api_root, u as useCookie } from "../server.mjs";
import "devalue";
import "klona";
import axios from "axios";
async function removeBasket(pk, packaging_id, type_weight_id, productItemId) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/basket/${pk}`,
      method: "delete",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      },
      data: {
        id: productItemId,
        type_packaging: packaging_id,
        weight: type_weight_id
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
async function addBasket(pk, packaging_id, type_weight_id) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/basket/${pk}`,
      method: "post",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      },
      data: {
        packaging: packaging_id,
        type_weight: type_weight_id
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
async function addFavorite(pk, packaging_id, type_weight_id) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/favorite/${pk}`,
      method: "post",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      },
      data: {
        packaging: packaging_id,
        type_weight: type_weight_id
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
async function removeFavorite(pk, packaging_id, type_weight_id, favoriteItem_pk) {
  try {
    var response = await axios({
      url: `${api_root}api/v0.1/beekeeper_web_api/favorite/${pk}`,
      method: "delete",
      headers: {
        "Authorization": `Bearer ${useCookie("assess").value}`
      },
      data: {
        pk: favoriteItem_pk,
        type_packaging: packaging_id,
        weight_id: type_weight_id
      }
    });
    return response;
  } catch (error) {
    return error.response;
  }
}
export {
  addBasket as a,
  addFavorite as b,
  removeFavorite as c,
  removeBasket as r
};
//# sourceMappingURL=removeFavorite-c9297cac.js.map
