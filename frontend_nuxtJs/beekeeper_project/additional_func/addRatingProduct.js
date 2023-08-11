import axios from "axios";
import { api_root } from '@/main'

export default async function addRatingProduct(product_id, rating){
    try {
        var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/product/${product_id}/rating/create`,
        method: "post",
        headers:{

        },
        withCredentials: true,
        data:{
            rating
        }
      })
      return response
      } catch (error) {
        return error.response
      }
    }