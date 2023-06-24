import verifAssessToken from "../additional_func/verifAssessToken"

import { useMainStore } from "../store";
export default async (event) => {
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
              return
              // проверка рефреша 
              // если верен то вернуть страницу
              // если не верен то перейти на логин
          }else{
              console.log('Нет рефреша')
              if (event.req.url != '/login'){
        
                return sendRedirect(event, '/login', 302)
              }else{
                event.context.$assess_token = '123'
              }
  
          }
      }
      
      
      
      // if запрос верен, document.cookie = "token=" + token
      // else проверка на refresh, если он верен то запись токена
      // else return next('/login')
  }else{
      
      console.log('Нет токена')
      if (event.href != '/login'){

        return navigateTo('/login')
      }
  }
  }