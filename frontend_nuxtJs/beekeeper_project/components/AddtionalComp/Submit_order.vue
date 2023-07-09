<template>
    <div id="sub_order" class="w-sto">
        <RouterLink v-if="items.length" to="/checkout"> <button @click="submin_order" class="w-sto"> <div class="fon_btn"></div>Оплатить онлайн</button></RouterLink>
      <RouterLink v-else to="/catalog"><button class="w-sto"> <div class="fon_btn"></div> Добавить товар</button></RouterLink>
   
    </div>
</template>

<style src="~/assets/css/account.css" scoped></style>
<script>
import addOrder from '~/additional_func/addOrder';
export default {
    el: '#sub_order',
  props: ['items', 'forms_validate'],
  methods:{

async submin_order(){
    await this.$emit('forms_validate_met')
  if (this.forms_validate.status){
    let response_order = await addOrder(this.forms_validate.adress, this.forms_validate.index)
  if (response_order.status == 200){
    this.$router.push('/orders')
  }
  }
  
  
}
}
}
</script>