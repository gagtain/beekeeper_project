<template>
    <div class="sot-ob">
       <div class="wrapper flex w-sto">
           <div class="interactiv auto back">
         <div class="w-sto product_div">
            <div class="flex w-sto">

                <p class=" auto small-big VAG">Новости</p>
            </div>

            <section v-if="news" style="padding: 5%;" class="grid w-sto" >

            <article  v-for="new_obj in news" :key="new_obj.id" class="grid-item" style="max-height: 400px;">
        <div class="image">
            <img :src="this.$api_root + new_obj.main_image.slice(1)" />
        </div>
        <div class="info">
            <NuxtLink :to="`/news/${new_obj.id}`"><h2 style="
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;">{{ new_obj.title }}</h2></NuxtLink>
            <div class="info-text">
                <p>{{ new_obj.main_text.slice(0, 80) }}...</p>
            </div>
            <div class="button-wrap">
              <NuxtLink class="atuin-btn" :to="`/news/${new_obj.id}`">Подробнее</NuxtLink>
            </div>
        </div>
    </article>
            
            </section>
    
<loading-comp v-else></loading-comp>
           </div>
           </div>
           </div>
           </div>
</template>

<style lang="css" src="~/assets/css/news_min.css" scoped></style>
<style scoped>

.product_div {
   background-color: antiquewhite;
   padding: 2%;
   border-radius: 5px;
   height: 100%;
}
.sot-ob{
 
 background: rgb(241, 195, 96);
 min-height: 100vh;
}
.wrapper {
 padding-top: 120px;
 min-height: 100vh;
 padding-bottom: 5%;
 background: url('../../assets/images/sot.png') center no-repeat;

 background-size: cover;
}
.back{
   background: rgb(160, 166, 62);
padding: 2%;
border-radius: 5px;
min-height: 833px;
}
</style>
<script setup>
import { useHead } from "nuxt/app";
useHead({
    title: 'Пчелиная артель - Новости',})
</script>
<script>
import newsList from '~/additional_func/News/newsList';
import LoadingComp from '../../components/AddtionalComp/LoadingComp.vue';
export default {
 components: { LoadingComp },
   data(){
       return{
           news: null
       }
   },
   async created(){
       let r = await newsList(0, 20)
       this.news = r.data
   }
}
</script>