import axios from "axios";
import getCookie from "./getCookie";
import { api_root } from '@/main'

export default async function addBasket(pk, packaging_id, type_weight_id){
    try {
        var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/basket/${pk}`,
        method: "post",
        headers:{
            "Authorization": `Bearer ${useCookie('assess').value}`

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