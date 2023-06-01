import getCookie from "./getCookie"

export default function auth ({ to, from, next}){
    console.log(123)
    console.log(to, from,)
    console.log(document.cookie)
    if (getCookie('token')){
        console.log('Есть токен')
        // проверка токена 
        // если нет
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
        
        // if запрос верен, document.cookie = "token=" + token
        // else проверка на refresh, если он верен то запись токена
        // else return next('/login')
    }else{
        
        console.log('Нет токена')
        return next('/login')
    }
   }