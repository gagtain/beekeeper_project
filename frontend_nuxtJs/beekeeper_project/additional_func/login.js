import axios from "axios";
import { api_root } from '@/main'


export default async function login(data){
    try {
        var response = await axios({url: `${api_root}api/token/`,
        method: "post",
        data: data,
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response
      } catch (error) {
        return error.response
      }
    }