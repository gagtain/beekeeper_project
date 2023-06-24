import verifAssessToken from "../additional_func/verifAssessToken"

import { useMainStore } from "../store";
export default async (event) => {
  /* Попытка авторизовать пользователя на всех переходах  */
  const stores = useMainStore()
    if (useCookie('assess').value || useCookie('refresh').value){
      console.log('Есть токен')
      // проверка токена
      stores.assess_token = useCookie('assess')
      let assess_response = await verifAssessToken(stores.assess_token)
      if (!(assess_response.status == 200)){
      // если нет
          if (useCookie('refresh')){
              console.log('Есть рефреш')
              return // установить новый токен
          }
      }else{
        console.log(1)
        stores.userSet(assess_response.data)
      }
  }
}