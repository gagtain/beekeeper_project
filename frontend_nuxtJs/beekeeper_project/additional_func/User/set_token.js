import axios from "axios";
import { api_root } from '@/main'


export default async function set_token(data){
    try {
        var response = await axios({url: `${api_root}api/v0.1/user/set_token`,
        method: "post",
        data: data,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      })
      return response
      } catch (error) {
        return error.response
      }
    }