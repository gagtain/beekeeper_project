import axios from "axios";
import { api_root } from '@/main'

export default async function addSending(email){
    try {
        var response = await axios({url: `${api_root}api/v0.1/sending/manager`,
        method: "post",
        headers:{

        },
        withCredentials: true,
        data:{
          email
        }
      })
      return response
      } catch (error) {
        return error.response
      }
    }