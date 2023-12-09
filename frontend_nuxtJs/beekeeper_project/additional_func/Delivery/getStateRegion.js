import axios from "axios";
import { api_root } from '@/main'

export default async function getStateRegion(){
    try {
        var response = await axios({url: `${api_root}api/v0.1/delivery/delivery_state`,
        method: "get",
        headers:{

        },
        withCredentials: true,
      })
      return response
      } catch (error) {
        return error.response
      }
    }