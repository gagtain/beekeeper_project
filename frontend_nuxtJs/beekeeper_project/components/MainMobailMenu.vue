<template>
  <div id="main_mobail_menu">
    <div class="main_mobail_menu_item">
        <NuxtLink to="/" no-prefetch>

<nuxt-img format="webp" src="/images/roof_house_home_opening_icon-icons.com_75451.svg" alt=""/>
        </NuxtLink>
    </div>
    <div class="main_mobail_menu_item">
        <NuxtLink to="/catalog" no-prefetch>

<nuxt-img format="webp" src="/images/catalog_icon_215654.svg" alt=""/>
        </NuxtLink>
    </div>
    <div class="main_mobail_menu_item">
        <NuxtLink to="/basket" no-prefetch>

<nuxt-img format="webp" src="/images/shopping-cart_icon-icons.com_69303.svg" alt=""/>
        </NuxtLink>
    </div>
    <div class="main_mobail_menu_item">
        <NuxtLink to="/profile" no-prefetch>

<nuxt-img format="webp" src="/images/pngwing.com.png" alt=""/>
        </NuxtLink>
    </div>
  </div>
</template>
<style>
#main_mobail_menu{
    left: 0;
    bottom: 0;
    background: rgb(160,166,62);
    box-shadow: 0 4px 20px rgba(0,0,0,.1);
    width: 100%;
    position: fixed;
    z-index: 10000;
    padding: 2% 16px;
    display: flex;
    justify-content: space-around;
}
.main_mobail_menu_item{
    
    height: 28px;
    width: 28px;
}
.main_mobail_menu_item img{
    width: 100%;
    height: 100%;
}
</style>
<script>
export default {

}
</script>

<style>

</style>