import{_ as p,o as d,c as n,F as g,i as $,a as o,t as i,d as k,l as w,j as b,p as x,f as S,k as I,v as O,g as u,r as y,q as v}from"./entry.2eacd025.js";import{a as f,b as h}from"./main.528f6e7c.js";const C={el:"#orderProductList",setup(){},props:["orderList"]},D={id:"orderProductList"},L={class:"w-sto flex jus-sp"},F={class:"flex"},B={class:"img_order_product_div"},N=["src"],V={class:"info_order_product_div"},T={class:"name_order_product"};function j(e,t,s,c,a,_){return d(),n("div",D,[(d(!0),n(g,null,$(s.orderList,(r,m)=>(d(),n("div",{key:r.id,class:"product_order_info"},[o("div",L,[o("p",null,i(m+1),1),k(),o("p",null,i(r.productItem.product.price*r.count)+" "+i(r.productItem.product.price_currency),1)]),o("div",F,[o("div",B,[o("img",{class:"img_order_product",src:e.$api_root+r.productItem.product.image,alt:""},null,8,N)]),o("div",V,[o("div",T,i(r.productItem.product.name)+" ["+i(r.productItem.weight.weight)+" гр]",1),o("p",null,i(r.productItem.product.price)+" "+i(r.productItem.product.price_currency),1),o("p",null,i(r.count)+" шт",1)])]),w(e.$slots,"default",{orderItem:r},void 0,!0)]))),128))])}const ee=p(C,[["render",j],["__scopeId","data-v-5f0a009e"]]);async function E(e,t){console.log(t);try{var s=await f({url:`${h}api/v0.1/delivery/${e}/track_number`,method:"post",headers:{},data:t});return s}catch(c){return c.response}}const M={props:["delivery"],methods:{async submit(){let e=new FormData(document.getElementById("DeliveryInfoSubmitFrom")),t=await E(this.delivery.id,e);console.log(this.delivery),this.$emit("delivery_info_submit",t.data)}}},P=e=>(x("data-v-c0ccb281"),e=e(),S(),e),q={id:"DeliveryInfoSubmitFrom",action:"",method:"get"},A=P(()=>o("input",{type:"text",name:"track_number",value:"",placeholder:"Трек номер"},null,-1));function U(e,t,s,c,a,_){return d(),n("form",q,[A,o("button",{onClick:t[0]||(t[0]=b(r=>_.submit(),["prevent"])),style:{"margin-top":"2%"},class:"btn"},"Добавить данные доставки")])}const z=p(M,[["render",U],["__scopeId","data-v-c0ccb281"]]);async function G(e,t){try{var s=await f({url:`${h}api/v0.1/orders/${e}/closed`,method:"post",headers:{},data:{description:t}});return s}catch(c){return c.response}}const H={props:["order"],data(){return{closed_order_s:!1,cause:""}},methods:{async submit(){},async closed_order(){if(this.closed_order_s){let e=await G(this.order.id,this.cause);this.$emit("order_status_closed",e.data)}else this.closed_order_s=!0}}},J={id:"DeliveryInfoSubmitFrom",action:"",method:"get"};function K(e,t,s,c,a,_){return d(),n("form",J,[a.closed_order_s?I((d(),n("input",{key:0,type:"text",name:"track_number","onUpdate:modelValue":t[0]||(t[0]=r=>a.cause=r),placeholder:"Причина отказа"},null,512)),[[O,a.cause]]):u("",!0),o("button",{onClick:t[1]||(t[1]=b(r=>_.closed_order(),["prevent"])),style:{"margin-top":"2%"}},"Отменить заказ")])}const Q=p(H,[["render",K],["__scopeId","data-v-31a9d5b2"]]);const R={components:{DeliveryInfoSubmit:z,OrderStatusClosed:Q},props:["order","delivery"],methods:{async submit_waiting(){this.$emit("submit_waiting")},delivery_info_submit(e){this.$emit("delivery_info_submit",e)},async submit_order(){this.$emit("submit_order")},order_status_closed(e){console.log(e),this.delivery.order_delivery_transaction[0]=e,this.delivery.status="Отменен"}}},W={key:4,class:"btn"};function X(e,t,s,c,a,_){const r=y("delivery-info-submit"),m=y("order-status-closed");return d(),n("div",null,[s.delivery.status=="На проверке"&&s.order.status=="Одобрен"?(d(),n("button",{key:0,class:"btn",onClick:t[0]||(t[0]=(...l)=>_.submit_waiting&&_.submit_waiting(...l))}," Подтвердить доставку ")):u("",!0),s.order.status=="Не одобренный"?(d(),n("button",{key:1,class:"btn",onClick:t[1]||(t[1]=l=>_.submit_order())}," Подтвердить заказ ")):s.delivery.status=="Ожидание доставки"?(d(),v(r,{key:2,onDelivery_info_submit:t[2]||(t[2]=l=>_.delivery_info_submit(l)),delivery:s.delivery,style:{"margin-top":"2%"}},null,8,["delivery"])):u("",!0),s.delivery.status=="На проверке"&&s.order.status!="Одобрен"?(d(),v(m,{key:3,style:{"margin-top":"3%"},onOrder_status_closed:_.order_status_closed,order:s.order},null,8,["onOrder_status_closed","order"])):u("",!0),s.delivery.status=="Отправлен"?(d(),n("button",W," Отследить заказ ")):u("",!0)])}const te=p(R,[["render",X],["__scopeId","data-v-a2f3b552"]]);export{ee as O,te as a};
