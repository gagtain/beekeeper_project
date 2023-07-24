<template>
  <article>
    <div class="order-not-active">
        <p class="small">Всего неактивных доставок: <span style="color: blue;">{{ count_delivery }}</span> </p>
        
        <NuxtLink to="/admin/delivery/not-active" no-prefetch><button class="btn">Посмотреть</button></NuxtLink>
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
import searchCoundDelivery from '~/http/delivery/SearchCountDelivery'
export default {
  data(){
    return {
      count_delivery: null
    }
  },
  async mounted(){
    let r = await searchCoundDelivery("status=На проверке")
    this.count_delivery = r.data.count
  }
}
</script>

<style>

</style>