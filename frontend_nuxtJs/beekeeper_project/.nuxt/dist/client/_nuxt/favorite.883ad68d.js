import{A as u,F as v}from"./FavoriteComp.26575ec5.js";import{a as m,r as _,b as e,f as t,F as h,l as f,h as c,v as g,s as k,o as r,t as i,p as x,m as w}from"./entry.689a6fea.js";import"./FavoriteComp.f829acc2.js";const y={el:"#favorite_main",name:"FavoriteBase",components:{AddBasket:u,FavoriteComp:v},data(){return{USER_STATE:this.$store.getUser}},created(){}},a=s=>(x("data-v-0e264f91"),s=s(),w(),s),I={class:"sot-ob"},S={class:"wrapper flex"},A={class:"user_card flex auto"},B={class:"interactiv user_card_div auto",id:"favorite_main"},E={class:"w-sto kor"},F=a(()=>t("p",{class:"small-big VAG"},"Избранное",-1)),z={class:"w-sto flex"},C={class:"w-sto"},T={class:"tovar_kor_img_div"},b=["src"],V={class:"info_tovar_kor flex jus-sp"},U={class:"info_tovar_kor_osnov"},$={class:"normal-small tovar_kor_name"},N={class:"normal-small info_in_tovar_kor description"},R={style:{width:"45%"},class:"flex"},G=a(()=>t("div",{class:"size_tovar_div"},[t("div",{class:"size_tovar_kor"},[t("div",{class:"select_size"},[t("button",{style:{background:"rgb(76, 175, 80)",cursor:"pointer",width:"100%",height:"32px",border:"none","border-radius":"6px"},onclick:"alert('в разработке')"},"Изменить")])])],-1)),j={key:0,style:{width:"50%",margin:"auto","margin-top":"10%"}},D=a(()=>t("p",{style:{"font-size":"28px"},class:"VAG"},"Список избранного пуст :(",-1)),L={class:"select_size"},q=a(()=>t("button",{style:{background:"rgb(76, 175, 80)",cursor:"pointer",width:"100%",border:"medium none","border-radius":"6px","font-size":"26px",padding:"2%","margin-top":"1%"}}," Перейти в каталог ",-1));function H(s,J,K,M,d,O){const n=_("FavoriteComp"),l=_("AddBasket"),p=_("router-link");return r(),e("div",I,[t("div",S,[t("div",A,[t("div",B,[t("div",E,[F,t("div",z,[t("div",C,[(r(!0),e(h,null,f(d.USER_STATE.favorite_product,o=>(r(),e("div",{key:o.id,class:"tovar w-sto flex"},[t("div",T,[t("img",{class:"tovar_kor_img",src:s.$api_root+o.productItem.product.image,alt:""},null,8,b)]),t("div",V,[t("div",U,[t("p",$,i(o.productItem.product.name)+" "+i(o.productItem.weight?"["+o.productItem.weight.weight+"гр]":""),1),t("p",N,i(o.productItem.product.price)+" "+i(o.productItem.product.price_currency),1),t("div",R,[c(n,{id:o.productItem.id},null,8,["id"]),c(l,{id:o.productItem.id},null,8,["id"])])]),G])]))),128)),d.USER_STATE.favorite_product.length?k("",!0):(r(),e("div",j,[D,t("div",L,[c(p,{to:"/catalog"},{default:g(()=>[q]),_:1})])]))])])])])])])])}const X=m(y,[["render",H],["__scopeId","data-v-0e264f91"]]);export{X as default};
