<template>
  <div id="app">
  <headersBase></headersBase>
    <NuxtPage/>
  <FooterBase></FooterBase>
  <MainMobailMenu></MainMobailMenu>
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
export default defineNuxtComponent({
  name: "App",
  el: "#app",
  components:{
    headersBase,
    FooterBase
  },
  async asyncData() {
    const stores = useMainStore()
    return {
      store: stores.getCount
    }
  },
  setup(context){
    const { $api_root } = useNuxtApp()
  },
  methods:{
  },
  created(){

  },
  watch: {
}
})
</script>
