import{_ as f,c as a,a as t,t as l,b as g,w,F as p,i as m,g as u,s as d,e as k,o as i,p as x,f as C}from"./entry.a7da39df.js";import{a as v,b}from"./main.2c26a49b.js";async function y(o,s){try{var c=await v({url:`${b}api/v0.1/news/list?size=${s}&from=${o}`,method:"get",headers:{}});return c}catch(r){return r.response}}async function N(o,s){try{var c=await v({url:`${b}api/v0.1/news/search/count`,method:"get",headers:{}});return c}catch(r){return r.response}}const L={data(){return{news:null,maxLength:30,page:null,total:null}},watch:{page(){window.history.pushState(null,document.title,`${window.location.pathname}?page=${this.page}`),this.getPageNewsList(this.page)}},async mounted(){let o=await y(0,2);this.news=o.data,this.$route.query.page==null?this.page=1:this.page=this.$route.query.page;let s=await N();console.log(s.data.count),this.total=Math.ceil(s.data.count/2)},methods:{async getPageNewsList(o){let s=await y(o*2-2,2);this.news=s.data}}},_=o=>(x("data-v-ae0a76d7"),o=o(),C(),o),S={key:0},I={class:"grid"},z={style:{padding:"3%",display:"flex",height:"auto","min-height":"300px"}},B={class:"container"},V={class:"main_news_title"},q=_(()=>t("br",null,null,-1)),F={class:"main_element"},P=_(()=>t("button",{class:"btn"},[t("span",null,"Подробнее")],-1)),D={class:"container"},E={class:"news_title"},G=_(()=>t("br",null,null,-1)),M={class:"element"},j=_(()=>t("button",{class:"btn"},[t("span",null,"Подробнее")],-1)),A={class:"paginator"},H=["onClick"];function J(o,s,c,r,e,K){const h=k;return e.news?(i(),a("div",S,[t("section",I,[t("article",z,[t("div",B,[t("h4",V,l(e.news[0].title),1),q,t("p",F,l(e.news[0].main_text.slice(0,300)),1),g(h,{to:"/admin/news/"+e.news[0].id},{default:w(()=>[P]),_:1},8,["to"])])]),(i(!0),a(p,null,m(e.news.slice(1),n=>(i(),a("article",{style:{display:"block",height:"auto",padding:"3%"},key:n.id},[t("div",D,[t("h4",E,l(n.title),1),G,t("p",M,l(n.main_text.slice(0,300))+"...",1),g(h,{to:"/admin/news/"+n.id},{default:w(()=>[j]),_:2},1032,["to"])])]))),128))]),t("div",A,[e.page>1?(i(),a("button",{key:0,onClick:s[0]||(s[0]=n=>e.page-=1),class:"button"},"Назад")):u("",!0),t("button",{class:d([{active:e.page==1},"button"]),onClick:s[1]||(s[1]=n=>e.page=1)},l(1),2),(i(!0),a(p,null,m(e.total-1,n=>(i(),a(p,{key:n},[n<=e.page+2&&n>=e.page-2&&n!=1?(i(),a("button",{key:0,class:d([{active:e.page==n},"button"]),onClick:O=>e.page=n},l(n),11,H)):u("",!0)],64))),128)),t("button",{class:d([{active:e.page==e.total},"button"]),onClick:s[2]||(s[2]=n=>e.page=e.total)},l(e.total),3),e.page!==e.total?(i(),a("button",{key:1,onClick:s[3]||(s[3]=n=>e.page+=1),class:"button"},"Вперед")):u("",!0)])])):u("",!0)}const T=f(L,[["render",J],["__scopeId","data-v-ae0a76d7"]]);export{T as default};