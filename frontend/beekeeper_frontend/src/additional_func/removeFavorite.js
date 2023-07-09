import axios from "axios";
import getCookie from "./getCookie";
import { api_root } from '@/main'


export default async function removeFavorite(pk, packaging_id, type_weight_id, favoriteItem_pk){
  try {
    var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/favorite/${pk}`,
    method: "delete",
    headers:{
        "Authorization": `Bearer ${getCookie('assess')}`

    },
    data:{
      pk: favoriteItem_pk,
      type_packaging:packaging_id,
      weight_id:type_weight_id
    }
  })
  return response
  } catch (error) {
    return error.response
  }
    }