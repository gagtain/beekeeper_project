import axios from "axios";
import { api_root } from '@/main'

export default async function searchCountOrders(id){
    try {
        var response = await axios({url: `${api_root}api/v0.1/orders/${id}/approved`,
        method: "post",
        headers:{
       //     "Authorization": `Bearer ${useCookie('assess').value}`

        },
      })
      return response
      } catch (error) {
        return error.response
      }
    }