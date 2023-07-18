<template>
    <section v-if="delivery_not_active" class="grid">
    <article>*В разработке*</article>
    <article  style="display: block; padding: 3%;" v-for="delivery in delivery_not_active"  :key="delivery.id">
    <delivery-info :delivery="delivery"></delivery-info>
    <nuxt-link :to="'/delivery/'+delivery.id"><button class="btn">Подробнее</button></nuxt-link>
    </article>
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
import SearchDelivery from '~/http/delivery/SearchDelivery'
import DeliveryInfo from '../../components/AdminComp/DeliveryInfo.vue'
export default {
  components: { DeliveryInfo },
    data(){
        return{
            delivery_not_active: null
        }
    },
    async mounted(){
        let r = await SearchDelivery("status=На проверке")
        this.delivery_not_active = r.data
    }
}
</script>

<style>

</style>