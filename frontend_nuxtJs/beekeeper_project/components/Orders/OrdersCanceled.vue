<template>
    <div v-if="!status">
        <p class="normal-small VAG">Пожалуйста, напишите причину вашего отказа</p>
        <textarea style="width: 100%;" v-model="description"  rows="10"></textarea>
        <button @click="submit_closed_order()" style="background: rgb(255, 175, 70); cursor: pointer; width: 100%; border: medium none; border-radius: 6px;font-size: 26px;padding: 2%;margin-top: 5%;" >
                              Подтвердить
                            </button>
    </div>
    <div class="w-sto h_sto flex" v-else>
        <p class="normal-small VAG">Успешно</p>
    </div>
</template>

<script>
import ClosedOrder from '~/additional_func/Orders/ClosedOrder'
export default {
    props:['order_id'],
    data(){
        return{
            description: '',
            status: false
        }
    },
    methods:{
        async submit_closed_order(){
            console.log(this.order_id)
            await ClosedOrder(this.order_id, this.description)
            this.status = true
        }
    }
}
</script>

<style>

</style>