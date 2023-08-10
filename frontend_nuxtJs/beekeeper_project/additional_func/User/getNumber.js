import axios from "axios";
import { api_root } from '@/main'

export default async function getNumber(data){
  try {
    var response = await axios({url: `${api_root}api/v0.1/user/number`,
    method: "get",
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