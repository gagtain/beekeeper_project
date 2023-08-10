import{C as w}from"./CatalogProduct.418d0c48.js";import{i as h,j as m,k as y,a as A,o as a,b as r,f as s,F as b,l as k,w as D,t as x,p as S,m as L,q as g,r as f,h as c,s as N,c as C,v as T,x as F}from"./entry.f80f1ae4.js";import{L as P}from"./LoadingComp.5f1bdc6d.js";import"./FavoriteComp.e7442833.js";async function q(t){try{var e=await h({url:`${m}api/v0.1/beekeeper_web_api/product?size=${t}`,method:"get",headers:{Authorization:`Bearer ${y("assess").value}`}});return e}catch(_){return _.response}}async function R(){try{var t=await h({url:`${m}api/v0.1/beekeeper_web_api/category`,method:"get",headers:{Authorization:`Bearer ${y("assess").value}`}});return t}catch(e){return e.response}}const G={el:"#filter",name:"FilterCatalog",data(){return{filter_catalog:[],filter_class_name:[],filter_packaging_name:[],cat_list:[],category_list:[]}},async mounted(){let t=await R();this.category_list=t.data},methods:{add(t,e){this.addClassActive(t.srcElement)?this.$store.ADD_CATALOG_PARAMS(e):this.$store.REMOVE_CATALOG_PARAMS(e)},addClassActive(t){return console.log(t),t.classList.contains("active")?(t.classList.remove("active"),!1):(t.classList.add("active"),!0)}},setup(){}},B=t=>(S("data-v-cfe92613"),t=t(),L(),t),E={id:"filter"},I=B(()=>s("p",{class:"filter-p small"},"Категория",-1)),z={class:"filter-ul"},U=["onClick"];function V(t,e,_,v,o,i){return a(),r("div",E,[I,s("ul",z,[(a(!0),r(b,null,k(o.category_list,(l,d)=>(a(),r("li",{onClick:D(p=>i.add(p,`category__name=${l.name}`),["stop"]),key:d,class:"filter-li normal-small"},x(l.name),9,U))),128))])])}const j=A(G,[["render",V],["__scopeId","data-v-cfe92613"]]);async function $(t){try{var e=await h({url:`${m}api/v0.1/beekeeper_web_api/product/search?${t}`,method:"get",headers:{Authorization:`Bearer ${y("assess").value}`}});return e}catch(_){return _.response}}const J={el:"#sorted",name:"SortedCatalog",data(){return{sorted_list:[],sorteredAlf:!1,sorteredMonet:!1,sorteredNew:!1}},props:["catalog_list"],methods:{async sorteredAlfFunc(){this.$store.ADD_ORDER_BY_CATALOG_PARAMS("order_by=name",["order_by=price_min","order_by=pk"]),this.sorteredAlf=!this.sorteredAlf,this.sorteredMonet=!1,this.sorteredNew=!1},async sorteredMoneyFUnc(){this.$store.ADD_ORDER_BY_CATALOG_PARAMS("order_by=price_min",["order_by=name","order_by=pk"]),this.sorteredMonet=!this.sorteredMonet,this.sorteredAlf=!1,this.sorteredNew=!1},async sorteredNewFUnc(){this.$store.ADD_ORDER_BY_CATALOG_PARAMS("order_by=pk",["order_by=name","order_by=price_min"]),this.sorteredNew=!this.sorteredNew,this.sorteredMonet=!1,this.sorteredAlf=!1}},setup(){}},Y={class:"sorted-product flex jus-sp",id:"sorted"};function H(t,e,_,v,o,i){return a(),r("div",Y,[s("p",{onClick:e[0]||(e[0]=l=>i.sorteredAlfFunc()),class:g([o.sorteredAlf?"act_sorted-p":"","sorted-p small"])}," По имени ",2),s("p",{onClick:e[1]||(e[1]=l=>i.sorteredMoneyFUnc()),class:g([o.sorteredMonet?"act_sorted-p":"","sorted-p small"])}," По цене ",2),s("p",{onClick:e[2]||(e[2]=l=>i.sorteredNewFUnc()),class:g([o.sorteredNew?"act_sorted-p":"","sorted-p small"])}," Новое ",2)])}const K=A(J,[["render",H],["__scopeId","data-v-d6ea93e3"]]),Q=""+new URL("filter.b252e476.png",import.meta.url).href;const W={el:"#catalog",name:"CatalogItem",components:{FilterCatalog:j,SortedCatalog:K,CatalogProduct:w,LoadingComp:P},data(){return{catalog_list:[],filter_teleport:!1,category_list:[],type_packaging:[],CATALOG_LIST_STATE:this.$store.getCatalog_list,filters:!1,catalog_loads:!1,data:this.$store.getCatalog_params}},async mounted(){this.$route.query.filter?this.$store.ADD_CATALOG_PARAMS(`name=${JSON.parse(this.$route.query.filter).name}`):this.getCatalog()},methods:{async clear_filter(){await this.$router.replace({query:null}),this.$store.CLEAR_CATALOG_PARAMS(),this.getCatalog(),this.data=this.$store.getCatalog_params},async restartCatalog(){var e;this.catalog_loads=!1;let t=null;(e=this.$route.query)!=null&&e.filter?(t=await $(`name=${JSON.parse(this.$route.query.filter).name}`),this.filters=!0):t=await q(50),console.log(t,342),this.catalog_list=t.data,this.catalog_list_sorted=this.catalog_list.slice(),this.$store.REFACTOR_CATALOG_LIST(this.catalog_list),this.catalog_loads=!0},async filterReg(){let t=await R();this.category_list=t.data},async getCatalog(){this.catalog_loads=!1;let t=await $(this.$store.getCatalog_params.join("&"));this.catalog_list=t.data,this.catalog_loads=!0}},setup(){},watch:{"$route.query":async function(){this.$route.query.filter&&this.$store.ADD_CATALOG_PARAMS(`name=${JSON.parse(this.$route.query.filter).name}`)},data:{handler(t,e){console.log(213),this.getCatalog()},deep:!0}}},n=t=>(S("data-v-24476f5d"),t=t(),L(),t),X={id:"catalog"},Z={class:"absolute flex w-sto h_sto",style:{"pointer-events":"none"}},tt={id:"dialog",class:"absolute auto",style:{"pointer-events":"auto"}},et=n(()=>s("button",{class:"btn w-sto btn-green",onclick:"window.dialog.close();"},"Показать",-1)),st=n(()=>s("button",{onclick:"window.dialog.close();","aria-label":"close",class:"x"}," ❌ ",-1)),ot={class:"sot-ob"},at={class:"wrapper-product w-sto flex"},rt={class:"interactiv auto back"},lt={key:0,style:{"margin-left":"5%"},class:"small"},it={class:"flex w-sto product_div"},_t={class:"block filter_div"},ct={class:"filter-product",id:"filter_desk"},nt={class:"product_osnov relative"},dt={class:"sorted_div flex jus-sp"},pt=n(()=>s("div",{class:"mob_filter flex"},[s("img",{onclick:"window.dialog.showModal();",class:"open_filter_mob auto",src:Q,alt:""})],-1)),ut={key:0,class:"w-sto product-list flex"},gt={key:2,style:{width:"50%",margin:"auto","margin-top":"10%"}},ft=n(()=>s("div",{style:{"text-align":"center"},class:"flex w-sto"},[s("p",{style:{"font-size":"28px"},class:"VAG auto"},"Товаров с выбранными параметрами нету :(")],-1)),ht={class:"select_size"};function mt(t,e,_,v,o,i){const l=f("FilterCatalog"),d=f("SortedCatalog"),p=w,M=f("LoadingComp"),O=F;return a(),r("div",X,[s("div",Z,[s("dialog",tt,[c(l,{category_list:o.category_list,catalog_list:o.catalog_list,onUpdateClassFiler:t.filterClassReg},null,8,["category_list","catalog_list","onUpdateClassFiler"]),et,st])]),s("div",ot,[s("div",at,[s("div",rt,[t.$route.query.filter?(a(),r("p",lt,x(JSON.parse(t.$route.query.filter).name),1)):N("",!0),s("div",it,[s("div",_t,[s("div",ct,[c(l,{category_list:o.category_list,catalog_list:o.catalog_list},null,8,["category_list","catalog_list"])])]),s("div",nt,[s("div",dt,[c(d,{catalog_list:o.catalog_list},null,8,["catalog_list"]),pt]),o.catalog_list.length?(a(),r("div",ut,[(a(!0),r(b,null,k(o.catalog_list,u=>(a(),C(p,{key:u.id,pr:u},null,8,["pr"]))),128))])):o.catalog_loads?(a(),r("div",gt,[ft,s("div",ht,[c(O,{to:"/catalog"},{default:T(()=>[s("button",{onClick:e[0]||(e[0]=u=>i.clear_filter()),style:{background:"rgb(255, 188, 65)",cursor:"pointer",width:"100%",border:"medium none","border-radius":"6px","font-size":"26px",padding:"2%","margin-top":"1%"}}," Сбросить настройки ")]),_:1})])])):(a(),C(M,{key:1}))])])])])])])}const $t=A(W,[["render",mt],["__scopeId","data-v-24476f5d"]]);export{$t as default};
