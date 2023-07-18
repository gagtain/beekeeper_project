<template>
  <article>
    <div class="order-not-active">
        <p class="small">Всего неактивных доставок: <span style="color: blue;">100</span> </p>
        
        <NuxtLink to="/delivery/not-active" no-prefetch><button class="btn">Посмотреть</button></NuxtLink>
    </div>
  </article>
</template>
<style>
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
export default {

}
</script>

<style>

</style>