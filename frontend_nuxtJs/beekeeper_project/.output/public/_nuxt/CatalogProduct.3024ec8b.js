import{a as f,o,b as _,e as t,F as g,k as v,r as m,f as r,s as I,t as c,v as L,m as k,x as b,p as P,l as T}from"./entry.a3afa070.js";import{A as B,F as E}from"./FavoriteComp.d9349dcd.js";const F={el:"#photo-album",name:"TovarMinImageList",props:["image","ImageProductList"],created(){console.log(this.ImageProductList)},methods:{a(e){e.srcElement.parentElement.parentElement.firstChild.getElementsByTagName("img")[0].src=e.srcElement.src}}},N={class:"photo-album flex",id:"photo-album"},A=["src"],M=["src"];function S(e,n,s,C,i,d){return o(),_("div",N,[t("img",{onClick:n[0]||(n[0]=l=>d.a(l)),class:"add-img-tovar",src:e.$api_root+s.image},null,8,A),(o(!0),_(g,null,v(s.ImageProductList,(l,p)=>(o(),_("img",{onClick:n[1]||(n[1]=h=>d.a(h)),key:p,class:"add-img-tovar",src:e.$api_root+l.photo},null,8,M))),128))])}const V=f(F,[["render",S],["__scopeId","data-v-1a834377"]]);const D={el:"#product_catalog",name:"CatalogProduct",props:["pr"],components:{TovarMinImageList:V,AddBasket:B,FavoriteComp:E},data(){return{type_weigth_id:null,type_pack_id:null}},created(){this.type_weigth_id=this.pr.list_weight[0].id,this.type_pack_id=this.pr.type_packaging[0].id},methods:{select_type_weigth(e){console.log(e),this.type_weigth_id=e},select_type_pack(e){console.log(e),this.type_pack_id=e}}},y=e=>(P("data-v-8aa91168"),e=e(),T(),e),z={class:"product",id:"product_catalog"},O={class:"product__photo"},j={class:"photo-container"},q={class:"photo-main"},G=y(()=>t("div",{class:"controls"},null,-1)),H=["src"],J={class:"product__info"},K={class:"title"},Q={class:"small-big product__name"},R={class:"very-small product__code"},U={class:"price"},W={class:"product__price small-big"},X={class:"product__price small"},Y={class:"variant"},Z=y(()=>t("h3",null,"Размер",-1)),$={class:"flex"},tt={class:"variant-ul"},et=["onClick"],st={class:"h_sto"},ot=y(()=>t("h3",null,"Тип упаковки",-1)),_t={class:"flex"},it={class:"variant-ul"},at=["onClick"],ct={class:"h_sto"},nt={class:"product__text"},dt={class:"small"},lt={class:"flex"};function rt(e,n,s,C,i,d){const l=m("TovarMinImageList"),p=b,h=m("AddBasket"),x=m("FavoriteComp");return o(),_("section",z,[t("div",O,[t("div",j,[t("div",q,[G,t("img",{src:e.$api_root+s.pr.image,alt:"green apple slice"},null,8,H)]),r(l,{image:s.pr.image,ImageProductList:s.pr.ImageProductList},null,8,["image","ImageProductList"])])]),t("div",J,[t("div",K,[r(p,{"no-prefetch":"",to:`/tovar/${s.pr.id}`},{default:I(()=>[t("p",Q,c(s.pr.name),1)]),_:1},8,["to"]),t("span",R,"COD: "+c(s.pr.id),1)]),t("div",U,[t("span",W,[L(c(s.pr.price)+" ",1),t("span",X,c(s.pr.price_currency),1)])]),t("div",Y,[Z,t("div",$,[t("ul",tt,[(o(!0),_(g,null,v(s.pr.list_weight,(a,u)=>(o(),_("li",{onClick:w=>d.select_type_weigth(a.id),class:k([i.type_weigth_id==a.id?"active":"","photo-album-li"]),key:u},[t("div",st,[t("p",null,c(a.weight)+" гр",1)])],10,et))),128))])]),ot,t("div",_t,[t("ul",it,[(o(!0),_(g,null,v(s.pr.type_packaging,(a,u)=>(o(),_("li",{onClick:w=>d.select_type_pack(a.id),class:k([i.type_pack_id==a.id?"active":"","photo-album-li"]),key:u},[t("div",ct,[t("p",null,c(a.name),1)])],10,at))),128))])])]),t("div",nt,[t("p",dt,c(s.pr.description),1)]),t("div",lt,[r(h,{id:s.pr.id,wei_id:i.type_weigth_id,pack_id:i.type_pack_id},null,8,["id","wei_id","pack_id"]),r(x,{id:s.pr.id,wei_id:i.type_weigth_id,pack_id:i.type_pack_id},null,8,["id","wei_id","pack_id"])])])])}const ut=f(D,[["render",rt],["__scopeId","data-v-8aa91168"]]);export{ut as C,V as T};
