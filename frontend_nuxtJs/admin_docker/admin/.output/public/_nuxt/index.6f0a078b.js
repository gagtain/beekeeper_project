import{_ as v,r as k,c as i,a as n,F as u,i as g,g as a,t as d,n as p,o as r,b as m,w,p as x,f as C,e as O}from"./entry.345b9908.js";import{a as I,b as M}from"./main.639589b0.js";import{s as h}from"./SearchCountOrders.117c1d14.js";import{O as S}from"./OrderInfo.ef5ea923.js";async function E(o,t,l){try{var _=await I({url:`${M}api/v0.1/orders/search/?${o}from=${t}&size=${l}`,method:"get",headers:{}});return _}catch(e){return e.response}}const L={components:{OrderInfo:S},data(){return{order_list:null,page:1,total:null,params:""}},watch:{page(){window.history.pushState(null,document.title,`${window.location.pathname}?page=${this.page}`),this.getPaginationOrder(this.params,this.page)}},async mounted(){let o="",t="";this.$route.query.filter&&(o=this.$route.query.filter,t="&"),await this.getPaginationOrder(o+t,this.page);let l=await h(o);this.total=Math.ceil(l.data.count/2)},methods:{async filter(o){this.page=1,await this.getPaginationOrder(o,this.page);let t=await h(o);this.total=Math.ceil(t.data.count/2)},async getPaginationOrder(o,t){this.params=o,console.log(o);let l=await E(o,t*2-2,2);this.order_list=l.data,console.log(l.data)}}},b=o=>(x("data-v-e9bd03d2"),o=o(),C(),o),P={key:0,class:"grid"},B={style:{padding:"3%",display:"flex",height:"auto","min-height":"300px"}},H={class:"filter"},N=b(()=>n("p",null,"Фильрация",-1)),T={class:"flex jus-sp"},V=b(()=>n("button",{class:"btn"},[n("span",null,"Подробнее")],-1)),q={key:1,class:"paginator"},z=["onClick"];function D(o,t,l,_,e,c){const f=k("order-info"),y=O;return r(),i("div",null,[e.order_list?(r(),i("section",P,[n("article",B,[n("div",H,[N,n("div",T,[n("button",{onClick:t[0]||(t[0]=s=>c.filter(`status=${s.srcElement.innerHTML}&`)),class:"btn min"},"Одобрен"),n("button",{onClick:t[1]||(t[1]=s=>c.filter(`status=${s.srcElement.innerHTML}&`)),class:"btn min"},"Не одобренный"),n("button",{onClick:t[2]||(t[2]=s=>c.filter(`status=${s.srcElement.innerHTML}&`)),class:"btn min"},"Закрытый")])])]),(r(!0),i(u,null,g(e.order_list,s=>(r(),i("article",{style:{display:"block",padding:"3%"},key:s.id},[m(f,{order:s},null,8,["order"]),m(y,{to:"/admin/orders/"+s.id},{default:w(()=>[V]),_:2},1032,["to"])]))),128))])):a("",!0),e.total>1?(r(),i("div",q,[e.page>1?(r(),i("button",{key:0,onClick:t[3]||(t[3]=s=>e.page-=1),class:"button"},"Назад")):a("",!0),n("button",{class:p([{active:e.page==1},"button"]),onClick:t[4]||(t[4]=s=>e.page=1)},d(1),2),(r(!0),i(u,null,g(e.total-1,s=>(r(),i(u,{key:s},[s<=e.page+2&&s>=e.page-2&&s!=1?(r(),i("button",{key:0,class:p([{active:e.page==s},"button"]),onClick:F=>e.page=s},d(s),11,z)):a("",!0)],64))),128)),n("button",{class:p([{active:e.page==e.total},"button"]),onClick:t[5]||(t[5]=s=>e.page=e.total)},d(e.total),3),e.page!==e.total?(r(),i("button",{key:1,onClick:t[6]||(t[6]=s=>e.page+=1),class:"button"},"Вперед")):a("",!0)])):a("",!0)])}const K=v(L,[["render",D],["__scopeId","data-v-e9bd03d2"]]);export{K as default};