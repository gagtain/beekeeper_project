import{_ as f}from"./ImageForm.41f5ab5b.js";import{k as $,l as y,a as x,j as b,A as I,R as F,T as M,b as o,f as t,e as k,F as i,m as n,B as m,C as u,o as l,t as c,p as V,q as O,z as q}from"./entry.c4e6406c.js";import{c as d,r as v,e as S,m as p,s as A,u as B}from"./index.707651a0.js";async function L(r){try{var a=await $({url:`${y}api/v0.1/user/register`,method:"post",headers:{},withCredentials:!0,data:r});return a}catch(_){return _.response}}const U={el:"#registry",data(){return{width:0,login_img_active:!1}},setup(){b({title:"Пчелиная артель - Регистрация",meta:[{name:"description",content:"My amazing site."}]});const r=I({username:{label:"Логин",name:"username",value:""},FIO:{label:"ФИО",name:"FIO",value:""},email:{label:"почта",name:"email",value:""},password:{label:"Пароль",name:"password",value:""},password2:{label:"Подтверждение пароля",name:"password2",value:""}}),a={username:{value:{required:d.withMessage("Требуется",v)}},FIO:{value:{required:d.withMessage("Требуется",v)}},email:{value:{required:d.withMessage("Требуется",v),email:d.withMessage("Неверная почта",S)}},password:{value:{minLength:d.withMessage("Длинна не менее 8-ми символов",p(8)),required:d.withMessage("Требуется",v)}},password2:{value:{minLength:d.withMessage("Длинна не менее 8-ми символов",p(8)),required:d.withMessage("Требуется",v),sameAsPassword:d.withMessage("Пароли не совпадают",A(F(()=>r.password.value)))}}},_=B(a,r);return{state:r,v$:_}},mounted(){this.updateWidth(),window.addEventListener("resize",this.updateWidth)},methods:{async refisterSubmit(r){if(this.v$.$touch(),r.preventDefault(),!this.v$.$error){let a=await L(new FormData(document.getElementById("form")));a.status==201?(console.log("success"),M(this,{path:"/profile"})):a.status==400?console.log("error"):a.status==404&&alert("сайт на проверке, подождите 5 минут")}return!1},updateWidth(){this.width=window.innerWidth}}},h=r=>(V("data-v-d31c2d28"),r=r(),O(),r),D={class:"sot-ob"},W={class:"wrapper flex"},z={class:"login-page flex",id:"registry"},C={class:"form"},E=h(()=>t("p",{class:"small login-p"},"Создать аккаунт",-1)),N={class:"flex h_sto"},T={class:"register-form auto",id:"form"},j={class:"error_list"},H=["placeholder","name"],P={class:"error_list"},R=["placeholder","name"],G={class:"error_list"},J=["placeholder","name"],K={class:"error_list"},Q=["placeholder","name"],X={class:"error_list flex jus-sp-ar"},Y=["placeholder","name"],Z=h(()=>t("p",{class:"message"},[q("Already registered? "),t("a",{href:"#"},"Sign In")],-1));function ee(r,a,_,s,se,g){const w=f;return l(),o("div",D,[t("div",W,[t("div",z,[k(w),t("div",C,[E,t("div",N,[t("form",T,[t("div",j,[(l(!0),o(i,null,n(s.v$.username.value.$errors,e=>(l(),o("div",{key:e.$uid},c(e.$message),1))),128))]),m(t("input",{type:"text",placeholder:s.state.username.label,name:s.state.username.name,"onUpdate:modelValue":a[0]||(a[0]=e=>s.v$.username.value.$model=e)},null,8,H),[[u,s.v$.username.value.$model]]),t("div",P,[(l(!0),o(i,null,n(s.v$.FIO.value.$errors,e=>(l(),o("div",{key:e.$uid},c(e.$message),1))),128))]),m(t("input",{type:"text",placeholder:s.state.FIO.label,name:s.state.FIO.name,"onUpdate:modelValue":a[1]||(a[1]=e=>s.v$.FIO.value.$model=e)},null,8,R),[[u,s.v$.FIO.value.$model]]),t("div",G,[(l(!0),o(i,null,n(s.v$.email.value.$errors,e=>(l(),o("div",{key:e.$uid},c(e.$message),1))),128))]),m(t("input",{type:"text",placeholder:s.state.email.label,name:s.state.email.name,"onUpdate:modelValue":a[2]||(a[2]=e=>s.v$.email.value.$model=e)},null,8,J),[[u,s.v$.email.value.$model]]),t("div",K,[(l(!0),o(i,null,n(s.v$.password.value.$errors,e=>(l(),o("div",{key:e.$uid},c(e.$message),1))),128))]),m(t("input",{type:"text",placeholder:s.state.password.label,name:s.state.password.name,"onUpdate:modelValue":a[3]||(a[3]=e=>s.v$.password.value.$model=e)},null,8,Q),[[u,s.v$.password.value.$model]]),t("div",X,[(l(!0),o(i,null,n(s.v$.password2.value.$errors,e=>(l(),o("div",{key:e.$uid},c(e.$message),1))),128))]),m(t("input",{type:"text",placeholder:s.state.password2.label,name:s.state.password2.name,"onUpdate:modelValue":a[4]||(a[4]=e=>s.v$.password2.value.$model=e)},null,8,Y),[[u,s.v$.password2.value.$model]]),t("button",{onClick:a[5]||(a[5]=e=>g.refisterSubmit(e))},"create"),Z])])])])])])}const oe=x(U,[["render",ee],["__scopeId","data-v-d31c2d28"]]);export{oe as default};