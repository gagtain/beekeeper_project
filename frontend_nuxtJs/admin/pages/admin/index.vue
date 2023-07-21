<template>
  <section class="grid">
    <order-article></order-article>
    <delivery-not-active></delivery-not-active>
    <article></article>
    <article></article>
    <article></article>
    <article></article>
    <article></article>
    <article></article>
  </section>
</template>
<style src="~/assets/styles/new.css">
</style>

<script>
import OrderArticle from '~/components/AdminComp/OrderArticle.vue'
import DeliveryNotActive from '~/components/AdminComp/DeliveryNotActive.vue'
export default {
  components: { OrderArticle, DeliveryNotActive },
    setup() {
        
    },
}
</script>