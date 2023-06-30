<template>
  <div id="app">
  <headersBase></headersBase>
    <NuxtPage/>
  <FooterBase></FooterBase>
  </div>
</template>
<style src="assets/css/interactive/interact.css"></style>
<style>

@import 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0';


.VAG{
    font-family: 'VAG';
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
