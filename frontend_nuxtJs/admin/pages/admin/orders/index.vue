<template>
    <section v-if="order_list" class="grid">
    <article style="padding: 3%; display: flex; height: auto; min-height: 300px;">
        <div class="filter">
            <p>Фильрация</p>
            <div class="flex jus-sp">

            <button @click="filter(`status=${$event.srcElement.innerHTML}`)" class="btn min">Одобрен</button>
            <button @click="filter(`status=${$event.srcElement.innerHTML}`)" class="btn min">Не одобренный</button>
            <button @click="filter(`status=${$event.srcElement.innerHTML}`)" class="btn min">Закрытый</button>
            </div>
        </div>
    </article>
    <article  style="display: block; padding: 3%;" v-for="order in order_list"  :key="order.id">
    <order-info :order="order"></order-info>
    <nuxt-link :to="'/admin/orders/'+order.id"><button class="btn"><span>Подробнее</span></button></nuxt-link>
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
    width: 60%;
}
@media (max-width: 1000px) {
    .filter{
        width: 100%;
    }
}

</style>
<script>
import SearchOrders from '~/http/orders/SearchOrders'
import OrderInfo from '../../../components/AdminComp/OrderInfo.vue'
export default {
  components: { OrderInfo },
    data(){
        return{
            order_list: null
        }
    },
    async mounted(){
        let filter = ''
        if (this.$route.query.status){
            filter = `status=${this.$route.query.status}`
        }
        let r = await SearchOrders(filter)
        this.order_list = r.data
    },
    methods: {
        async filter(param_filter){
            let r = await SearchOrders(param_filter)
            this.order_list = r.data
        }
    }
}
</script>

<style>

</style>