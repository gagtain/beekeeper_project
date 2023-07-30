import axios from "axios";
import { api_root } from '@/main'

export default async function createDeliveryLait(data){
    try {
        var response = await axios({url: `${api_root}api/v0.1/delivery/create/lait`,
        method: "post",
        headers:{
            "Authorization": `Bearer ${useCookie('assess').value}`

        },
        data: data
      })
      return response
      } catch (error) {
        return error.response
      }
    }