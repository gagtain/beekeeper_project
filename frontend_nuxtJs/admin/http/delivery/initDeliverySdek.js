import axios from "axios";
import { api_root } from '@/main'

export default async function initDeviverySdek(id, delivery_info){
    try {
        var response = await axios({url: `${api_root}/api/v0.1/delivery/initial/`,
        method: "post",
        headers:{
       //     "Authorization": `Bearer ${useCookie('assess').value}`

        },
        data: {
            delivery_info: delivery_info,
            delivery_id: id
        }
      })
      return response
      } catch (error) {
        return error.response
      }
    }