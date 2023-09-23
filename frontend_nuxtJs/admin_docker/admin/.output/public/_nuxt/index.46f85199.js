import{g as v,h as k,_ as w,r as x,c as i,a as o,F as u,l as g,i as a,t as d,n as p,o as r,b as h,w as C,p as O,f as I,e as M}from"./entry.66c47c99.js";import{s as m}from"./SearchCountOrders.acd15e78.js";import{O as S}from"./OrderInfo.b76ac5b8.js";async function E(n,t,l){try{var _=await v({url:`${k}api/v0.1/orders/search/?${n}from=${t}&size=${l}`,method:"get",headers:{}});return _}catch(e){return e.response}}const L={components:{OrderInfo:S},data(){return{order_list:null,page:1,total:null,params:""}},watch:{page(){window.history.pushState(null,document.title,`${window.location.pathname}?page=${this.page}`),this.getPaginationOrder(this.params,this.page)}},async mounted(){let n="",t="";this.$route.query.filter&&(n=this.$route.query.filter,t="&"),await this.getPaginationOrder(n+t,this.page);let l=await m(n);this.total=Math.ceil(l.data.count/2)},methods:{async filter(n){this.page=1,await this.getPaginationOrder(n,this.page);let t=await m(n);this.total=Math.ceil(t.data.count/2)},async getPaginationOrder(n,t){this.params=n,console.log(n);let l=await E(n,t*2-2,2);this.order_list=l.data,console.log(l.data)}}},b=n=>(O("data-v-e9bd03d2"),n=n(),I(),n),P={key:0,class:"grid"},B={style:{padding:"3%",display:"flex",height:"auto","min-height":"300px"}},H={class:"filter"},N=b(()=>o("p",null,"Фильрация",-1)),T={class:"flex jus-sp"},V=b(()=>o("button",{class:"btn"},[o("span",null,"Подробнее")],-1)),q={key:1,class:"paginator"},z=["onClick"];function D(n,t,l,_,e,c){const f=x("order-info"),y=M;return r(),i("div",null,[e.order_list?(r(),i("section",P,[o("article",B,[o("div",H,[N,o("div",T,[o("button",{onClick:t[0]||(t[0]=s=>c.filter(`status=${s.srcElement.innerHTML}&`)),class:"btn min"},"Одобрен"),o("button",{onClick:t[1]||(t[1]=s=>c.filter(`status=${s.srcElement.innerHTML}&`)),class:"btn min"},"Не одобренный"),o("button",{onClick:t[2]||(t[2]=s=>c.filter(`status=${s.srcElement.innerHTML}&`)),class:"btn min"},"Закрытый")])])]),(r(!0),i(u,null,g(e.order_list,s=>(r(),i("article",{style:{display:"block",padding:"3%"},key:s.id},[h(f,{order:s},null,8,["order"]),h(y,{to:"/admin/orders/"+s.id},{default:C(()=>[V]),_:2},1032,["to"])]))),128))])):a("",!0),e.total>1?(r(),i("div",q,[e.page>1?(r(),i("button",{key:0,onClick:t[3]||(t[3]=s=>e.page-=1),class:"button"},"Назад")):a("",!0),o("button",{class:p([{active:e.page==1},"button"]),onClick:t[4]||(t[4]=s=>e.page=1)},d(1),2),(r(!0),i(u,null,g(e.total-1,s=>(r(),i(u,{key:s},[s<=e.page+2&&s>=e.page-2&&s!=1?(r(),i("button",{key:0,class:p([{active:e.page==s},"button"]),onClick:F=>e.page=s},d(s),11,z)):a("",!0)],64))),128)),o("button",{class:p([{active:e.page==e.total},"button"]),onClick:t[5]||(t[5]=s=>e.page=e.total)},d(e.total),3),e.page!==e.total?(r(),i("button",{key:1,onClick:t[6]||(t[6]=s=>e.page+=1),class:"button"},"Вперед")):a("",!0)])):a("",!0)])}const J=w(L,[["render",D],["__scopeId","data-v-e9bd03d2"]]);export{J as default};
