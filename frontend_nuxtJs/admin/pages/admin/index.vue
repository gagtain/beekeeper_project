<template>
  <section class="grid">
    <order-article></order-article>
    <delivery-not-active></delivery-not-active>
    <orders-main-info></orders-main-info>
    <article></article>
    <article></article>
    <article></article>
    <article></article>
    <article></article>
  </section>
</template>
<style src="~/assets/styles/new.css" scoped>
</style>

<script>
import OrderArticle from '~/components/AdminComp/OrderArticle.vue'
import DeliveryNotActive from '~/components/AdminComp/DeliveryNotActive.vue'
import OrdersMainInfo from '../../components/AdminComp/OrdersMainInfo.vue'
export default {
  components: { OrderArticle, DeliveryNotActive, OrdersMainInfo },
    setup() {
        
    },
}
</script>