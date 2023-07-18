<template>
    <section v-if="delivery_not_active" class="grid">
    <article style="padding: 3%; display: flex; height: auto; min-height: 300px;">
        <div class="filter">
            <p>Фильрация</p>
            <div class="flex jus-sp">

                <button class="btn min">Не одобренные</button>
            <button class="btn min">Не оформленные</button>
            <button class="btn min">Оформленные</button>
            <button class="btn min">Принятые</button>
            </div>
        </div>
    </article>
    <article  style="display: block; padding: 3%;" v-for="delivery in delivery_not_active"  :key="delivery.id">
    <delivery-info :delivery="delivery"></delivery-info>
    <nuxt-link :to="'/delivery/'+delivery.id"><button class="btn"><span>Подробнее</span></button></nuxt-link>
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
.btn span{
    color: inherit;
}
.btn.min{
    margin: 0;
    font-size: 16px;
    width: auto;
}
.filter{
    width: 45%;
}
@media (max-width: 1000px) {
    .filter{
        width: 100%;
    }
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
        let r = await SearchDelivery('')
        this.delivery_not_active = r.data
    }
}
</script>

<style>

</style>