import{D as m}from"./DeliveryInfo.5133751a.js";import{a as p,b as f}from"./main.a73236fa.js";import{O as h,a as g,s as b}from"./SubmitOrder.d186eb22.js";import{O as w}from"./OrderInfo.8a28cf09.js";import{_ as x,r as t,c as d,a as o,b as i,g as l,m as I,h as S,o as n,p as k,f as O}from"./entry.faf62857.js";async function D(e){try{var _=await p({url:`${f}api/v0.1/delivery/${e}`,method:"get",headers:{}});return _}catch(a){return a.response}}const B={components:{DeliveryInfo:m,OrderItemList:h,OrderInfo:w,OrderSettings:g},data(){return{delivery:null}},async mounted(){let e=await D(this.$route.params.id);this.delivery=e.data,console.log(this.delivery)},methods:{delivery_info_submit(e){this.delivery=e},async submit_order(){let e=await b(this.order_delivery_transaction[0].id);this.order_delivery_transaction[0]=e.data},async submit_waiting(){let e=await deliverySubmitWaiting(this.delivery.id);this.delivery=e.data}}},C=e=>(k("data-v-cf8eeda0"),e=e(),O(),e),L={class:"grid"},N={style:{height:"auto","min-height":"300px"},class:"flex"},V={key:0,style:{width:"40%"},class:"delivery_info auto flex jus-sp"},j={key:0,style:{"grid-column":"1 / -1","min-height":"300px","justify-content":"space-between"},class:"flex"},E={style:{width:"46%",padding:"3%",background:"#fff"}},H=C(()=>o("p",{align:"center"},"Товары заказа",-1)),P={style:{width:"46%",padding:"3%",background:"#fff"}};function W(e,_,a,q,r,s){const c=t("delivery-info"),y=t("order-info"),v=t("order-item-list"),u=t("order-settings");return n(),d("section",L,[o("article",N,[r.delivery!=null?(n(),d("div",V,[i(c,{delivery:r.delivery},null,8,["delivery"]),i(y,{order:r.delivery.order_delivery_transaction[0]},null,8,["order"])])):l("",!0)]),r.delivery!=null?(n(),d("div",j,[o("div",E,[H,i(v,{orderList:r.delivery.order_delivery_transaction[0].product_list_transaction},null,8,["orderList"])]),o("div",P,[i(u,I({onDelivery_info_submit:s.delivery_info_submit,onSubmit_order:s.submit_order},S(s.submit_waiting),{delivery:r.delivery,order:r.delivery.order_delivery_transaction[0]}),null,16,["onDelivery_info_submit","onSubmit_order","delivery","order"])])])):l("",!0)])}const K=x(B,[["render",W],["__scopeId","data-v-cf8eeda0"]]);export{K as default};
