import{a as l,r as u,o as _,b as d,c as m,v as f,p as b,l as g,e as s,B as v,t as a,s as y,f as h}from"./entry.25f4f121.js";const $={el:"sub_order_ref",props:["items"]},k=t=>(b("data-v-5120646a"),t=t(),g(),t),w={id:"sub_order_ref",class:"w-sto"},x=k(()=>s("button",{class:"w-sto"},[s("div",{class:"fon_btn"}),v("Оформить")],-1)),B=k(()=>s("button",{class:"w-sto"},[s("div",{class:"fon_btn"}),v(" Добавить товар")],-1));function S(t,o,e,n,p,r){const c=u("RouterLink");return _(),d("div",w,[e.items.length?(_(),m(c,{key:0,to:"/checkout"},{default:f(()=>[x]),_:1})):(_(),m(c,{key:1,to:"/catalog"},{default:f(()=>[B]),_:1}))])}const C=l($,[["render",S],["__scopeId","data-v-5120646a"]]);const L={el:"#pr_list_info",props:["items","delivery_price","ordered"],data(){return{summ:0}},methods:{getCountBasket(){let t=0;return this.items.forEach(o=>{t+=parseInt(o.count)}),t},getWeight(){let t=this.items.reduce(function(e,n){return e+parseFloat(n.productItem.weight.weight*n.count)},0),o="";return t>=1e3?(t=t/1e3,o=`${t} кг`):o=`${t} гр`,o},getSumm(){let t=this.items.reduce(function(o,e){return o+parseFloat(e.productItem.product.price*e.count)},0);return this.ordered&&(t+=parseFloat(this.delivery_price)),t}}},I=t=>(b("data-v-d21cd0ba"),t=t(),g(),t),z={id:"pr_list_info",class:"kor_all_info auto w-sto m-2"},F={class:"m2"},N={class:"m2"},P={class:"m2"},V={key:0,class:"m2"},O=I(()=>s("p",{class:"m2"},"скидки:",-1)),E=I(()=>s("ul",null,[s("li",null,"*в разработке*")],-1)),R={id:"is",class:"small"};function W(t,o,e,n,p,r){return _(),d("div",z,[s("p",F,"Товаров: "+a(r.getCountBasket()),1),s("p",N,"Вес: "+a(r.getWeight()),1),s("p",P," Цена: "+a(e.items.reduce(function(c,i){return c+parseFloat(i.productItem.product.price)},0)),1),e.ordered?(_(),d("p",V,"Цена доставки "+a(e.delivery_price),1)):y("",!0),O,E,s("p",R," Итоговая сумма: "+a(r.getSumm()),1)])}const D=l(L,[["render",W],["__scopeId","data-v-d21cd0ba"]]);const T={components:{SubmitOrderref:C,ProductListInfo:D},el:"#reg_zakaz",name:"BasketInfo",props:["items"]},j={class:"register_zakaz",style:{width:"100%"}};function q(t,o,e,n,p,r){const c=u("SubmitOrderref"),i=u("ProductListInfo");return _(),d("div",j,[h(c,{items:e.items},null,8,["items"]),h(i,{items:e.items,ordered:!1},null,8,["items"])])}const G=l(T,[["render",q],["__scopeId","data-v-259016bb"]]);export{G as B,D as P};
