import axios from "axios";
import { api_root } from '@/main'


export default async function verifAssessToken(assess_token){
    try {
        var response = await axios({url: `${api_root}api/v0.1/user/token/verif`,
        method: "post",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${assess_token}`

        }
      })
      return response
      } catch (error) {
        console.log(error)
        return error.response
      }
    }
