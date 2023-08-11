import axios from "axios";
import { api_root } from '@/main'


export default async function getTovar(pk){
    try {
        var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/product/${pk}`,
        method: "get",
        headers:{

        },
        withCredentials: true
      })
      return response
      } catch (error) {
        return error.response
      }
    }