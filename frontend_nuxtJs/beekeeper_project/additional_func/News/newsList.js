import axios from "axios";
import { api_root } from '@/main'

export default async function newsList(from, size){
    try {
        var response = await axios({url: `${api_root}api/v0.1/news/list?from=${from}&size=${size}`,
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