import{_ as b,c as a,a as n,t as l,b as g,w,g as c,F as u,i as m,n as _,e as k,o as i,p as x,f as C}from"./entry.ee6704f2.js";import{a as v,b as f}from"./main.ddb459a7.js";async function y(o,t){try{var p=await v({url:`${f}api/v0.1/news/list?size=${t}&from=${o}`,method:"get",headers:{}});return p}catch(d){return d.response}}async function N(){try{var o=await v({url:`${f}api/v0.1/news/search/count`,method:"get",headers:{}});return o}catch(t){return t.response}}const L={data(){return{news:null,maxLength:30,page:null,total:null}},watch:{page(){window.history.pushState(null,document.title,`${window.location.pathname}?page=${this.page}`),this.getPageNewsList(this.page)}},async mounted(){let o=await y(0,2);this.news=o.data,this.$route.query.page==null?this.page=1:this.page=this.$route.query.page;let t=await N();console.log(t.data.count),this.total=Math.ceil(t.data.count/2)},methods:{async getPageNewsList(o){let t=await y(o*2-2,2);this.news=t.data}}},r=o=>(x("data-v-f8127a3a"),o=o(),C(),o),S={key:0},I={class:"grid"},B={key:0,style:{padding:"3%",display:"flex",height:"auto","min-height":"300px"}},V={class:"container"},q={class:"main_news_title"},z=r(()=>n("br",null,null,-1)),F={class:"main_element"},P=r(()=>n("button",{class:"btn"},[n("span",null,"Подробнее")],-1)),D={class:"container"},E={class:"news_title"},G=r(()=>n("br",null,null,-1)),M={class:"element"},j=r(()=>n("button",{class:"btn"},[n("span",null,"Подробнее")],-1)),A={key:0,class:"paginator"},H=["onClick"];function J(o,t,p,d,e,K){const h=k;return e.news?(i(),a("div",S,[n("section",I,[e.news[0]?(i(),a("article",B,[n("div",V,[n("h4",q,l(e.news[0].title),1),z,n("p",F,l(e.news[0].main_text.slice(0,300)),1),g(h,{to:"/admin/news/"+e.news[0].id},{default:w(()=>[P]),_:1},8,["to"])])])):c("",!0),(i(!0),a(u,null,m(e.news.slice(1),s=>(i(),a("article",{style:{display:"block",height:"auto",padding:"3%"},key:s.id},[n("div",D,[n("h4",E,l(s.title),1),G,n("p",M,l(s.main_text.slice(0,300))+"...",1),g(h,{to:"/admin/news/"+s.id},{default:w(()=>[j]),_:2},1032,["to"])])]))),128))]),e.total>1?(i(),a("div",A,[e.page>1?(i(),a("button",{key:0,onClick:t[0]||(t[0]=s=>e.page-=1),class:"button"},"Назад")):c("",!0),n("button",{class:_([{active:e.page==1},"button"]),onClick:t[1]||(t[1]=s=>e.page=1)},l(1),2),(i(!0),a(u,null,m(e.total-1,s=>(i(),a(u,{key:s},[s<=e.page+2&&s>=e.page-2&&s!=1?(i(),a("button",{key:0,class:_([{active:e.page==s},"button"]),onClick:O=>e.page=s},l(s),11,H)):c("",!0)],64))),128)),n("button",{class:_([{active:e.page==e.total},"button"]),onClick:t[2]||(t[2]=s=>e.page=e.total)},l(e.total),3),e.page!==e.total?(i(),a("button",{key:1,onClick:t[3]||(t[3]=s=>e.page+=1),class:"button"},"Вперед")):c("",!0)])):c("",!0)])):c("",!0)}const T=b(L,[["render",J],["__scopeId","data-v-f8127a3a"]]);export{T as default};