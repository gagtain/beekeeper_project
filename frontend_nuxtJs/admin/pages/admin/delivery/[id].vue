<template>
  <section class="grid">
    <article style="height: auto; min-height: 300px" class="flex">
      <div
        v-if="delivery != null"
        style="width: 40%"
        class="delivery_info auto flex jus-sp"
      >
        <delivery-info :delivery="delivery"></delivery-info>
        <order-info
          :order="delivery.order_delivery_transaction[0]"
        ></order-info>
      </div>
    </article>
    <div
      v-if="delivery != null"
      style="
        grid-column: 1 / -1;
        min-height: 300px;
        justify-content: space-between;
      "
      class="flex"
    >
      <div style="width: 46%; padding: 3%; background: #fff">
        <p align="center">Товары заказа</p>
        <order-item-list
          :orderList="
            delivery.order_delivery_transaction[0].product_list_transaction
          "
        ></order-item-list>
      </div>
      <div style="width: 46%; padding: 3%; background: #fff">
        <order-settings
         v-on:delivery_info_submit="delivery_info_submit"
         v-on:submit_order="submit_order"
         v-on="submit_waiting"
          :delivery="delivery"
           :order="delivery.order_delivery_transaction[0]"></order-settings>
      </div>
    </div>
  </section>
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
import DeliveryInfo from "~/components/AdminComp/DeliveryInfo.vue";
import getDelivery from "~/http/delivery/getDelivery";
import OrderItemList from "~/components/AdminComp/OderItemList.vue";
import OrderInfo from "~/components/AdminComp/OrderInfo.vue";
import OrderSettings from '../../../components/AdminComp/OrderSettings.vue';
import SubmitOrder from '~/http/orders/SubmitOrder'
export default {
  components: { DeliveryInfo, OrderItemList, OrderInfo, OrderSettings },
  data() {
    return {
      delivery: null
    };
  },

  async mounted() {
    let r = await getDelivery(this.$route.params.id);
    this.delivery = r.data;
    console.log(this.delivery);
  },
  methods: {
    delivery_info_submit(data) {
      this.delivery = data;
    },
    async submit_order(){
        let r = await SubmitOrder(this.order_delivery_transaction[0].id)
        this.order_delivery_transaction[0] = r.data
    },
    async submit_waiting() {
      let r = await deliverySubmitWaiting(this.delivery.id);
      this.delivery = r.data;
    },
  },
};
</script>

<style>
</style>