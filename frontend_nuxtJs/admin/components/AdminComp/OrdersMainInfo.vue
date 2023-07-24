<template>
    <article>
      <div class="order-not-active">
          <p class="small">Всего не одобренных заказов: <span style="color: blue;">{{ count_orders }}</span> </p>
          
          <NuxtLink to="/admin/orders/?status=Не одобренный" no-prefetch><button class="btn">Посмотреть</button></NuxtLink>
      </div>
    </article>
  </template>
  <style src="~/assets/styles/new.css"  scoped>
  </style>
  <style  scoped>
  .order-not-active{
      padding: 3%;
      width: 100%;
      height: 100%;
  }
  .btn{
      margin-top: 5%;
      padding: 2%;
      color: #fff;
      font-size: 24px;
      background: var(--page-header-bgColor);
      border-radius: 4px;
      width: 100%;
  }
  </style>
  <script>
  import searchCountOrders from '~/http/orders/SearchCountOrders'
  export default {
    data(){
      return {
        count_orders: null
      }
    },
    async mounted(){
      let r = await searchCountOrders("status=Не одобренный")
      this.count_orders = r.data.count
    }
  }
  </script>
  
  <style>
  
  </style>