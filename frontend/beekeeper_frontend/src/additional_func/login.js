import axios from "axios";


export default async function login(data){
    try {
        var response = await axios({url: "http://localhost:8000/api/token/",
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