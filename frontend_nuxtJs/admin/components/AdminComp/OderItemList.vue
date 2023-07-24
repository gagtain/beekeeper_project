<template>
    <div id="orderProductList">
        <div v-for="(orderItem, index) in orderList" :key="orderItem.id" class="product_order_info">
                <div class="w-sto flex jus-sp">
                    <p>{{ index+1 }}</p> <p>{{ orderItem.productItem.product.price *  orderItem.count}} {{ orderItem.productItem.product.price_currency }}</p>
                </div>
                <div class="flex">
                    <div class="img_order_product_div">
                    <img class="img_order_product" :src="$api_root + orderItem.productItem.product.image" alt="" />
                  </div>
                  <div class="info_order_product_div">

                    <div class="name_order_product">{{ orderItem.productItem.product.name }} [{{ orderItem.productItem.weight.weight }} гр]</div>
                <p>{{ orderItem.productItem.product.price }} {{ orderItem.productItem.product.price_currency }}</p>
                <p>{{ orderItem.count }} шт</p>
                  </div>
                </div>
                  <slot v-bind:orderItem="orderItem"></slot>
                </div>
    </div>
</template>

<style src="~/assets/styles/new.css"  scoped>
</style>
<style scoped>
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
<script>
export default {
    el: '#orderProductList',
    setup() {
        
    },
    props:['orderList']
    
}
</script>