<template>
<div id="app">

  <headersBase></headersBase>
  <router-view/>
</div>
</template>
<script>
import headersBase from './components/HeadersBase.vue'
export default {
  name: "App",
  el: "#app",
  components:{
    headersBase
  }
};
</script>

<style>
@font-face {
    font-family: 'VAG';
    src: url('assets/css/fonts/1/fonts/vag_world_bold.eot'),
    url('assets/css/fonts/1/fonts/vag_world_bold.woff') format('woff')

}

@import 'assets/css/interactive/interact.css';
@import 'assets/css/interactive/footer.css';
@import 'assets/css/interactive/loaders.css';
@import 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0';
.VAG{
    font-family: 'VAG';
}
</style>
