<template>
    <section v-if="delivery_list" class="grid">
    <article style="padding: 3%; display: flex; height: auto; min-height: 300px;">
        <div class="filter">
            <p>Фильрация</p>
            <div class="flex jus-sp">

            <button @click="filter(`status=${$event.srcElement.innerHTML}`)" class="btn min">На проверке</button>
            <button @click="filter(`status=${$event.srcElement.innerHTML}`)" class="btn min">Ожидание доставки</button>
            <button @click="filter(`status=${$event.srcElement.innerHTML}`)" class="btn min">Отправлен</button>
            <button @click="filter(`status=${$event.srcElement.innerHTML}`)" class="btn min">Ожидает в пункте выдачи</button>
            <button @click="filter(`status=${$event.srcElement.innerHTML}`)" class="btn min">Принят</button>
            <button @click="filter(`status=${$event.srcElement.innerHTML}`)" class="btn min">Отменен</button>
            </div>
        </div>
    </article>
    <article  style="display: block; padding: 3%;" v-for="delivery in delivery_list"  :key="delivery.id">
    <delivery-info :delivery="delivery"></delivery-info>
    <nuxt-link :to="'/admin/delivery/'+delivery.id"><button class="btn"><span>Подробнее</span></button></nuxt-link>
    </article>
  </section>
</template>
<style src="~/assets/styles/new.css"  scoped>
</style>
<style scoped>

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
    width: 70%;
}
@media (max-width: 1000px) {
    .filter{
        width: 100%;
    }
}

</style>
<script>
import SearchDelivery from '~/http/delivery/SearchDelivery'
import DeliveryInfo from '~/components/AdminComp/DeliveryInfo.vue'
export default {
  components: { DeliveryInfo },
    data(){
        return{
            delivery_list: null
        }
    },
    async mounted(){
        let r = await SearchDelivery('')
        this.delivery_list = r.data
    },
    methods: {
        async filter(param_filter){
            let r = await SearchDelivery(param_filter)
            this.delivery_list = r.data
        }
    }
}
</script>

<style>

</style>