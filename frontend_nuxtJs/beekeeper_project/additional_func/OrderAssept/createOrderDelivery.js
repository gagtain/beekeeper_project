import axios from "axios";
import { api_root } from '@/main'

export default async function createOrderDelivery(delivery_data){
    try {
        var response = await axios({url: `${api_root}api/v0.1/delivery/create/`,
        method: "post",
        headers:{
            "Authorization": `Bearer ${useCookie('assess').value}`

        },
        data:{
          delivery: delivery_data
        }
      })
      return response
      } catch (error) {
        return error.response
      }
    }