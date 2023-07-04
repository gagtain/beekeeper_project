<template>
    <div id="sub_order_ref" class="w-sto">
        <RouterLink v-if="items.length" to="/checkout"> <button class="w-sto"> <div class="fon_btn"></div>Оформить</button></RouterLink>
      <RouterLink v-else to="/catalog"><button class="w-sto"> <div class="fon_btn"></div> Добавить товар</button></RouterLink>

    </div>
</template>

<style src="~/assets/css/account.css" scoped></style>
<script>
export default {
    el: 'sub_order_ref',
  props: ['items'],
}
</script>