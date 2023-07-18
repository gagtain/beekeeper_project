import axios from "axios";
import { api_root } from '@/main'

export default async function deliveryAddTrackNumber(id, data){
    console.log(data)
    try {
        var response = await axios({url: `${api_root}api/v0.1/delivery/${id}/track_number`,
        method: "post",
        headers:{
       //     "Authorization": `Bearer ${useCookie('assess').value}`

        },
        data
      })
      return response
      } catch (error) {
        return error.response
      }
    }