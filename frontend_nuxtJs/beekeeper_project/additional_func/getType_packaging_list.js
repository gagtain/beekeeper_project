import axios from "axios";
import { api_root } from '@/main'


export default async function getType_packaging_list(){
    try {
        var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/type_packaging`,
        method: "get",
        headers:{
            "Authorization": `Bearer ${useCookie('assess').value}`

        }
      })
      return response
      } catch (error) {
        return error.response
      }
    }