import{a as u,r as d,o as a,b as l,c as m,v as f,p as g,l as b,e as s,B as v,t as r,f as h}from"./entry.0f479908.js";const $={el:"sub_order_ref",props:["items"]},I=t=>(g("data-v-5120646a"),t=t(),b(),t),w={id:"sub_order_ref",class:"w-sto"},y=I(()=>s("button",{class:"w-sto"},[s("div",{class:"fon_btn"}),v("Оформить")],-1)),x=I(()=>s("button",{class:"w-sto"},[s("div",{class:"fon_btn"}),v(" Добавить товар")],-1));function B(t,o,e,_,p,n){const c=d("RouterLink");return a(),l("div",w,[e.items.length?(a(),m(c,{key:0,to:"/checkout"},{default:f(()=>[y]),_:1})):(a(),m(c,{key:1,to:"/catalog"},{default:f(()=>[x]),_:1}))])}const S=u($,[["render",B],["__scopeId","data-v-5120646a"]]);const L={el:"#pr_list_info",props:["items"],data(){return{summ:0}},methods:{getCountBasket(){let t=0;return this.items.forEach(o=>{t+=parseInt(o.count)}),t},getWeight(){let t=this.items.reduce(function(e,_){return e+parseFloat(_.productItem.weight.weight*_.count)},0),o="";return t>=1e3?(t=t/1e3,o=`${t} кг`):o=`${t} гр`,o},getSumm(){return this.items.reduce(function(o,e){return o+parseFloat(e.productItem.product.price*e.count)},0)}}},k=t=>(g("data-v-eeedbb6d"),t=t(),b(),t),z={id:"pr_list_info",class:"kor_all_info auto w-sto m-2"},C={class:"m2"},P={class:"m2"},F={class:"m2"},N=k(()=>s("p",{class:"m2"},"скидки:",-1)),O=k(()=>s("ul",null,[s("li",null,"*в разработке*")],-1)),V={id:"is",class:"small"};function E(t,o,e,_,p,n){return a(),l("div",z,[s("p",C,"Товаров: "+r(n.getCountBasket()),1),s("p",P,"Вес: "+r(n.getWeight()),1),s("p",F," Цена: "+r(e.items.reduce(function(c,i){return c+parseFloat(i.productItem.product.price)},0)),1),N,O,s("p",V," Итоговая сумма: "+r(n.getSumm()),1)])}const R=u(L,[["render",E],["__scopeId","data-v-eeedbb6d"]]);const W={components:{SubmitOrderref:S,ProductListInfo:R},el:"#reg_zakaz",name:"BasketInfo",props:["items"]},D={class:"register_zakaz",style:{width:"100%"}};function T(t,o,e,_,p,n){const c=d("SubmitOrderref"),i=d("ProductListInfo");return a(),l("div",D,[h(c,{items:e.items},null,8,["items"]),h(i,{items:e.items},null,8,["items"])])}const q=u(W,[["render",T],["__scopeId","data-v-571a3635"]]);export{q as B,R as P};
