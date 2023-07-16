import axios from "axios";
import { api_root } from '@/main'


export default async function removeFavorite(pk, type_weight_id, favoriteItem_pk){
  try {
    var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/favorite/${pk}`,
    method: "delete",
    headers:{
        "Authorization": `Bearer ${useCookie('assess').value}`

    },
    data:{
      pk: favoriteItem_pk,
      weight_id:type_weight_id
    }
  })
  return response
  } catch (error) {
    return error.response
  }
    }