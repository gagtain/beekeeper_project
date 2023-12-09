<template>
    
    <div class="sot-ob">
        <div class="wrapper flex">
            <div class="user_card flex auto">
                <div class="interactiv user_card_div auto" id="checkout">

                    <div class="w-sto kor" id="kor">
    <p class="small-big VAG">Оформление</p>
    <div v-if="order" class="w-sto flex kor_block jus-sp">
        <div class="w-sto-1000px checkout">
            <div class="select_type_list flex jus-sp">
                <button style="width: 25%" class="default_btn"
                 :class="type_checkout == 1 ? 'active' : ''"
                 @click="set_type_checkout(1)" >
                    СДЭК
                </button>
                <button style="width: 25%" class="default_btn" :class="type_checkout == 2 ? 'active' : ''"
                @click="set_type_checkout(2)" >
                    Самовывоз
                </button>
                <button style="width: 25%" class="default_btn" :class="type_checkout == 3 ? 'active' : ''"
                @click="set_type_checkout(3)" >
                    Наша доставка
                </button>
            </div>
            <client-only>
            <Checkouts v-on:delivery="delivery_price_select($event)" ref="checkout_form" :type="type_checkout"></Checkouts>

            </client-only>
            <p align="left" class="VAG small">Товары</p>
            <order-product-list :orderList="order.product_list_transaction"></order-product-list>
        </div>
            <div class="w-sto-1000px register_zakaz">
                <Submit_order ref="sub_order" :order_id="order.id" :delivery_info="delivery_info"
                 v-on:forms_validate_met="forms_validate_met"
                  :items="order.product_list_transaction"
                   :forms_validate="forms_validate"></Submit_order>
                <ProductListInfo :order_amount="order.amount"
                 :ordered="true"
                  :items="order.product_list_transaction"
                   :delivery_price="delivery_info.price"></ProductListInfo>
            </div>
                    
                </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.img_order_product_div{
    width: 80px;
}
.img_order_product{
    width: 100%;
    aspect-ratio: 1/1;
}
.product_order_info{
    padding: 2%;
}
.info_order_product_div{
    padding: 2% 1%;
    text-align: left;
}
.order_description{
    text-align: left;
}
.checkout{
    width: 50%; padding-top: 20px; padding-left: 2%;
}
.register_zakaz{
    width: 40%;
}
@media (max-width: 1000px) {
    .order{
        display: block;
    }
    .order_description, .product_order{
        width: 100%;
    }
}
@media (max-width: 500px) {
    .order{
        width: 100%;
    }
    
}
@media (max-width: 1000px) {
    .w-sto-1000px{
        width: 100%;
    }
}
.default_btn.active{
    background-color: yellow;
}
</style>
<style lang="css" src="../assets/css/account.css" scoped></style>
<script>
import BasketInfo from '~/components/UserComp/BasketComp/BasketInfo.vue';
import Checkouts from '../components/AddtionalComp/Checkout.vue';
import ProductListInfo from '../components/UserComp/BasketComp/ProductListInfo.vue';
import Submit_order from '~/components/AddtionalComp/Submit_order.vue';
import OrderProductList from '~/components/AddtionalComp/OrderProductList.vue';
import createCheckout from '~/additional_func/Orders/createCheckout'
import getOrder from '~/additional_func/Orders/getOrder'

import checkout_enum from '~/enum/checkout'


export default {
    el:"#checkout",
    components:{
    BasketInfo,
    Checkouts,
    ProductListInfo,
    Submit_order,
    OrderProductList
},
setup(){

definePageMeta({
  middleware: ["is-auth"]
  // or middleware: 'auth'
})
useHead({
    title: 'Пчелиная артель - Оформление заказа',script: [
        { hid: 'stripe', src: 'https://cdn.jsdelivr.net/gh/cdek-it/widget@3/dist/cdek-widget.umd.js', defer: true }
      ]})
},
data(){
    return{
        forms_validate: false,
        delivery_info: {
            price: null
        },
        order: null,
        type_checkout: checkout_enum.delivery_price
    }
},
    async created(){
        let r = await createCheckout('__all__')
        if (!r.data){
            this.order = {
    "id": 1,
    "amount": "0.000",
    "amount_currency": "RUB",
    "product_list_transaction": [],
    "delivery": null,
    "datetime": "2023-12-09T12:21:20.096779+03:00",
    "payment": null,
    "status": "Не подтвержденный"
}
            let order_id = 1
        }else{

            let order_id = r.data.order_id
        let order_r = await getOrder(order_id)
        this.order = order_r.data
        }
        
    },
    methods:{

    set_type_checkout(number){
        if (number == 2){
            this.delivery_info = {
                price: 0
            }
        }
        if (number != 1){
            this.$refs.sub_order.set_type('offline')
        }else{

            this.$refs.sub_order.set_type('online')
        }
        this.type_checkout = number
    },
    
    forms_validate_met(){
        this.forms_validate = this.$refs.checkout_form.order_info_select()
    },
    async delivery_price_select(delivery_info){

        this.delivery_info = await delivery_info
    }
},

}
</script>