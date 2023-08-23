import axios from "axios";
import { api_root } from '@/main'

export default async function createCheckout(basket_id_list){
    try {
        var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/order/checkout`,
        method: "post",
        headers:{

        },
        withCredentials: true,
        data:{
            basket_id_list
        }
      })
      return response
      } catch (error) {
        return error.response
      }
    }