<template>
<div>
    <section v-if="order_list" class="grid">
    <article style="padding: 3%; display: flex; height: auto; min-height: 300px;">
        <div class="filter">
            <p>Фильрация</p>
            <div class="flex jus-sp">

            <button @click="filter(`status=${$event.srcElement.innerHTML}&`)" class="btn min">Одобрен</button>
            <button @click="filter(`status=${$event.srcElement.innerHTML}&`)" class="btn min">Не одобренный</button>
            <button @click="filter(`status=${$event.srcElement.innerHTML}&`)" class="btn min">Закрытый</button>
            </div>
        </div>
    </article>
    <article  style="display: block; padding: 3%;" v-for="order in order_list"  :key="order.id">
    <order-info :order="order"></order-info>
    <nuxt-link :to="'/admin/orders/'+order.id"><button class="btn"><span>Подробнее</span></button></nuxt-link>
    </article>
  </section>
  <div class="paginator" v-if="total > 1">
        <button v-if="page > 1" @click="page -= 1" class="button">Назад</button>
        <button  :class="{active: page==1}" @click="page = 1" class="button">{{ 1 }}</button>
        <template v-for="t in total - 1" :key="t">
            <button v-if="t <= page + 2 && t >= page - 2 && t != 1"  :class="{active: page==t}" @click="page = t" class="button">{{ t }}</button>
        </template>
        <button :class="{active: page==total}" @click="page = total" class="button">{{ total }}</button>
            <button v-if="page !== total" @click="page += 1" class="button">Вперед</button>
    </div>
</div>
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
.paginator{
    margin: 15px 0 0 30%;
}
.paginator button{
    background: #fff;
    border: 1px solid #ddd;
    color: #337ab7;;
    text-decoration: none;
    padding: 8px 16px;
}
.paginator button.active{
    background: #337ab7;
    color: #fff;
    border-color: #337ab7;
}
.paginator button:hover{
    background: #ddd;
}
</style>
<script>
import SearchOrders from '~/http/orders/SearchOrders'
import searchCountOrders from '~/http/orders/SearchCountOrders'
import OrderInfo from '../../../components/AdminComp/OrderInfo.vue'
export default {
  components: { OrderInfo },
    data(){
        return{
            order_list: null,
            page: 1,
            total: null,
            params: '',
        }
    },
    watch: {
        page() {
            window.history.pushState(
                null,
                document.title,
                `${window.location.pathname}?page=${this.page}`
            )
                this.getPaginationOrder(this.params, this.page)

        }
    }, 
    async mounted(){
        let filter = ''
        let add_str = ''
        if (this.$route.query.filter){
            filter = this.$route.query.filter
            add_str = '&'
        }
        await this.getPaginationOrder(filter + add_str, this.page) 
        let countDilivery = await searchCountOrders(filter)
        this.total = Math.ceil(countDilivery.data.count/2)
    },
    methods: {
        async filter(param_filter){
            this.page = 1
            await this.getPaginationOrder(param_filter, this.page)
            let countOrder = await searchCountOrders(param_filter)
            this.total = Math.ceil(countOrder.data.count/2)
            
        },
        async getPaginationOrder(params, number){
            this.params = params
            console.log(params)
            let ord = await SearchOrders(params, number*2 - 2, 2)
            this.order_list = ord.data
            console.log(ord.data)
        }
    }
}
</script>

<style>

</style>