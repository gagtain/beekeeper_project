import{Y as a,k as e,Z as r,$ as n}from"./entry.cb1d22c2.js";const i=async s=>{const o=a();if(e("assess").value||e("refresh").value){if(console.log("Есть токен"),o.assess_token=e("assess"),(await r(o.assess_token)).status!=200)if(e("refresh")){console.log("Есть рефреш");return}else{if(console.log("Нет рефреша"),s.req.url!="/login")return sendRedirect(s,"/login",302);s.context.$assess_token="123"}}else if(console.log("Нет токена"),s.href!="/login")return n("/login")};export{i as default};
