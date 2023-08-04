import{_ as h,r as k,c as l,a as i,F as u,i as g,g as c,t as p,n as d,o,b as m,w as C,p as w,f as x,e as D}from"./entry.345b9908.js";import{s as y}from"./SearchCountDelivery.841f744d.js";import{a as M,b as E}from"./main.639589b0.js";import{D as L}from"./DeliveryInfo.aa1c8dec.js";async function H(s,t,r){try{var _=await M({url:`${E}api/v0.1/delivery/search?${s}from=${t}&size=${r}`,method:"get",headers:{}});return _}catch(n){return n.response}}const T={components:{DeliveryInfo:L},data(){return{delivery_list:null,page:1,total:null,params:""}},watch:{page(){window.history.pushState(null,document.title,`${window.location.pathname}?page=${this.page}`),this.getPaginationDelivery(this.params,this.page)}},async mounted(){let s=this.$route.query.filter,t="";s?t="&":s="",await this.getPaginationDelivery(s+t,this.page);let r=await y(s);this.total=Math.ceil(r.data.count/2)},methods:{async filter(s){this.page=1,await this.getPaginationDelivery(s,this.page);let t=await y(s);this.total=Math.ceil(t.data.count/2)},async getPaginationDelivery(s,t){this.params=s;let r=await H(s,t*2-2,2);this.delivery_list=r.data}}},v=s=>(w("data-v-dc87c814"),s=s(),x(),s),I={key:0,class:"grid"},S={style:{padding:"3%",display:"flex",height:"auto","min-height":"300px"}},P={class:"filter"},B=v(()=>i("p",null,"Фильрация",-1)),N={class:"flex jus-sp"},V=v(()=>i("button",{class:"btn"},[i("span",null,"Подробнее")],-1)),z={key:1,class:"paginator"},F=["onClick"];function j(s,t,r,_,n,a){const f=k("delivery-info"),b=D;return o(),l("div",null,[n.delivery_list?(o(),l("section",I,[i("article",S,[i("div",P,[B,i("div",N,[i("button",{onClick:t[0]||(t[0]=e=>a.filter(`status=${e.srcElement.innerHTML}&`)),class:"btn min"},"На проверке"),i("button",{onClick:t[1]||(t[1]=e=>a.filter(`status=${e.srcElement.innerHTML}&`)),class:"btn min"},"Ожидание доставки"),i("button",{onClick:t[2]||(t[2]=e=>a.filter(`status=${e.srcElement.innerHTML}&`)),class:"btn min"},"Отправлен"),i("button",{onClick:t[3]||(t[3]=e=>a.filter(`status=${e.srcElement.innerHTML}&`)),class:"btn min"},"Ожидает в пункте выдачи"),i("button",{onClick:t[4]||(t[4]=e=>a.filter(`status=${e.srcElement.innerHTML}&`)),class:"btn min"},"Принят"),i("button",{onClick:t[5]||(t[5]=e=>a.filter(`status=${e.srcElement.innerHTML}&`)),class:"btn min"},"Отменен")])])]),(o(!0),l(u,null,g(n.delivery_list,e=>(o(),l("article",{style:{display:"block",padding:"3%"},key:e.id},[m(f,{delivery:e},null,8,["delivery"]),m(b,{to:"/admin/delivery/"+e.id},{default:C(()=>[V]),_:2},1032,["to"])]))),128))])):c("",!0),n.total>1?(o(),l("div",z,[n.page>1?(o(),l("button",{key:0,onClick:t[6]||(t[6]=e=>n.page-=1),class:"button"},"Назад")):c("",!0),i("button",{class:d([{active:n.page==1},"button"]),onClick:t[7]||(t[7]=e=>n.page=1)},p(1),2),(o(!0),l(u,null,g(n.total-1,e=>(o(),l(u,{key:e},[e<=n.page+2&&e>=n.page-2&&e!=1?(o(),l("button",{key:0,class:d([{active:n.page==e},"button"]),onClick:q=>n.page=e},p(e),11,F)):c("",!0)],64))),128)),i("button",{class:d([{active:n.page==n.total},"button"]),onClick:t[8]||(t[8]=e=>n.page=n.total)},p(n.total),3),n.page!==n.total?(o(),l("button",{key:1,onClick:t[9]||(t[9]=e=>n.page+=1),class:"button"},"Вперед")):c("",!0)])):c("",!0)])}const O=h(T,[["render",j],["__scopeId","data-v-dc87c814"]]);export{O as default};
