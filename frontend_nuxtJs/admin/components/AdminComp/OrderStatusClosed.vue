<template>
    <form id="DeliveryInfoSubmitFrom" action="" method="get">
  
      <input v-if="closed_order_s" type="text" name="track_number" v-model="cause" placeholder="Причина отказа">
      <button @click.prevent="closed_order()" style="margin-top: 2%;">Отменить заказ</button>
    </form>
  </template>
<style src="~/assets/styles/new.css"  scoped>
</style>
  <style scoped>
  input {
          outline: 0;
          background: #f2f2f2;
          width: 100%;
          border: 0;
          border-radius: 5px;
          margin: 0 0 15px;
          padding: 15px;
          box-sizing: border-box;
          font-size: 18px;
      }
  button {
      text-transform: uppercase;
      outline: 0;
      background: #4CAF50;
      width: 100%;
      border: 0;
      
      border-radius: 5px;
      padding: 15px;
      color: #FFFFFF;
      -webkit-transition: all 0.3 ease;
      transition: all 0.3 ease;
      cursor: pointer;
      font-size: 24px;
  }
  </style>
  <script>
  import ClosedOrder from '~/http/orders/ClosedOrder'
  export default {
      props:['order'],
  data() {
    return {
      closed_order_s: false,
      cause: ''
    };
  },
      methods:{
          async submit(){
          },
    async closed_order(){
        if (this.closed_order_s){
            let r = await ClosedOrder(this.order.id, this.cause)
            this.$emit('order_status_closed', r.data)
        }else{
            this.closed_order_s = true
        }
    }
      }
  }
  </script>
  
  <style>
  
  </style>