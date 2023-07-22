<template>
  <div>
    <p>Номер доставки в системе: {{ delivery.uuid }}</p>    
    <p>Трек номер доставки: {{ delivery.track_number }}</p>
    <p>Сумма заказа с учетом доставки: {{ delivery.order_delivery_transaction[0].amount }} {{ delivery.order_delivery_transaction[0].amount_currency }}</p>
    <p>Статус доставки: {{ delivery.status }}</p>
    <p>Форма отправки: {{ delivery.delivery_method }}</p>
    <p>Куда: {{ delivery.where }}</p>

  </div>
</template>

<script>
export default {
    props:['delivery']
}
</script>

<style>

</style>