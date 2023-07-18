<template>
  
  <section class="grid">
    <article style="height: auto; min-height: 300px;" class="flex">
        <div v-if="delivery != null" class="delivery_info auto ">
            <delivery-info :delivery="delivery"></delivery-info>
        </div>
    </article>
    <div v-if="delivery != null" style="grid-column: 1 / -1; min-height: 300px; justify-content: space-between;" class="flex">
        <div style="width: 46%; padding: 3%; background: #fff;">
            <p align="center">Товары заказа</p>
            <order-item-list  :orderList="delivery.order_delivery_transaction[0].product_list_transaction"></order-item-list>
        </div>
        <div style="width: 46%; padding: 3%; background: #fff;">
            <button v-if="delivery.status == 'На проверке'" class="btn" @click="submit_waiting">Подтвердить заказ</button>
            <delivery-info-submit v-on:delivery_info_submit="delivery_info_submit($event)" :delivery="delivery" v-else-if="delivery.status == 'Ожидание доставки'" style="margin-top: 2%;"></delivery-info-submit>
            <button class="btn">Отменить заказ</button>
            <button class="btn" v-if="delivery.status == 'Отправлен'">Отследить заказ</button>
        </div>
    </div>
  </section>
</template>

<style>

.btn{
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
import DeliveryInfo from '../../components/AdminComp/DeliveryInfo.vue'
import getDelivery from '~/http/delivery/getDelivery'
import deliverySubmitWaiting from '~/http/delivery/deliverySubmitWaiting'
import OrderItemList from '~/components/AdminComp/OderItemList.vue'
import DeliveryInfoSubmit from '../../components/AdminComp/DeliveryInfoSubmit.vue'
export default {
  components: { DeliveryInfo, OrderItemList, DeliveryInfoSubmit },
  data(){
    return{
        delivery: null
    }
  }, 
  
  async mounted(){
    let r = await getDelivery(this.$route.params.id)
    this.delivery = r.data
    console.log(this.delivery)
    },
    methods:{
        async submit_waiting(){
            let r = await deliverySubmitWaiting(this.delivery.id)
            this.delivery = r.data
        },
        delivery_info_submit(data){
            this.delivery = data
        }
    }
}
</script>

<style>

</style>