import axios from "axios";
import getCookie from "./getCookie";
import { api_root } from '@/main'


export default async function addFavorite(pk, packaging_id, type_weight_id){
  try {
    var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/favorite/${pk}`,
    method: "post",
    headers:{
        "Authorization": `Bearer ${getCookie('assess')}`

    },
    data:{
      packaging:packaging_id,
      type_weight:type_weight_id
    }
  })
  return response
  } catch (error) {
    return error.response
  }
    }