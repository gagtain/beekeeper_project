import{a as r,r as p,b as a,f as e,F as m,l as u,c as h,o,h as c,v as _,t as d,B as v,p as x,m as f,x as w}from"./entry.bef30b64.js";import{n as g}from"./newsList.536a3399.js";import{L as y}from"./LoadingComp.46f175b5.js";const b={components:{LoadingComp:y},data(){return{news:null}},async created(){let s=await g(0,20);this.news=s.data}},k=s=>(x("data-v-ae8beea6"),s=s(),f(),s),B={class:"sot-ob"},L={class:"wrapper flex w-sto"},$={class:"interactiv auto back"},I={class:"w-sto product_div"},N=k(()=>e("div",{class:"flex w-sto"},[e("p",{class:"auto small-big VAG"},"Новости")],-1)),S={key:0,style:{padding:"5%"},class:"grid w-sto"},V={class:"image"},C=["src"],F={class:"info"},A={style:{display:"-webkit-box","-webkit-line-clamp":"2","-webkit-box-orient":"vertical",overflow:"hidden"}},D={class:"info-text"},E={class:"button-wrap"};function G(s,T,q,z,i,H){const n=w,l=p("loading-comp");return o(),a("div",B,[e("div",L,[e("div",$,[e("div",I,[N,i.news?(o(),a("section",S,[(o(!0),a(m,null,u(i.news,t=>(o(),a("article",{key:t.id,class:"grid-item",style:{"max-height":"400px"}},[e("div",V,[e("img",{src:this.$api_root+t.main_image},null,8,C)]),e("div",F,[c(n,{to:`/news/${t.id}`},{default:_(()=>[e("h2",A,d(t.title),1)]),_:2},1032,["to"]),e("div",D,[e("p",null,d(t.main_text.slice(0,80))+"...",1)]),e("div",E,[c(n,{class:"atuin-btn",to:`/news/${t.id}`},{default:_(()=>[v("Подробнее")]),_:2},1032,["to"])])])]))),128))])):(o(),h(l,{key:1}))])])])])}const O=r(b,[["render",G],["__scopeId","data-v-ae8beea6"]]);export{O as default};
