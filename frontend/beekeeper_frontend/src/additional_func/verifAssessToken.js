import axios from "axios";
import getCookie from "./getCookie";

export default async function verifAssessToken(){
    try {
        var response = await axios({url: "http://localhost:8000/api/v0.1/beekeeper_web_api/token/verif",
        method: "post",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getCookie('assess')}`

        }
      })
      return response
      } catch (error) {
        return error.response
      }
    }
