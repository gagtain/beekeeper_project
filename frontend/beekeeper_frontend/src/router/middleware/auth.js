import getCookie from "../../additional_func/getCookie"
import verifAssessToken from "../../additional_func/verifAssessToken"
import store from '../../store'
export default async function auth ({ to, from, next}){
    console.log(123)
    console.log(to, from,)
    console.log(document.cookie)
    if (getCookie('assess') || getCookie('refresh')){
        console.log('Есть токен')
        // проверка токена 
        let assess_response = await verifAssessToken()
        if (assess_response.status == 200){
            store.dispatch('RENAME_USER', assess_response.data)
            next()
        }
        // если нет
        else{
            if (getCookie('refresh')){
                console.log('Есть рефреш')
                return next()
                // проверка рефреша 
                // если верен то вернуть страницу
                // если не верен то перейти на логин
            }else{
                console.log('Нет рефреша')
                return next('/login')
    
            }
        }
        
        
        
        // if запрос верен, document.cookie = "token=" + token
        // else проверка на refresh, если он верен то запись токена
        // else return next('/login')
    }else{
        
        console.log('Нет токена')
        return next('/login')
    }
   }