<template>
  <div>
    <button
          v-if="
            delivery.status == 'На проверке' &&
            order.status == 'Одобрен'
          "
          class="btn"
          @click="submit_waiting"
        >
          Подтвердить доставку
        </button>
        <button
          v-if="
            order.status == 'Не одобренный' && order.payment == 'succeeded'
          "
          class="btn"
          @click="submit_order()"
        >
          Подтвердить заказ
        </button>
        <delivery-info-submit
          v-on:delivery_info_submit="delivery_info_submit($event)"
          :delivery="delivery"
          v-else-if="delivery.status == 'Ожидание доставки'"
          style="margin-top: 2%"
        ></delivery-info-submit>
        <order-status-closed
        style="margin-top: 3%;"
        v-on:order_status_closed="order_status_closed"
          v-if="
            delivery.status == 'На проверке' &&
            order.status != 'Одобрен'
          " :order="order">
          </order-status-closed>
        <button class="btn" v-if="delivery.status == 'Отправлен'">
          Отследить заказ
        </button>
  </div>
</template>

<style src="~/assets/styles/new.css"  scoped>
</style>
<style scoped>
.btn {
  margin-top: 5%;
  padding: 2%;
  color: var(--page-header-txtColor);
  font-size: 24px;
  background: var(--page-header-bgColor);
  border-radius: 4px;
  width: 100%;
}
</style>
<script>
import DeliveryInfoSubmit from './DeliveryInfoSubmit.vue';
import OrderStatusClosed from './OrderStatusClosed.vue';
export default {
  components: { DeliveryInfoSubmit, OrderStatusClosed },
    props:['order','delivery'],
    methods: {
        
    async submit_waiting() {
      this.$emit('submit_waiting')
    },
    delivery_info_submit(data) {
      this.$emit('delivery_info_submit', data)
    },
    async submit_order(){
      this.$emit('submit_order')
    },
    order_status_closed(event){
      console.log(event)
      this.delivery.order_delivery_transaction[0] = event
      this.delivery.status = "Отменен"
    }
    },
}
</script>

<style>

</style>