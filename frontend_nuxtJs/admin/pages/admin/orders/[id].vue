<template>
  <section class="grid">
    <article style="height: auto; min-height: 300px" class="flex">
      <div
        v-if="order != null"
        style="width: 40%"
        class="delivery_info auto flex jus-sp"
      >
        <delivery-info :delivery="order.delivery"></delivery-info>
        <order-info
          :order="order"
        ></order-info>
      </div>
    </article>
    <div
      v-if="order != null"
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
            order.product_list_transaction
          "
        ></order-item-list>
      </div>
      <div style="width: 46%; padding: 3%; background: #fff">
        <order-settings
         v-on:delivery_info_submit="delivery_info_submit"
         v-on:submit_order="submit_order"
         v-on="submit_waiting"
          :delivery="order.delivery"
           :order="order"></order-settings>
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
import getOrder from '~/http/orders/getOrder'
import OrderItemList from "~/components/AdminComp/OderItemList.vue";
import OrderInfo from "~/components/AdminComp/OrderInfo.vue";
import OrderSettings from '../../../components/AdminComp/OrderSettings.vue';
export default {
  components: { DeliveryInfo, OrderItemList, OrderInfo, OrderSettings },
  data() {
    return {
      order: null
    };
  },

  async mounted() {
    let r = await getOrder(this.$route.params.id);
    this.order = r.data;
  },
  methods: {
    delivery_info_submit(data) {
      this.order.delivery = data;
    },
    async submit_order(){
        let r = await SubmitOrder(this.order.id)
        this.order = r.data
    },
    async submit_waiting() {
      let r = await deliverySubmitWaiting(this.order.delivery.id);
      this.order.delivery = r.data;
    },
  },
};
</script>

<style>
</style>