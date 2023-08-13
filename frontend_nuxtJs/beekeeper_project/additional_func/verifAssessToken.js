import axios from "axios";
import { api_root } from '@/main'


export default async function verifAssessToken(token=undefined){
    try {
        var response = await axios({url: `${api_root}api/v0.1/user/token/verif`,
        method: "post",
        headers:{
            "Content-Type": "application/json",
            "Authorization": token != undefined ? `Bearer ${token}` : undefined

        },
        withCredentials: true
      })
      return response
      } catch (error) {
        return error.response
      }
    }
