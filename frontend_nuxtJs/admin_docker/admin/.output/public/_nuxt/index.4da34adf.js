import{_ as h,c as a,a as t,t as o,b as p,w as u,F as m,i as f,g as w,e as x,o as _,p as y,f as g}from"./entry.1da352be.js";import{a as v,b}from"./main.5a8b17f1.js";async function k(e,i){try{var l=await v({url:`${b}api/v0.1/news/list?size=${i}&from=${e}`,method:"get",headers:{}});return l}catch(d){return d.response}}const I={data(){return{news:null,maxLength:30}},async mounted(){let e=await k(0,10);this.news=e.data}},c=e=>(y("data-v-c1ecafc5"),e=e(),g(),e),S={key:0},B={class:"grid"},L={style:{padding:"3%",display:"flex",height:"auto","min-height":"300px"}},N={class:"container"},V={class:"main_news_title"},C=c(()=>t("br",null,null,-1)),F={class:"main_element"},$={class:"button"},z=c(()=>t("button",{class:"btn"},[t("span",null,"Подробнее")],-1)),D={class:"container"},E={class:"news_title"},G=c(()=>t("br",null,null,-1)),j={class:"element"},q={class:"button"},A=c(()=>t("button",{class:"btn"},[t("span",null,"Подробнее")],-1));function H(e,i,l,d,s,J){const r=x;return s.news?(_(),a("div",S,[t("section",B,[t("article",L,[t("div",N,[t("h4",V,o(s.news[0].title),1),C,t("p",F,o(s.news[0].main_text),1),t("div",$,[p(r,{to:"/admin/news/"+s.news[0].id},{default:u(()=>[z]),_:1},8,["to"])])])]),(_(!0),a(m,null,f(s.news.slice(1),n=>(_(),a("article",{style:{display:"block",height:"auto",padding:"3%"},key:n.id},[t("div",D,[t("h4",E,o(n.title),1),G,t("p",j,o(n.main_text.slice(0,300))+"...",1),t("div",q,[p(r,{to:"/admin/news/"+n.id},{default:u(()=>[A]),_:2},1032,["to"])])])]))),128))])])):w("",!0)}const O=h(I,[["render",H],["__scopeId","data-v-c1ecafc5"]]);export{O as default};