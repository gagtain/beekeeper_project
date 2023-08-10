import axios from "axios";
import { api_root } from '@/main'

export default async function getInfoDelivery(id){
    try {
        var response = await axios({url: `${api_root}/api/v0.1/delivery/${id}/get_info_in_order`,
        method: "post",
        headers:{
       //     "Authorization": `Bearer ${useCookie('assess').value}`

        },
        data: {
            "delivery_engine": "sdek",
            "order_engine": "online_store",
            "pred_payment": "yes",
            "tariff_code": 216
        }
      })
      return response
      } catch (error) {
        return error.response
      }
    }