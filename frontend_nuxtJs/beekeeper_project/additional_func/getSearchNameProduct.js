import axios from "axios";
import { api_root } from '@/main'


export default async function getSearchNameproduct(params){
    try {
        var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/product/search/name?${params}`,
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