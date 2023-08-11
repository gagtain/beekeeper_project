import axios from "axios";
import { api_root } from '@/main'

export default async function newsGet(id){
  console.log(123)
    try {
        var response = await axios({url: `${api_root}api/v0.1/news/${id}`,
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