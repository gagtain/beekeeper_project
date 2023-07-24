<template>
  <div>
    <p>Номер доставки в системе: {{ delivery.uuid }}</p>    
    <p>Трек номер доставки: {{ delivery.track_number }}</p>
    <p>Статус доставки: {{ delivery.status }}</p>
    <p>Форма отправки: {{ delivery.delivery_method }}</p>
    <p>Куда: {{ delivery.where }}</p>

  </div>
</template>

<style src="~/assets/styles/new.css"  scoped>
</style>
<script>
export default {
    props:['delivery']
}
</script>

<style>

</style>