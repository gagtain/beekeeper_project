<template>
    
    <div class="sot-ob">
        <div class="wrapper flex">
            <div class="user_card flex auto">
                <div class="interactiv user_card_div auto" id="checkout">

                    <div class="w-sto kor" id="kor">
    <p class="small-big VAG">Оформление</p>
    <div class="w-sto flex kor_block jus-sp">
        <div style="width: 50%; padding-top: 20px; padding-left: 2%;">

            <client-only>
            <checkout v-on:delivery="delivery_price_select($event)" ref="checkout_form"></checkout>

            </client-only>
            <p align="left" class="VAG small">Товары</p>
            
            <order-product-list :orderList="$store.getUser.basket"></order-product-list>
        </div>
            <div style="width: 40%;" class="register_zakaz">
                <Submit_order :delivery_price="delivery_price" v-on:forms_validate_met="forms_validate_met" :items="$store.getUser.basket" :forms_validate="forms_validate"></Submit_order>
                <ProductListInfo :items="$store.getUser.basket" :delivery_price="delivery_price"></ProductListInfo>
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
</style>
<style lang="css" src="../assets/css/account.css" scoped></style>
<script>
import BasketInfo from '~/components/UserComp/BasketComp/BasketInfo.vue';
import Checkout from '../components/AddtionalComp/Checkout.vue';
import ProductListInfo from '../components/UserComp/BasketComp/ProductListInfo.vue';
import Submit_order from '~/components/AddtionalComp/Submit_order.vue';
import OrderProductList from '~/components/AddtionalComp/OrderProductList.vue';
export default {
    el:"#checkout",
    components:{
    BasketInfo,
    Checkout,
    ProductListInfo,
    Submit_order,
    OrderProductList
},
data(){
    return{
        forms_validate: false,
        delivery_price: 0
    }
},
    methods:{
    forms_validate_met(){
        this.forms_validate = this.$refs.checkout_form.order_info_select()
    },
    async delivery_price_select(delivery_price){

        this.delivery_price = await delivery_price
    }
},

}
</script>