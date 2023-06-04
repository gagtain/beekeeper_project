import axios from "axios";
import getCookie from "./getCookie";


export default async function addBasket(pk){
    try {
        var response = await axios({url: `http://localhost:8000/api/v0.1/beekeeper_web_api/basket/${pk}`,
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