import axios from "axios";
import { api_root } from '@/main'

export default async function newsCreate(data){
    try {
        var response = await axios({url: `${api_root}api/v0.1/news/create`,
        method: "post",
        headers:{
       //     "Authorization": `Bearer ${useCookie('assess').value}`

        },
        data: data
      })
      return response
      } catch (error) {
        return error.response
      }
    }