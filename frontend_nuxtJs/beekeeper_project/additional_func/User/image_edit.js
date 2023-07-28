import axios from "axios";
import { api_root } from '@/main'

export default async function image_edit(data){
  try {
    var response = await axios({url: `${api_root}api/v0.1/user/image_edit`,
    method: "post",
    headers:{
        "Authorization": `Bearer ${useCookie('assess').value}`

    },
    data: data
  })
  return response
  } catch (error) {
    return error.response
  }
    }