import verifAssessToken from "../additional_func/verifAssessToken"

import { useMainStore } from "../store";
export default async (event) => {
  /* Попытка авторизовать пользователя на всех переходах  */
  const stores = useMainStore()
    if (useCookie('assess').value || useCookie('refresh').value){
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
        console.log(222)
        stores.userSet(assess_response.data)
      }
  }else{

    let assess_response = await verifAssessToken()
      if (!(assess_response.status == 200)){
      // если нет
      }else{
        console.log(222)
        console.log(222)
        stores.userSet(assess_response.data)
      }
  }
}


// import verifAssessToken from "../additional_func/verifAssessToken"

// import { useMainStore } from "../store";
// export default async (event) => {
//   /* Попытка авторизовать пользователя на всех переходах  */
//   const stores = useMainStore()
//       // проверка токена
//       let assess_response = await verifAssessToken()
//       if (!(assess_response.status == 200)){
//       // если нет
//           if (useCookie('refresh')){
//               console.log('Есть рефреш')
//               return // установить новый токен
//           }
//       }else{
//         console.log(123)
//         stores.userSet(assess_response.data)
//         console.log(123)
//         return
//       }
//   }