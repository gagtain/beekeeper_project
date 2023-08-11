import axios from "axios";
import { api_root } from '@/main'

export default async function addOrder(delivery_price){
    try {
        var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/order/create`,
        method: "post",
        headers:{

        },
        withCredentials: true,
        data:{
          delivery_price
        }
      })
      return response
      } catch (error) {
        return error.response
      }
    }