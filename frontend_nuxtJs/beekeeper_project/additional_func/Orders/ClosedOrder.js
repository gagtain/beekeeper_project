import axios from "axios";
import { api_root } from '@/main'

export default async function searchCountOrders(id, description){
    try {
        var response = await axios({url: `${api_root}api/v0.1/orders/${id}/closed`,
        method: "post",
        headers:{
       //     "Authorization": `Bearer ${useCookie('assess').value}`

        },
        data:{
            description
        }
      })
      return response
      } catch (error) {
        return error.response
      }
    }