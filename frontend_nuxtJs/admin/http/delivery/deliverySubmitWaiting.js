import axios from "axios";
import { api_root } from '@/main'

export default async function deliverySubmitWaiting(id){
    try {
        var response = await axios({url: `${api_root}api/v0.1/delivery/${id}/submit/waiting`,
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