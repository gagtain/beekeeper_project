import axios from "axios";
import { api_root } from '@/main'

export default async function restartOrder(id){
    try {
        var response = await axios({url: `${api_root}api/v0.1/orders/${id}/restart`,
        method: "post",
        headers:{

        },
        withCredentials: true,
      })
      return response
      } catch (error) {
        return error.response
      }
    }