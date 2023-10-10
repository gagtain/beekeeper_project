import{D as C}from"./DeliveryInfo.37ca7ee4.js";import{g as k,h as I,_ as D,r as y,c as a,a as e,b as c,i as m,m as S,j as O,k as d,v as r,F as v,l as h,o as u,d as L,t as B,n as g,p as N,f as j}from"./entry.66c47c99.js";import{O as P,a as z,P as F,g as M,s as T,i as E}from"./initDeliverySdek.b206ebeb.js";import{O as H}from"./OrderInfo.b76ac5b8.js";async function W(s){try{var i=await k({url:`${I}api/v0.1/delivery/${s}`,method:"get",headers:{}});return i}catch(f){return f.response}}const q={components:{DeliveryInfo:C,OrderItemList:P,OrderInfo:H,OrderSettings:z,PaymentInfo:F},data(){return{delivery:null,dilevery_info:null,dilevery_auto:!1,openContent:null}},async mounted(){let s=await W(this.$route.params.id);this.delivery=s.data,console.log(this.delivery);let i=await M(this.delivery.id);this.dilevery_info=i.data},methods:{delivery_info_submit(s){this.delivery=s},async submit_order(){let s=await T(this.delivery.order_delivery_transaction[0].id);this.delivery.order_delivery_transaction[0]=s.data},async submit_waiting(){let s=await deliverySubmitWaiting(this.delivery.id);this.delivery=s.data},showContent(s){s.number==this.openContent?this.openContent=null:this.openContent=s.number},addpackages(){this.dilevery_info.packages.push({number:`Упаковка №${this.dilevery_info.packages.length+1}`,weight:0,length:0,width:0,height:0,items:[{name:"",ware_key:"5",payment:{value:0},cost:0,weight:0,amount:0}]})},additem(s){console.log(s),s.items.push({name:"",ware_key:"5",payment:{value:0},cost:0,weight:0,amount:0})},async deliveryInit(){(await E(this.delivery.id,this.dilevery_info)).status==200&&(alert("Запрос отправлен успешно"),location.reload())}}},l=s=>(N("data-v-e28ae2f9"),s=s(),j(),s),A={class:"grid"},G={style:{height:"auto","min-height":"300px"},class:"flex"},J={key:0,style:{width:"70%"},class:"delivery_info auto flex jus-sp"},K={key:0,style:{"grid-column":"1 / -1","min-height":"300px","justify-content":"space-between"},class:"flex"},Q={style:{width:"46%",padding:"3%",background:"#fff"}},R=l(()=>e("p",{align:"center"},"Товары заказа",-1)),X={style:{width:"46%",padding:"3%",background:"#fff"}},Y={style:{height:"auto","min-height":"300px",width:"100%","background-color":"#fff","margin-top":"30px",padding:"2% 3%"},class:"flex"},Z={key:1,style:{width:"100%",height:"100%"}},$=l(()=>e("p",{align:"center"},"Инфо о доставке",-1)),ee=l(()=>e("p",null,"Пункт доставки",-1)),te=l(()=>e("p",{align:"center"},"Упаковки",-1)),ne=l(()=>e("br",null,null,-1)),oe=["onClick"],le=l(()=>e("svg",{viewBox:"-122.9 121.1 105.9 61.9"},[e("path",{d:"M-63.2 180.3l43.5-43.5c1.7-1.7 2.7-4 2.7-6.5s-1-4.8-2.7-6.5c-1.7-1.7-4-2.7-6.5-2.7s-4.8 1-6.5 2.7L-69.9 161l-37.2-37.2c-1.7-1.7-4-2.7-6.5-2.7s-4.8 1-6.5 2.6c-1.9 1.8-2.8 4.2-2.8 6.6 0 2.3.9 4.6 2.6 6.5 11.4 11.5 41 41.2 43 43.3l.2.2c3.6 3.6 10.3 3.6 13.9 0z"})],-1)),ie=[le],se=l(()=>e("p",null,"Высота",-1)),de=["onUpdate:modelValue"],re=l(()=>e("p",null,"Длина",-1)),_e=["onUpdate:modelValue"],ae=l(()=>e("p",null,"Вес",-1)),ue=["onUpdate:modelValue"],pe=l(()=>e("p",null,"Ширина",-1)),ye=["onUpdate:modelValue"],ce=l(()=>e("p",{align:"center"},"Товары",-1)),me=l(()=>e("p",null,"Количество",-1)),ve=["onUpdate:modelValue"],he=l(()=>e("p",null,"Цена",-1)),fe=["onUpdate:modelValue"],ge=l(()=>e("p",null,"Название",-1)),be=["onUpdate:modelValue"],we=l(()=>e("p",null,"Оплата",-1)),xe=["onUpdate:modelValue"],Ve=l(()=>e("p",null,"Идентификатор товара",-1)),Ue=["onUpdate:modelValue"],Ce=l(()=>e("p",null,"Вес товара",-1)),ke=["onUpdate:modelValue"],Ie=l(()=>e("br",null,null,-1)),De=l(()=>e("hr",null,null,-1)),Se=l(()=>e("br",null,null,-1)),Oe=["onClick"],Le=l(()=>e("p",null,"Получатель",-1)),Be=["onUpdate:modelValue"],Ne=l(()=>e("p",null,"Отправитель",-1)),je=l(()=>e("p",null,"Место отгрузки",-1)),Pe=l(()=>e("p",null,"Тарифный код",-1)),ze=l(()=>e("p",null,"Тип",-1));function Fe(s,i,f,Me,n,p){const b=y("delivery-info"),w=y("order-info"),x=y("payment-info"),V=y("order-item-list"),U=y("order-settings");return u(),a("div",null,[e("section",A,[e("article",G,[n.delivery!=null?(u(),a("div",J,[c(b,{delivery:n.delivery},null,8,["delivery"]),c(w,{order:n.delivery.order_delivery_transaction[0]},null,8,["order"]),c(x,{payment:n.delivery.order_delivery_transaction[0].payment},null,8,["payment"])])):m("",!0)]),n.delivery!=null?(u(),a("div",K,[e("div",Q,[R,c(V,{orderList:n.delivery.order_delivery_transaction[0].product_list_transaction},null,8,["orderList"])]),e("div",X,[c(U,S({onDelivery_info_submit:p.delivery_info_submit,onSubmit_order:p.submit_order},O(p.submit_waiting),{delivery:n.delivery,order:n.delivery.order_delivery_transaction[0]}),null,16,["onDelivery_info_submit","onSubmit_order","delivery","order"])])])):m("",!0)]),e("div",Y,[n.dilevery_auto?n.dilevery_info?(u(),a("div",Z,[$,ee,d(e("input",{disabled:"","onUpdate:modelValue":i[1]||(i[1]=t=>n.dilevery_info.delivery_point=t),type:"text",name:"",id:"",style:{"margin-top":"10px"}},null,512),[[r,n.dilevery_info.delivery_point]]),te,(u(!0),a(v,null,h(n.dilevery_info.packages,t=>(u(),a("div",{key:t.number,style:{width:"100%"}},[ne,e("div",{onClick:o=>p.showContent(t),class:"spoiler_title",align:"center"},[L(B(t.number)+" ",1),e("span",{class:g([{open:n.openContent==t.number},"spoiler_arrow"])},ie,2)],8,oe),e("div",{class:g([{open:n.openContent==t.number},"spoiler_content"])},[se,d(e("input",{"onUpdate:modelValue":o=>t.height=o,type:"text"},null,8,de),[[r,t.height]]),re,d(e("input",{"onUpdate:modelValue":o=>t.length=o,type:"text"},null,8,_e),[[r,t.length]]),ae,d(e("input",{"onUpdate:modelValue":o=>t.weight=o,type:"text"},null,8,ue),[[r,t.weight]]),pe,d(e("input",{"onUpdate:modelValue":o=>t.width=o,type:"text"},null,8,ye),[[r,t.width]]),ce,(u(!0),a(v,null,h(t.items,o=>(u(),a("div",{style:{width:"100%"},key:o.ware_key},[me,d(e("input",{disabled:"","onUpdate:modelValue":_=>o.amount=_,type:"text"},null,8,ve),[[r,o.amount]]),he,d(e("input",{disabled:"","onUpdate:modelValue":_=>o.cost=_,type:"text"},null,8,fe),[[r,o.cost]]),ge,d(e("input",{disabled:"","onUpdate:modelValue":_=>o.name=_,type:"text"},null,8,be),[[r,o.name]]),we,d(e("input",{disabled:"","onUpdate:modelValue":_=>o.payment.value=_,type:"text"},null,8,xe),[[r,o.payment.value]]),Ve,d(e("input",{disabled:"","onUpdate:modelValue":_=>o.ware_key=_,type:"text"},null,8,Ue),[[r,o.ware_key]]),Ce,d(e("input",{disabled:"","onUpdate:modelValue":_=>o.weight=_,type:"text"},null,8,ke),[[r,o.weight]]),Ie,De,Se]))),128)),e("button",{disabled:"",onClick:o=>p.additem(t),class:"btn"},"Добавить товар",8,Oe)],2)]))),128)),e("button",{disabled:"",onClick:i[2]||(i[2]=t=>p.addpackages()),class:"btn"},"Добавить упаковку"),Le,d(e("input",{disabled:"","onUpdate:modelValue":i[3]||(i[3]=t=>n.dilevery_info.recipient.name=t),type:"text"},null,512),[[r,n.dilevery_info.recipient.name]]),(u(!0),a(v,null,h(n.dilevery_info.recipient.phones,t=>d((u(),a("input",{disabled:"",key:t.number,"onUpdate:modelValue":o=>t.number=o,type:"text"},null,8,Be)),[[r,t.number]])),128)),Ne,d(e("input",{"onUpdate:modelValue":i[4]||(i[4]=t=>n.dilevery_info.sender.company=t),type:"text"},null,512),[[r,n.dilevery_info.sender.company]]),d(e("input",{"onUpdate:modelValue":i[5]||(i[5]=t=>n.dilevery_info.sender.name=t),type:"text"},null,512),[[r,n.dilevery_info.sender.name]]),je,d(e("input",{disabled:"","onUpdate:modelValue":i[6]||(i[6]=t=>n.dilevery_info.shipment_point=t),type:"text"},null,512),[[r,n.dilevery_info.shipment_point]]),Pe,d(e("input",{disabled:"","onUpdate:modelValue":i[7]||(i[7]=t=>n.dilevery_info.tariff_code=t),type:"text"},null,512),[[r,n.dilevery_info.tariff_code]]),ze,d(e("input",{disabled:"","onUpdate:modelValue":i[8]||(i[8]=t=>n.dilevery_info.type=t),type:"text"},null,512),[[r,n.dilevery_info.type]]),e("button",{onClick:i[9]||(i[9]=t=>p.deliveryInit()),style:{"background-color":"green"},class:"btn"},"Оформить доставку")])):m("",!0):(u(),a("button",{key:0,class:"btn",onClick:i[0]||(i[0]=t=>n.dilevery_auto=!n.dilevery_auto)}," Автозаполенение "))])])}const qe=D(q,[["render",Fe],["__scopeId","data-v-e28ae2f9"]]);export{qe as default};