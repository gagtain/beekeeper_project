import verifAssessToken from "../additional_func/verifAssessToken"

import { useMainStore } from "../store";
export default async (event) => {
  /* Попытка авторизовать пользователя на всех переходах  */
  const stores = useMainStore()
  console.log(124124)
    if (useCookie('assess').value || useCookie('refresh').value){
      // проверка токена
      stores.assess_token = useCookie('assess')
      console.log(1241244)
      let assess_response = await verifAssessToken(stores.assess_token)
      console.log(1241243)
      if (!(assess_response.status == 200)){
      // если нет
          if (useCookie('refresh')){
              console.log('Есть рефреш')
              return // установить новый токен
          }
      }else{
        stores.userSet(assess_response.data)
      }
  }else{

    console.log(1241244)
    let assess_response = await verifAssessToken()
    console.log(1241243)
    console.log(assess_response.status)
      if (!(assess_response.status == 200)){
      // если нет
      }else{
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