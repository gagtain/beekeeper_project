import axios from "axios";
import { api_root } from '@/main'

export default async function updateCountBasketItem(basketItem_pk, count){
    try {
        var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/basket/${basketItem_pk}/update_count`,
        method: "post",
        headers:{
            "Authorization": `Bearer ${useCookie('assess').value}`

        },
        data:{
          count: count
        }
      })
      return response
      } catch (error) {
        return error.response
      }
    }