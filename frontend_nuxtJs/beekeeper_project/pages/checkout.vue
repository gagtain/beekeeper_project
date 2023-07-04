<template>
    
    <div class="sot-ob">
        <div class="wrapper flex">
            <div class="user_card flex auto">
                <div class="interactiv user_card_div auto" id="checkout">

                    <div class="w-sto kor" id="kor">
    <p class="small-big VAG">Оформление</p>
    <div class="w-sto flex kor_block jus-sp">
        <div style="width: 50%; padding-top: 20px; padding-left: 2%;">

            <checkout></checkout>
            <p align="left" class="VAG small">Товары</p>
            <div v-for="(orderItem, index) in $store.getUser.basket" :key="orderItem.id" class="product_order_info">
                <div class="w-sto flex jus-sp">
                    <p class="VAG">{{ index+1 }}</p> <p class="VAG">{{ orderItem.productItem.product.price *  orderItem.count}} {{ orderItem.productItem.product.price_currency }}</p>
                </div>
                <div class="flex">
                    <div class="img_order_product_div">
                    <img class="img_order_product" :src="$api_root + orderItem.productItem.product.image" alt="" />
                  </div>
                  <div class="info_order_product_div">

                    <div class="name_order_product">{{ orderItem.productItem.product.name }} [{{ orderItem.productItem.weight.weight }} гр, {{ orderItem.productItem.type_packaging.name }}]</div>
                <p>{{ orderItem.productItem.product.price }} {{ orderItem.productItem.product.price_currency }}</p>
                <p>{{ orderItem.count }} шт</p>
                  </div>
                </div>
                  
                </div>
        </div>
            <div style="width: 40%;" class="register_zakaz">
                <Submit_order :items="$store.getUser.basket"></Submit_order>
                <ProductListInfo :items="$store.getUser.basket"></ProductListInfo>
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
export default {
    el:"#checkout",
    components:{
    BasketInfo,
    Checkout,
    ProductListInfo,
    Submit_order
},
    methods:{
        async submin_order(){
      let response_order = await addOrder()
      if (response_order.status == 200){
        this.$router.push('/orders')
      }
    }
}
}
</script>