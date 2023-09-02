import{k as w,l as C,a as g,o as a,b as c,i as t,F as S,r as $,D as m,j as r,t as l,B,s as p,p as T,m as j,h,c as L}from"./entry.f99cad71.js";import{A as V,F as A}from"./FavoriteComp.d5cd1b89.js";import{R as D,S as F,C as P}from"./CatalogProduct.2eaf16ed.js";async function E(e){try{var s=await w({url:`${C}api/v0.1/beekeeper_web_api/product/${e}`,method:"get",headers:{},withCredentials:!0});return s}catch(o){return o.response}}const N={el:"galery_product",name:"TovarImage",props:["image","ImageProductList"],created(){console.log(this.image)},methods:{a(e){document.getElementById("main_tovar_img").src=e.srcElement.src}}},q={class:"images_tovar flex",id:"galery_product"},G={class:"min"},R={class:"jus-sp-ar"},H={class:"li_min_img"},M=["src"],O=["src"],z={class:"max"},J=["src"];function K(e,s,o,b,i,d){return a(),c("div",q,[t("div",G,[t("ul",R,[t("li",H,[t("img",{onClick:s[0]||(s[0]=n=>d.a(n)),class:"tovar_img_the_min",src:e.$api_root+o.image.slice(1),alt:""},null,8,M)]),(a(!0),c(S,null,$(o.ImageProductList,(n,u)=>(a(),c("li",{class:"li_min_img",key:u},[t("img",{onClick:s[1]||(s[1]=v=>d.a(v)),class:"tovar_img_the_min",src:e.$api_root+n.photo.slice(1),alt:""},null,8,O)]))),128))])]),t("div",z,[t("img",{id:"main_tovar_img",class:"tovar_img_the_max",src:e.$api_root+o.image.slice(1),alt:""},null,8,J)])])}const f=g(N,[["render",K],["__scopeId","data-v-6f03b878"]]);const Q={props:["pr"],data(){return{isDescription:!1,isSostav:!1,type_weigth_id:null}},components:{AddBasket:V,FavoriteComp:A,TovarImage:f,RatingComp:D,SelectVariantMenu:F},extends:P,methods:{getCategoryList(){let e=this.pr.category.slice(),s=[];return e.forEach(o=>{s.push(o.name)}),s}}},_=e=>(T("data-v-069c5d2f"),e=e(),j(),e),U={key:0,class:"ob flex jus-sp w-sto"},W={class:"tovar_infa"},X={class:"tovar_name"},Y={class:"black bolshoi auto"},Z={class:"tovar_two"},tt={class:"black nebolsh"},et={class:"price flex"},st={style:{"line-height":"1"},class:"tovar_price VAG small-big"},ot={style:{"line-height":"1"},class:"tovar_price VAG small"},at={class:"flex tovar_two jus-sp but but-b product_menu"},it=_(()=>t("div",{class:"tovar_two"},[t("p",{class:"black malenkii"},"Подробности")],-1)),ct={class:"tovar_two vib"},_t=_(()=>t("p",{class:"black malenkii vib_"},"Описание",-1)),nt=_(()=>t("div",{class:"contex material-symbols-outlined"}," - ",-1)),rt=[_t,nt],lt={key:0,class:"context_text"},dt={class:"malenkii black"},mt={class:"tovar_two vib"},pt=_(()=>t("p",{class:"black malenkii vib_"},"Состав",-1)),ut=_(()=>t("div",{class:"contex material-symbols-outlined"},[t("span",{class:"material-symbols-outlined"}," - ")],-1)),vt=[pt,ut],gt={key:0,class:"context_text"},ht=_(()=>t("p",{class:"malenkii black"},"Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora natus rem temporibus deserunt repudiandae iure officia cumque eum omnis sapiente illum voluptates, amet ex optio consectetur sed dolore sit eaque.",-1)),ft=[ht];function yt(e,s,o,b,i,d){const n=f,u=m("rating-comp"),v=m("select-variant-menu"),k=m("AddBasket"),I=m("FavoriteComp");return o.pr?(a(),c("div",U,[r(n,{image:o.pr.image,ImageProductList:o.pr.ImageProductList},null,8,["image","ImageProductList"]),t("div",W,[t("div",X,[t("p",Y,l(o.pr.name),1)]),t("div",Z,[t("p",tt,"Категории: "+l(d.getCategoryList().join(", ")),1)]),r(u,{rating:o.pr.rating},null,8,["rating"]),t("div",et,[t("span",st,[B(l(e.select_productItem.price)+" ",1),t("span",ot,l(e.select_productItem.price_currency),1)])]),r(v,{select_productItem:e.select_productItem,pr:o.pr,onSelect_product:e.select_product},null,8,["select_productItem","pr","onSelect_product"]),t("div",at,[r(k,{style:{width:"40%"},id:e.select_productItem.id},null,8,["id"]),r(I,{id:e.select_productItem.id},null,8,["id"])]),it,t("div",ct,[t("div",{class:"flex jus-sp op_contex",onClick:s[0]||(s[0]=x=>i.isDescription=!i.isDescription)},rt),i.isDescription?(a(),c("div",lt,[t("p",dt,l(o.pr.description),1)])):p("",!0)]),t("div",mt,[t("div",{class:"flex jus-sp op_contex",onClick:s[1]||(s[1]=x=>i.isSostav=!i.isSostav)},vt),i.isSostav?(a(),c("div",gt,ft)):p("",!0)])])])):p("",!0)}const y=g(Q,[["render",yt],["__scopeId","data-v-069c5d2f"]]);const bt={class:"sot-ob"},kt={class:"wrapper flex w-sto"},It={class:"tovar_in flex interactiv jus-sp auto",id:"tovar"},xt={el:"#tovar",name:"TovarBase",components:{Tovar:y},data(){return{tovar:null}},async created(){let e=await E(this.$route.params.id);console.log(e),e.status==200&&(this.tovar=e.data,h({title:`Пчелиная артель - Товар ${this.tovar.name}`}))}},wt=Object.assign(xt,{setup(e){return h({title:"Пчелиная артель - Товар"}),(s,o)=>(a(),c("div",bt,[t("div",kt,[t("div",It,[s.tovar?(a(),L(y,{key:0,pr:s.tovar},null,8,["pr"])):p("",!0)])])]))}}),Bt=g(wt,[["__scopeId","data-v-ce18269c"]]);export{Bt as default};