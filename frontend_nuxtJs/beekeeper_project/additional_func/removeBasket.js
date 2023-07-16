import axios from "axios";
import { api_root } from '@/main'


export default async function removeBasket(pk, type_weight_id, productItemId){
    try {
        var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/basket/${pk}`,
        method: "delete",
        headers:{
            "Authorization": `Bearer ${useCookie('assess').value}`

        },
        data:{
          id: productItemId,
          weight:type_weight_id
        }
      })
      return response
      } catch (error) {
        return error.response
      }
    }