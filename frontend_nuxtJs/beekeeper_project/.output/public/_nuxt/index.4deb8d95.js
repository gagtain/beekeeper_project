import{a as r,r as p,b as a,f as s,F as m,l as u,c as h,o,h as i,v as _,t as d,B as f,p as v,m as x,x as g}from"./entry.aab76e22.js";import{n as w}from"./newsList.4681fe72.js";import{L as y}from"./LoadingComp.a4d08670.js";const k={components:{LoadingComp:y},data(){return{news:null}},async created(){let t=await w(0,20);this.news=t.data,console.log(this.news)}},b=t=>(v("data-v-040bfc16"),t=t(),x(),t),B={class:"sot-ob"},L={class:"wrapper flex w-sto"},$={class:"interactiv auto back"},I={class:"w-sto product_div"},N=b(()=>s("div",{class:"flex w-sto"},[s("p",{class:"auto small-big VAG"},"Новости")],-1)),S={key:0,style:{padding:"5%"},class:"grid w-sto"},V={class:"image"},C=["src"],F={class:"info"},A={class:"info-text"},D={class:"button-wrap"};function E(t,G,T,q,c,z){const n=g,l=p("loading-comp");return o(),a("div",B,[s("div",L,[s("div",$,[s("div",I,[N,c.news?(o(),a("section",S,[(o(!0),a(m,null,u(c.news,e=>(o(),a("article",{key:e.id,class:"grid-item",style:{"max-height":"400px"}},[s("div",V,[s("img",{src:this.$api_root+e.main_image},null,8,C)]),s("div",F,[i(n,{to:`/news/${e.id}`},{default:_(()=>[s("h2",null,d(e.title),1)]),_:2},1032,["to"]),s("div",A,[s("p",null,d(e.main_text),1)]),s("div",D,[i(n,{class:"atuin-btn",to:`/news/${e.id}`},{default:_(()=>[f("Подробнее")]),_:2},1032,["to"])])])]))),128))])):(o(),h(l,{key:1}))])])])])}const M=r(k,[["render",E],["__scopeId","data-v-040bfc16"]]);export{M as default};