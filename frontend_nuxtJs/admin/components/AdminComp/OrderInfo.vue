<template>
  <div>
    <p>Оформил: {{ order.user.FIO }}</p>
    <p>Почта: {{ order.user.email }}</p>
    <p>Общая сумма заказа: {{ order.amount }}</p>
    <p>Статус заказа: {{ order.status }}</p>
  </div>
</template>

<style src="~/assets/styles/new.css"  scoped>
</style>
<script>
export default {
    props:['order']
}
</script>

<style>

</style>