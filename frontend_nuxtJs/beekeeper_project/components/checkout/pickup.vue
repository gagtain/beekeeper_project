<template>
    <div>

      <p class="VAG" align="left">Доставка</p>
      <p class="VAG" align="left">Адресс: Россия, Тамбовская обл Поселок Прогресс ул</p>
        <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Ad6f774796b8ee43fafc04b069f9e5a05a52bd449ab3e11ada5cd6a12821e6305&amp;source=constructor" width="500" height="400" frameborder="0"></iframe>

    </div>
</template>

<script>
export default {
  mounted(){
      let info = {
      id: '-',
      price: 0,
      delivery_type: "Самовывоз"
      }
      this.$emit('onChoise', info)
  },
  methods:{
    order_info_select(){
      return {
        status: true
      }
    }
  }
}
</script>

<style>
</style>