import{D as S}from"./DeliveryInfo.3072f41f.js";import{a as h,b as v}from"./main.31482b52.js";import{O,a as D,P as L,s as B}from"./PaymentInfo.aeaffc90.js";import{O as N}from"./OrderInfo.7d92a565.js";import{_ as j,r as c,c as a,a as e,b as m,g as f,k as d,v as r,F as g,i as b,o as u,d as z,t as F,n as x,p as M,f as P}from"./entry.73d06ff6.js";async function T(i){try{var n=await h({url:`${v}api/v0.1/orders/${i}`,method:"get",headers:{}});return n}catch(p){return p.response}}async function E(i){try{var n=await h({url:`${v}api/v0.1/delivery/${i}/submit/waiting`,method:"post",headers:{}});return n}catch(p){return p.response}}async function W(i){try{var n=await h({url:`${v}/api/v0.1/delivery/${i}/get_info_in_order`,method:"post",headers:{},data:{delivery_engine:"sdek",order_engine:"online_store",pred_payment:"yes",tariff_code:216}});return n}catch(p){return p.response}}async function q(i,n){try{var p=await h({url:`${v}/api/v0.1/delivery/initial/`,method:"post",headers:{},data:{delivery_info:n,delivery_id:i}});return p}catch(w){return w.response}}const A={components:{DeliveryInfo:S,OrderItemList:O,OrderInfo:N,OrderSettings:D,PaymentInfo:L},data(){return{order:null,dilevery_auto:!1,dilevery_info:null,openContent:null}},async mounted(){let i=await T(this.$route.params.id);this.order=i.data;let n=await W(this.order.delivery.id);this.dilevery_info=n.data,console.log(n.data)},methods:{delivery_info_submit(i){this.order.delivery=i},async submit_order(){let i=await B(this.order.id);this.order=i.data},async submit_waiting(){console.log(123);let i=await E(this.order.delivery.id);this.order.delivery=i.data},order_status_closed(i){this.order=i},showContent(i){i.number==this.openContent?this.openContent=null:this.openContent=i.number},addpackages(){this.dilevery_info.packages.push({number:`Упаковка №${this.dilevery_info.packages.length+1}`,weight:0,length:0,width:0,height:0,items:[{name:"",ware_key:"5",payment:{value:0},cost:0,weight:0,amount:0}]})},additem(i){console.log(i),i.items.push({name:"",ware_key:"5",payment:{value:0},cost:0,weight:0,amount:0})},async deliveryInit(){await q(this.order.delivery.id,this.dilevery_info)}}},s=i=>(M("data-v-2a416343"),i=i(),P(),i),G={class:"grid"},H={style:{height:"auto","min-height":"300px"},class:"flex"},J={key:0,style:{width:"40%"},class:"delivery_info auto flex jus-sp"},K={key:0,style:{"grid-column":"1 / -1","min-height":"300px","justify-content":"space-between"},class:"flex"},Q={style:{width:"46%",padding:"3%",background:"#fff"}},R=s(()=>e("p",{align:"center"},"Товары заказа",-1)),X={style:{width:"46%",padding:"3%",background:"#fff"}},Y={style:{height:"auto","min-height":"300px",width:"100%","background-color":"#fff","margin-top":"30px",padding:"2% 3%"},class:"flex"},Z={key:1,style:{width:"100%",height:"100%"}},$=s(()=>e("p",{align:"center"},"Инфо о доставке",-1)),ee=s(()=>e("p",null,"Пункт доставки",-1)),te=s(()=>e("p",{align:"center"},"Упаковки",-1)),ne=s(()=>e("br",null,null,-1)),oe=["onClick"],ie=s(()=>e("svg",{viewBox:"-122.9 121.1 105.9 61.9"},[e("path",{d:"M-63.2 180.3l43.5-43.5c1.7-1.7 2.7-4 2.7-6.5s-1-4.8-2.7-6.5c-1.7-1.7-4-2.7-6.5-2.7s-4.8 1-6.5 2.7L-69.9 161l-37.2-37.2c-1.7-1.7-4-2.7-6.5-2.7s-4.8 1-6.5 2.6c-1.9 1.8-2.8 4.2-2.8 6.6 0 2.3.9 4.6 2.6 6.5 11.4 11.5 41 41.2 43 43.3l.2.2c3.6 3.6 10.3 3.6 13.9 0z"})],-1)),le=[ie],se=s(()=>e("p",null,"Высота",-1)),de=["onUpdate:modelValue"],re=s(()=>e("p",null,"Длина",-1)),_e=["onUpdate:modelValue"],ae=s(()=>e("p",null,"Вес",-1)),ue=["onUpdate:modelValue"],pe=s(()=>e("p",null,"Ширина",-1)),ye=["onUpdate:modelValue"],ce=s(()=>e("p",{align:"center"},"Товары",-1)),me=s(()=>e("p",null,"Количество",-1)),he=["onUpdate:modelValue"],ve=s(()=>e("p",null,"Цена",-1)),fe=["onUpdate:modelValue"],ge=s(()=>e("p",null,"Название",-1)),be=["onUpdate:modelValue"],we=s(()=>e("p",null,"Оплата",-1)),xe=["onUpdate:modelValue"],Ve=s(()=>e("p",null,"Идентификатор товара",-1)),Ue=["onUpdate:modelValue"],Ce=s(()=>e("p",null,"Вес товара",-1)),ke=["onUpdate:modelValue"],Ie=s(()=>e("br",null,null,-1)),Se=s(()=>e("hr",null,null,-1)),Oe=s(()=>e("br",null,null,-1)),De=["onClick"],Le=s(()=>e("p",null,"Получатель",-1)),Be=["onUpdate:modelValue"],Ne=s(()=>e("p",null,"Отправитель",-1)),je=s(()=>e("p",null,"Место отгрузки",-1)),ze=s(()=>e("p",null,"Тарифный код",-1)),Fe=s(()=>e("p",null,"Тип",-1));function Me(i,n,p,w,o,y){const V=c("delivery-info"),U=c("order-info"),C=c("payment-info"),k=c("order-item-list"),I=c("order-settings");return u(),a("div",null,[e("section",G,[e("article",H,[o.order!=null?(u(),a("div",J,[m(V,{delivery:o.order.delivery},null,8,["delivery"]),m(U,{order:o.order},null,8,["order"]),m(C,{payment:o.order.payment},null,8,["payment"])])):f("",!0)]),o.order!=null?(u(),a("div",K,[e("div",Q,[R,m(k,{orderList:o.order.product_list_transaction},null,8,["orderList"])]),e("div",X,[m(I,{onDelivery_info_submit:y.delivery_info_submit,onSubmit_order:y.submit_order,onSubmit_waiting:y.submit_waiting,onOrder_status_closed:y.order_status_closed,delivery:o.order.delivery,order:o.order},null,8,["onDelivery_info_submit","onSubmit_order","onSubmit_waiting","onOrder_status_closed","delivery","order"])])])):f("",!0)]),e("div",Y,[o.dilevery_auto?o.dilevery_info?(u(),a("div",Z,[$,ee,d(e("input",{disabled:"","onUpdate:modelValue":n[1]||(n[1]=t=>o.dilevery_info.delivery_point=t),type:"text",name:"",id:"",style:{"margin-top":"10px"}},null,512),[[r,o.dilevery_info.delivery_point]]),te,(u(!0),a(g,null,b(o.dilevery_info.packages,t=>(u(),a("div",{key:t.number,style:{width:"100%"}},[ne,e("div",{onClick:l=>y.showContent(t),class:"spoiler_title",align:"center"},[z(F(t.number)+" ",1),e("span",{class:x([{open:o.openContent==t.number},"spoiler_arrow"])},le,2)],8,oe),e("div",{class:x([{open:o.openContent==t.number},"spoiler_content"])},[se,d(e("input",{disabled:"","onUpdate:modelValue":l=>t.height=l,type:"text"},null,8,de),[[r,t.height]]),re,d(e("input",{disabled:"","onUpdate:modelValue":l=>t.length=l,type:"text"},null,8,_e),[[r,t.length]]),ae,d(e("input",{disabled:"","onUpdate:modelValue":l=>t.weight=l,type:"text"},null,8,ue),[[r,t.weight]]),pe,d(e("input",{"onUpdate:modelValue":l=>t.width=l,type:"text"},null,8,ye),[[r,t.width]]),ce,(u(!0),a(g,null,b(t.items,l=>(u(),a("div",{style:{width:"100%"},key:l.ware_key},[me,d(e("input",{disabled:"","onUpdate:modelValue":_=>l.amount=_,type:"text"},null,8,he),[[r,l.amount]]),ve,d(e("input",{disabled:"","onUpdate:modelValue":_=>l.cost=_,type:"text"},null,8,fe),[[r,l.cost]]),ge,d(e("input",{disabled:"","onUpdate:modelValue":_=>l.name=_,type:"text"},null,8,be),[[r,l.name]]),we,d(e("input",{disabled:"","onUpdate:modelValue":_=>l.payment.value=_,type:"text"},null,8,xe),[[r,l.payment.value]]),Ve,d(e("input",{disabled:"","onUpdate:modelValue":_=>l.ware_key=_,type:"text"},null,8,Ue),[[r,l.ware_key]]),Ce,d(e("input",{disabled:"","onUpdate:modelValue":_=>l.weight=_,type:"text"},null,8,ke),[[r,l.weight]]),Ie,Se,Oe]))),128)),e("button",{disabled:"",onClick:l=>y.additem(t),class:"btn"},"Добавить товар",8,De)],2)]))),128)),e("button",{disabled:"",onClick:n[2]||(n[2]=t=>y.addpackages()),class:"btn"},"Добавить упаковку"),Le,d(e("input",{disabled:"","onUpdate:modelValue":n[3]||(n[3]=t=>o.dilevery_info.recipient.name=t),type:"text"},null,512),[[r,o.dilevery_info.recipient.name]]),(u(!0),a(g,null,b(o.dilevery_info.recipient.phones,t=>d((u(),a("input",{disabled:"",key:t.number,"onUpdate:modelValue":l=>t.number=l,type:"text"},null,8,Be)),[[r,t.number]])),128)),Ne,d(e("input",{"onUpdate:modelValue":n[4]||(n[4]=t=>o.dilevery_info.sender.company=t),type:"text"},null,512),[[r,o.dilevery_info.sender.company]]),d(e("input",{"onUpdate:modelValue":n[5]||(n[5]=t=>o.dilevery_info.sender.name=t),type:"text"},null,512),[[r,o.dilevery_info.sender.name]]),je,d(e("input",{disabled:"","onUpdate:modelValue":n[6]||(n[6]=t=>o.dilevery_info.shipment_point=t),type:"text"},null,512),[[r,o.dilevery_info.shipment_point]]),ze,d(e("input",{disabled:"","onUpdate:modelValue":n[7]||(n[7]=t=>o.dilevery_info.tariff_code=t),type:"text"},null,512),[[r,o.dilevery_info.tariff_code]]),Fe,d(e("input",{disabled:"","onUpdate:modelValue":n[8]||(n[8]=t=>o.dilevery_info.type=t),type:"text"},null,512),[[r,o.dilevery_info.type]]),e("button",{onClick:n[9]||(n[9]=t=>y.deliveryInit()),style:{"background-color":"green"},class:"btn"},"Оформить доставку")])):f("",!0):(u(),a("button",{key:0,class:"btn",onClick:n[0]||(n[0]=t=>o.dilevery_auto=!o.dilevery_auto)}," Автозаполенение "))])])}const Ae=j(A,[["render",Me],["__scopeId","data-v-2a416343"]]);export{Ae as default};
