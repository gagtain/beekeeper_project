import axios from "axios";
import { api_root } from '@/main'

export default async function getLastOrder(){
    try {
        var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/order/last`,
        method: "get",
        headers:{
            "Authorization": `Bearer ${useCookie('assess').value}`

        },
      })
      return response
      } catch (error) {
        return error.response
      }
    }