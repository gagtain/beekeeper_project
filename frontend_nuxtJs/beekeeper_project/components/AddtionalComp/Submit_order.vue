<template>
    <div id="sub_order" class="w-sto">
        <RouterLink v-if="items.length" to="/checkout"> <button @click="submin_order" class="w-sto"> <div class="fon_btn"></div>Оплатить онлайн</button></RouterLink>
      <RouterLink v-else to="/catalog"><button class="w-sto"> <div class="fon_btn"></div> Добавить товар</button></RouterLink>
   
    </div>
</template>

<style src="~/assets/css/account.css" scoped></style>
<script>
import createOrderPayment from '~/additional_func/OrderAssept/createOrderPayment';
import addOrder from '~/additional_func/addOrder';
export default {
    el: '#sub_order',
  props: ['items', 'forms_validate', 'delivery_price'],
  data(){
    return{
      order_create: null
    }
  },
  methods:{

async submin_order(){
    await this.$emit('forms_validate_met')
  if (this.forms_validate.status){
    console.log(213)
    let response_order = await addOrder(this.delivery_price)
    console.log(2132, response_order)
    this.order_create = response_order.data
 // if (response_order.status == 200){
    this.create_payment()
    
//  }
  }
  
  
},
  async create_payment(){
    let response_payment = await createOrderPayment({
      "payment_service": "yookassa",
    "order_service": "online_shop",
    "order_id": this.order_create.id,
    "currency": "RUB"
    })
    document.location.href = response_payment.data.payment_url
  }
}
}
</script>