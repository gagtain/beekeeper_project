import{a as m,o as a,e as n,f as s,F as h,r as v,t as d,Q as y,l as $,m as f,p as I,k,B as u,h as r,q as L,z as S,s as M}from"./entry.a9ded731.js";import{A as P,F as T}from"./FavoriteComp.1f39928c.js";const b={el:"#photo-album",name:"TovarMinImageList",props:["image","ImageProductList"],created(){console.log(this.ImageProductList)},methods:{a(t){t.srcElement.parentElement.parentElement.firstChild.getElementsByTagName("img")[0].src=t.srcElement.src}}},B={class:"photo-album flex",id:"photo-album"},E=["src"],F=["src"];function N(t,o,e,l,_,i){return a(),n("div",B,[s("img",{onClick:o[0]||(o[0]=c=>i.a(c)),class:"add-img-tovar",src:t.$api_root+e.image},null,8,E),(a(!0),n(h,null,v(e.ImageProductList,(c,p)=>(a(),n("img",{onClick:o[1]||(o[1]=g=>i.a(g)),key:p,class:"add-img-tovar",src:t.$api_root+c.photo},null,8,F))),128))])}const V=m(b,[["render",N],["__scopeId","data-v-1a834377"]]);const A={el:"#rating",name:"RatingComp",props:["rating"]},z={class:"rating-mini",id:"rating"},R={class:"normal-small",style:{display:"inline"}};function D(t,o,e,l,_,i){return a(),n("div",z,[(a(!0),n(h,null,v(Math.round(e.rating),c=>(a(),n("span",{key:c,class:"active"}))),128)),(a(!0),n(h,null,v(5-Math.round(e.rating),c=>(a(),n("span",{key:c}))),128)),s("p",R,"/"+d(Math.round(e.rating*100)/100),1)])}const j=m(A,[["render",D]]);const q={props:["select_productItem","pr"],data(){return{weight_all:!1}},methods:{select_type_weigth(t){let e=this.pr.productItemList.slice().filter(l=>l.weight.id==t)[0];this.$emit("select_product",e),console.log(this.select_productItem)},get_weight_type_list(){let t=[];return this.pr.productItemList.forEach(o=>{t.push(o.weight)}),t}}},O=t=>(I("data-v-604fa88a"),t=t(),k(),t),Q={key:0,class:"variant"},G=O(()=>s("h3",null,"Размер",-1)),H={class:"flex"},J=["onClick"],K={class:"h_sto"};function U(t,o,e,l,_,i){return e.select_productItem.weight?(a(),n("div",Q,[G,s("div",H,[s("ul",{class:"variant-ul",style:y(_.weight_all?"display: block":"display: flex")},[(a(!0),n(h,null,v(i.get_weight_type_list(),(c,p)=>(a(),n("li",{onClick:g=>i.select_type_weigth(c.id),class:$([e.select_productItem.weight.id==c.id?"active":"","photo-album-li"]),key:p},[s("div",K,[s("p",null,d(c.weight)+" гр",1)])],10,J))),128)),i.get_weight_type_list().length>2&&!_.weight_all?(a(),n("li",{key:0,onClick:o[0]||(o[0]=c=>_.weight_all=!_.weight_all)}," раскрыть ")):f("",!0),_.weight_all?(a(),n("li",{key:1,onClick:o[1]||(o[1]=c=>_.weight_all=!_.weight_all)}," скрыть ")):f("",!0)],4)])])):f("",!0)}const W=m(q,[["render",U],["__scopeId","data-v-604fa88a"]]),X={data(){return{select_productItem:null}},methods:{select_product(t){this.select_productItem=t}}};function Y(t,o,e,l,_,i){return null}const Z=m(X,[["render",Y]]);const tt={el:"#product_catalog",name:"CatalogProduct",props:["pr"],components:{TovarMinImageList:V,AddBasket:P,FavoriteComp:T,RatingComp:j,SelectVariantMenu:W},mixins:[Z],data(){return{type_weigth_id:null}},created(){this.select_productItem=this.pr.productItemList[0]}},et=t=>(I("data-v-f749c382"),t=t(),k(),t),st={class:"product",id:"product_catalog"},ot={class:"product__photo"},ct={class:"photo-container"},at={class:"photo-main"},nt=et(()=>s("div",{class:"controls"},null,-1)),_t=["src"],it={class:"product__info"},lt={class:"title"},rt={class:"small-big product__name"},dt={class:"very-small product__code"},pt={class:"price"},ut={class:"product__price small-big"},mt={class:"product__price small"};function gt(t,o,e,l,_,i){const c=u("TovarMinImageList"),p=M,g=u("rating-comp"),w=u("select-variant-menu"),C=u("AddBasket"),x=u("FavoriteComp");return a(),n("section",st,[s("div",ot,[s("div",ct,[s("div",at,[nt,s("img",{src:t.$api_root+e.pr.image,alt:"green apple slice"},null,8,_t)]),r(c,{image:e.pr.image,ImageProductList:e.pr.ImageProductList},null,8,["image","ImageProductList"])])]),s("div",it,[s("div",lt,[r(p,{"no-prefetch":"",to:`/tovar/${e.pr.id}`},{default:L(()=>[s("p",rt,d(e.pr.name),1)]),_:1},8,["to"]),s("span",dt,"COD: "+d(e.pr.id),1)]),s("div",pt,[s("span",ut,[S(d(t.select_productItem.price)+" ",1),s("span",mt,d(e.pr.price_currency),1)])]),r(g,{rating:e.pr.rating},null,8,["rating"]),r(w,{select_productItem:t.select_productItem,pr:e.pr,onSelect_product:t.select_product},null,8,["select_productItem","pr","onSelect_product"]),s("div",{style:y(t.select_productItem.weight?"margin-top: 8px":"margin-top: 56px"),class:"flex jus-sp"},[r(C,{id:t.select_productItem.id},null,8,["id"]),r(x,{id:t.select_productItem.id},null,8,["id"])],4)])])}const ft=m(tt,[["render",gt],["__scopeId","data-v-f749c382"]]);export{ft as C,j as R,W as S,V as T};
