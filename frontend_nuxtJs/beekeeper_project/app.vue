<template>
  <div id="app">
  <headersBase></headersBase>
    <tooltip></tooltip>
    <NuxtPage/>
  <FooterBase></FooterBase>
  <MainMobailMenu v-if="$device.isMobile"></MainMobailMenu>
  </div>
</template>
<style src="assets/css/interactive/interact.css"></style>

<style>



.VAG{
    font-family: 'VAG';
    font-display: swap;
}
*{
  box-sizing: border-box;
  margin: 0;
  color: black;
}
</style>
<script>
import headersBase from './components/HeadersBase.vue'
import FooterBase from './components/FooterBase.vue'
import { useMainStore } from '@/store/index'
import { useHead } from 'nuxt/app'
import Tooltip from './components/AddtionalComp/Tooltip.vue'
export default defineNuxtComponent({
  name: "App",
  el: "#app",
  components:{
    headersBase,
    FooterBase,
    Tooltip
  },
  async asyncData() {
    const stores = useMainStore()
    return {
      store: stores.getCount
    }
  },
  setup(context){
    const { $api_root } = useNuxtApp()

    useHead({
    title: 'Пчелиная артель - Главная',
    meta: [
      { name: 'description', content: 'My amazing site.' }
      
    ],
    link: [{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Roboto&display=swap", media: "print", onload: "this.media='all'" }]
      })
  },
  methods:{
  },
  created(){

  },
  watch: {
}
})
</script>
