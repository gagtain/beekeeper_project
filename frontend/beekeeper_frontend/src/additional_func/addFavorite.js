import axios from "axios";
import getCookie from "./getCookie";
import { api_root } from '@/main'


export default async function addFavorite(pk){
    try {
        var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/favorite/${pk}`,
        method: "post",
        headers:{
            "Authorization": `Bearer ${getCookie('assess')}`

        }
      })
      return response
      } catch (error) {
        return error.response
      }
    }