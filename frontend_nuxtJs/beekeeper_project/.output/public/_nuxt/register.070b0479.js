import{_ as f}from"./ImageForm.ef7f2807.js";import{k as $,l as y,a as x,h as b,C as I,Q as F,S as M,b as o,i as t,j as k,F as d,r as n,E as m,G as u,o as l,t as c,p as V,m as O,B as S}from"./entry.f99cad71.js";import{c as i,r as v,e as q,m as p,s as B,u as L}from"./index.b1cfa5ee.js";async function U(r){try{var a=await $({url:`${y}api/v0.1/user/register`,method:"post",headers:{},withCredentials:!0,data:r});return a}catch(_){return _.response}}const A={el:"#registry",data(){return{width:0,login_img_active:!1}},setup(){b({title:"Пчелиная артель - Регистрация",meta:[{name:"description",content:"My amazing site."}]});const r=I({username:{label:"Логин",name:"username",value:""},FIO:{label:"ФИО",name:"FIO",value:""},email:{label:"почта",name:"email",value:""},password:{label:"Пароль",name:"password",value:""},password2:{label:"Подтверждение пароля",name:"password2",value:""}}),a={username:{value:{required:i.withMessage("Требуется",v)}},FIO:{value:{required:i.withMessage("Требуется",v)}},email:{value:{required:i.withMessage("Требуется",v),email:i.withMessage("Неверная почта",q)}},password:{value:{minLength:i.withMessage("Длинна не менее 8-ми символов",p(8)),required:i.withMessage("Требуется",v)}},password2:{value:{minLength:i.withMessage("Длинна не менее 8-ми символов",p(8)),required:i.withMessage("Требуется",v),sameAsPassword:i.withMessage("Пароли не совпадают",B(F(()=>r.password.value)))}}},_=L(a,r);return{state:r,v$:_}},mounted(){this.updateWidth(),window.addEventListener("resize",this.updateWidth)},methods:{async refisterSubmit(r){if(this.v$.$touch(),r.preventDefault(),!this.v$.$error){let a=await U(new FormData(document.getElementById("form")));a.status==201?(console.log("success"),M(this,{path:"/profile"})):a.status==400?console.log("error"):a.status==404&&alert("сайт на проверке, подождите 5 минут")}return!1},updateWidth(){this.width=window.innerWidth}}},h=r=>(V("data-v-d31c2d28"),r=r(),O(),r),D={class:"sot-ob"},E={class:"wrapper flex"},W={class:"login-page flex",id:"registry"},C={class:"form"},N=h(()=>t("p",{class:"small login-p"},"Создать аккаунт",-1)),j={class:"flex h_sto"},z={class:"register-form auto",id:"form"},T={class:"error_list"},G=["placeholder","name"],H={class:"error_list"},P=["placeholder","name"],Q={class:"error_list"},J=["placeholder","name"],K={class:"error_list"},R=["placeholder","name"],X={class:"error_list flex jus-sp-ar"},Y=["placeholder","name"],Z=h(()=>t("p",{class:"message"},[S("Already registered? "),t("a",{href:"#"},"Sign In")],-1));function ee(r,a,_,s,se,g){const w=f;return l(),o("div",D,[t("div",E,[t("div",W,[k(w),t("div",C,[N,t("div",j,[t("form",z,[t("div",T,[(l(!0),o(d,null,n(s.v$.username.value.$errors,e=>(l(),o("div",{key:e.$uid},c(e.$message),1))),128))]),m(t("input",{type:"text",placeholder:s.state.username.label,name:s.state.username.name,"onUpdate:modelValue":a[0]||(a[0]=e=>s.v$.username.value.$model=e)},null,8,G),[[u,s.v$.username.value.$model]]),t("div",H,[(l(!0),o(d,null,n(s.v$.FIO.value.$errors,e=>(l(),o("div",{key:e.$uid},c(e.$message),1))),128))]),m(t("input",{type:"text",placeholder:s.state.FIO.label,name:s.state.FIO.name,"onUpdate:modelValue":a[1]||(a[1]=e=>s.v$.FIO.value.$model=e)},null,8,P),[[u,s.v$.FIO.value.$model]]),t("div",Q,[(l(!0),o(d,null,n(s.v$.email.value.$errors,e=>(l(),o("div",{key:e.$uid},c(e.$message),1))),128))]),m(t("input",{type:"text",placeholder:s.state.email.label,name:s.state.email.name,"onUpdate:modelValue":a[2]||(a[2]=e=>s.v$.email.value.$model=e)},null,8,J),[[u,s.v$.email.value.$model]]),t("div",K,[(l(!0),o(d,null,n(s.v$.password.value.$errors,e=>(l(),o("div",{key:e.$uid},c(e.$message),1))),128))]),m(t("input",{type:"text",placeholder:s.state.password.label,name:s.state.password.name,"onUpdate:modelValue":a[3]||(a[3]=e=>s.v$.password.value.$model=e)},null,8,R),[[u,s.v$.password.value.$model]]),t("div",X,[(l(!0),o(d,null,n(s.v$.password2.value.$errors,e=>(l(),o("div",{key:e.$uid},c(e.$message),1))),128))]),m(t("input",{type:"text",placeholder:s.state.password2.label,name:s.state.password2.name,"onUpdate:modelValue":a[4]||(a[4]=e=>s.v$.password2.value.$model=e)},null,8,Y),[[u,s.v$.password2.value.$model]]),t("button",{onClick:a[5]||(a[5]=e=>g.refisterSubmit(e))},"create"),Z])])])])])])}const oe=x(A,[["render",ee],["__scopeId","data-v-d31c2d28"]]);export{oe as default};