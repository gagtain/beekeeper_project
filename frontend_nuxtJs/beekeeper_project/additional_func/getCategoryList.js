import axios from "axios";
import { api_root } from '@/main'


export default async function getCategoryList(){
    try {
        var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/category`,
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