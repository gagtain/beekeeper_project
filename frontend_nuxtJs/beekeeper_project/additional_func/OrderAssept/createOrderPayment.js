import axios from "axios";
import { api_root } from '@/main'

export default async function createOrderPayment(payment_data){
    try {
        var response = await axios({url: `${api_root}api/v0.1/payments/create/`,
        method: "post",
        headers:{
            "Authorization": `Bearer ${useCookie('assess').value}`

        },
        data:{
          ...payment_data
        }
      })
      return response
      } catch (error) {
        return error.response
      }
    }