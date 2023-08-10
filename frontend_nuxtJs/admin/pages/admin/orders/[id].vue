<template>
  <div>
    <section class="grid">
      <article style="height: auto; min-height: 300px" class="flex">
        <div
          v-if="order != null"
          style="width: 40%"
          class="delivery_info auto flex jus-sp"
        >
          <delivery-info :delivery="order.delivery"></delivery-info>
          <order-info :order="order"></order-info>
          <payment-info :payment="order.payment"></payment-info>
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
            :orderList="order.product_list_transaction"
          ></order-item-list>
        </div>
        <div style="width: 46%; padding: 3%; background: #fff">
          <order-settings
            v-on:delivery_info_submit="delivery_info_submit"
            v-on:submit_order="submit_order"
            v-on:submit_waiting="submit_waiting"
            v-on:order_status_closed="order_status_closed"
            :delivery="order.delivery"
            :order="order"
          ></order-settings>
        </div>
      </div>
    </section>
    <div
      style="
        height: auto;
        min-height: 300px;
        width: 100%;
        background-color: #fff;
        margin-top: 30px;
        padding: 2% 3%;
      "
      class="flex"
    >
      <button
        class="btn"
        v-if="!dilevery_auto"
        @click="dilevery_auto = !dilevery_auto"
      >
        Автозаполенение
      </button>
      <div v-else-if="dilevery_info" style="width: 100%; height: 100%">
        <p align="center">Инфо о доставке</p>
        <p>Пункт доставки</p>
        <input
          disabled
          v-model="dilevery_info.delivery_point"
          type="text"
          name=""
          id=""
          style="margin-top: 10px"
        />
        <p align="center">Упаковки</p>
        <div
          v-for="pack in dilevery_info.packages"
          :key="pack.number"
          style="width: 100%"
        >
          <br />
          <div @click="showContent(pack)" class="spoiler_title" align="center">
            {{ pack.number }}
            <span
              :class="{ open: openContent == pack.number }"
              class="spoiler_arrow"
              ><svg viewBox="-122.9 121.1 105.9 61.9">
                <path
                  d="M-63.2 180.3l43.5-43.5c1.7-1.7 2.7-4 2.7-6.5s-1-4.8-2.7-6.5c-1.7-1.7-4-2.7-6.5-2.7s-4.8 1-6.5 2.7L-69.9 161l-37.2-37.2c-1.7-1.7-4-2.7-6.5-2.7s-4.8 1-6.5 2.6c-1.9 1.8-2.8 4.2-2.8 6.6 0 2.3.9 4.6 2.6 6.5 11.4 11.5 41 41.2 43 43.3l.2.2c3.6 3.6 10.3 3.6 13.9 0z"
                ></path></svg>
            </span>
          </div>
          <div
            :class="{ open: openContent == pack.number }"
            class="spoiler_content"
          >
            <p>Высота</p>
            <input disabled v-model="pack.height" type="text" />
            <p>Длина</p>
            <input disabled v-model="pack.length" type="text" />
            <p>Вес</p>
            <input disabled v-model="pack.weight" type="text" />
            <p>Ширина</p>
            <input v-model="pack.width" type="text" />
            <p align="center">Товары</p>
            <div
              style="width: 100%"
              v-for="item in pack.items"
              :key="item.ware_key"
            >
              <p>Количество</p>
              <input disabled v-model="item.amount" type="text" />
              <p>Цена</p>
              <input disabled v-model="item.cost" type="text" />
              <p>Название</p>
              <input disabled v-model="item.name" type="text" />
              <p>Оплата</p>
              <input disabled v-model="item.payment.value" type="text" />
              <p>Идентификатор товара</p>
              <input disabled v-model="item.ware_key" type="text" />
              <p>Вес товара</p>
              <input disabled v-model="item.weight" type="text" />
              <br />
              <hr />
              <br />
            </div>
            <button disabled @click="additem(pack)" class="btn">Добавить товар</button>
          </div>
        </div>
        <button disabled @click="addpackages()" class="btn">Добавить упаковку</button>
        <p>Получатель</p>
        <input disabled v-model="dilevery_info.recipient.name" type="text" />
        <input disabled
          v-for="phone in dilevery_info.recipient.phones"
          :key="phone.number"
          v-model="phone.number"
          type="text"
        />
        <p>Отправитель</p>
        <input v-model="dilevery_info.sender.company" type="text" />
        <input v-model="dilevery_info.sender.name" type="text" />
        <p>Место отгрузки</p>
        <input disabled v-model="dilevery_info.shipment_point" type="text" />
        <p>Тарифный код</p>
        <input disabled v-model="dilevery_info.tariff_code" type="text" />
        <p>Тип</p>
        <input disabled v-model="dilevery_info.type" type="text" />
        <button @click="deliveryInit()" style="background-color: green;" class="btn">Оформить доставку</button>
      </div>
    </div>
  </div>
</template>

<style src="~/assets/styles/new.css" scoped></style>
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
input {
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  border-radius: 5px;
  margin: 0 0 15px;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
}
.spoiler_title .spoiler_arrow {
  display: inline-block;
  margin-left: 15px;
  font-size: 20px;
  transition: all 0.1s;
  vertical-align: middle;
}

.spoiler_title .spoiler_arrow svg {
  fill: red;
  width: 13px;
}
.spoiler_title .spoiler_arrow.open {
  transform: rotate(180deg);
}
.spoiler_title {
  cursor: pointer;
}
.spoiler_content {
  padding-top: 0;
  padding-bottom: 10px;
  transition: 0.15s ease-out;
  height: auto;
  max-height: 0px;
  overflow: hidden;
  margin-top: -10px;
  opacity: 0;
  font-size: 14px;
  color: #444;
}

.spoiler_content {
  font-size: 16px;
  margin: 20px 0;
  color: #333;
  line-height: 1.4;
}

.spoiler_content.open {
  margin-top: 0;
  max-height: 100%;
  opacity: 1;
}
</style>
<script>
import DeliveryInfo from "~/components/AdminComp/DeliveryInfo.vue";
import getOrder from "~/http/orders/getOrder";
import OrderItemList from "~/components/AdminComp/OderItemList.vue";
import OrderInfo from "~/components/AdminComp/OrderInfo.vue";
import deliverySubmitWaiting from "~/http/delivery/deliverySubmitWaiting";
import OrderSettings from "../../../components/AdminComp/OrderSettings.vue";
import SubmitOrder from "~/http/orders/SubmitOrder";
import PaymentInfo from "../../../components/AdminComp/PaymentInfo.vue";
import getInfoDelivery from "~/http/delivery/getInfoDelivery";
import initDeviverySdek from "~/http/delivery/initDeliverySdek";
export default {
  components: {
    DeliveryInfo,
    OrderItemList,
    OrderInfo,
    OrderSettings,
    PaymentInfo,
  },
  data() {
    return {
      order: null,
      dilevery_auto: false,
      dilevery_info: null,
      openContent: null,
    };
  },

  async mounted() {
    let r = await getOrder(this.$route.params.id);
    this.order = r.data;

    let r1 = await getInfoDelivery(this.order.delivery.id);
    this.dilevery_info = r1.data;
    console.log(r1.data);
  },
  methods: {
    delivery_info_submit(data) {
      this.order.delivery = data;
    },
    async submit_order() {
      let r = await SubmitOrder(this.order.id);
      this.order = r.data;
    },
    async submit_waiting() {
      console.log(123);
      let r = await deliverySubmitWaiting(this.order.delivery.id);
      this.order.delivery = r.data;
    },
    order_status_closed(event) {
      this.order = event;
    },
    showContent(p) {
      if (p.number == this.openContent) {
        this.openContent = null;
      } else {
        this.openContent = p.number;
      }
    },
    addpackages() {
      this.dilevery_info.packages.push({
        number: `Упаковка №${this.dilevery_info.packages.length + 1}`,
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        items: [
          {
            name: "",
            ware_key: "5",
            payment: {
              value: 0,
            },
            cost: 0,
            weight: 0,
            amount: 0,
          },
        ],
      });
    },
    additem(packeg) {
      console.log(packeg);
      packeg.items.push({
        name: "",
        ware_key: "5",
        payment: {
          value: 0,
        },
        cost: 0,
        weight: 0,
        amount: 0,
      });
    },
    async deliveryInit() {
      await initDeviverySdek(this.order.delivery.id, this.dilevery_info)
    }
  },
};
</script>

<style></style>
