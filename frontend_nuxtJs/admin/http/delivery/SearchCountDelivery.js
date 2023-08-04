import axios from "axios";
import { api_root } from '@/main'

export default async function searchCountDelivery(params){
    try {
        var response = await axios({url: `${api_root}api/v0.1/delivery/search/count?${params}`,
        method: "get",
        headers:{
       //     "Authorization": `Bearer ${useCookie('assess').value}`

        },
      })
      return response
      } catch (error) {
        return error.response
      }
    }