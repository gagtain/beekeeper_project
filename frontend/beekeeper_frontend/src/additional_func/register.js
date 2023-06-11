import axios from "axios";
import { api_root } from '@/main'


export default async function register(data){
    try {
        var response = await axios({url: `${api_root}api/v0.1/beekeeper_web_api/register`,
        method: "post",
        data: data,
      })
      return response
      } catch (error) {
        return error.response
      }
    }