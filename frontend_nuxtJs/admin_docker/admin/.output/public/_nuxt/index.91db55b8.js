import{a as d,b as l}from"./main.528f6e7c.js";import{_ as p,c as n,a as t,t as o,F as u,i as h,g as y,o as i,p as g,f as m}from"./entry.2eacd025.js";async function f(e,r){try{var c=await d({url:`${l}api/v0.1/news/list?size=${r}&from=${e}`,method:"get",headers:{}});return c}catch(_){return _.response}}const x={data(){return{news:null}},async mounted(){let e=await f(0,10);this.news=e.data}},v=e=>(g("data-v-443da084"),e=e(),m(),e),w={key:0},k={class:"grid"},$={style:{padding:"3%",display:"flex",height:"auto","min-height":"300px"}},b={class:"news_title"},I=["innerHTML"],L=v(()=>t("button",{class:"btn"},"Подробнее",-1));function S(e,r,c,_,a,B){return a.news?(i(),n("div",w,[t("section",k,[t("article",$,[t("p",null,"Привет "+o(a.news[0].id),1)]),(i(!0),n(u,null,h(a.news,s=>(i(),n("article",{style:{display:"block",height:"auto"},key:s.id},[t("p",b,o(s.title),1),t("p",null,o(e.$api_root+s.main_image),1),t("div",{innerHTML:s.context},null,8,I),L]))),128))])])):y("",!0)}const M=p(x,[["render",S],["__scopeId","data-v-443da084"]]);export{M as default};
