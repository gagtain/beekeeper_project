import{_ as w}from"./ImageForm.983f17c2.js";import{k as h,l as m,a as v,j as y,b as r,f as t,e as k,v as d,t as x,B as _,C as c,o as l,p as C,q as V,z as b}from"./entry.3c7fa92a.js";async function p(s){try{var e=await h({url:`${m}api/token/`,method:"post",data:s,headers:{"Content-Type":"application/json"},withCredentials:!0});return e}catch(i){return i.response}}async function j(s){try{var e=await h({url:`${m}api/v0.1/user/set_token`,method:"post",data:s,headers:{"Content-Type":"application/json"},withCredentials:!0});return e}catch(i){return i.response}}const I={el:"#login_main",data(){return{username:"",password:"",login_401:!1,message:null,is_code:!1,code:""}},methods:{async login_request(s){var e;if(this.is_code){let i={username:this.username,password:this.password,token:this.code},a=await p(i);this.default_check_status_login(a)}else{let i={username:this.username,password:this.password},a=await p(i);(a==null?void 0:a.status)==400&&((e=a==null?void 0:a.data)==null?void 0:e.error)=="Не указано поле token"?(await j({username:this.username,password:this.password}),this.is_code=!0):this.default_check_status_login(a)}},async default_check_status_login(s){s.status==200?await this.$router.push("/profile"):s.status==401?this.login_401=!0:s==404&&alert("сайт на проверке, подождите 5 минут")}},mounted(){this.message=this.$route.query.message},setup(){y({title:"Пчелиная артель - Вход",meta:[{name:"description",content:"My amazing site."}]})}},u=s=>(C("data-v-a9f838d3"),s=s(),V(),s),N={id:"login_main"},q={class:"sot-ob"},B={class:"wrapper flex"},S={class:"login-page flex"},T={class:"form"},U=u(()=>t("p",{class:"small login-p"},"Войти в аккаунт ",-1)),z={class:"flex h_sto"},D={class:"login-form auto"},M={class:"error_list"},A={key:0},E={key:1},F={key:2},H=u(()=>t("p",null,"Укажите отправленный вам код",-1)),G=u(()=>t("p",{class:"message"},[b(" Not registered? "),t("a",{href:"/register"},"Create an account")],-1));function J(s,e,i,a,o,f){const g=w;return l(),r("div",N,[t("div",q,[t("div",B,[t("div",S,[k(g),t("div",T,[U,t("div",z,[t("div",D,[t("div",M,[o.login_401?(l(),r("div",A," Нету учетной записи с введенными данными ")):d("",!0),o.message?(l(),r("div",E,x(o.message),1)):d("",!0)]),o.is_code?d("",!0):_((l(),r("input",{key:0,type:"text",placeholder:"username","onUpdate:modelValue":e[0]||(e[0]=n=>o.username=n)},null,512)),[[c,o.username]]),o.is_code?(l(),r("div",F,[H,_(t("input",{type:"text",placeholder:"code","onUpdate:modelValue":e[2]||(e[2]=n=>o.code=n)},null,512),[[c,o.code]])])):_((l(),r("input",{key:1,type:"password",placeholder:"password","onUpdate:modelValue":e[1]||(e[1]=n=>o.password=n)},null,512)),[[c,o.password]]),t("button",{onClick:e[3]||(e[3]=n=>f.login_request(n))},"login"),G])])])])])])])}const O=v(I,[["render",J],["__scopeId","data-v-a9f838d3"]]);export{O as default};
