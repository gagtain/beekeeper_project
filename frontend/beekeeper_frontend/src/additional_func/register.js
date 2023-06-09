import axios from "axios";


export default async function register(data){
    try {
        var response = await axios({url: "http://localhost:8000/api/v0.1/beekeeper_web_api/register",
        method: "post",
        data: data,
      })
      return response
      } catch (error) {
        return error.response
      }
    }