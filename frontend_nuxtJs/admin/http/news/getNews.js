import axios from "axios";
import { api_root } from '@/main'

export default async function newsCreate(id){
    try {
        var response = await axios({url: `${api_root}api/v0.1/news/${id}`,
        method: "get",
        headers:{
       //     "Authorization": `Bearer ${useCookie('assess').value}`

        },
        
      })
      return response
      } catch (error) {
        return error.response
      }
    }