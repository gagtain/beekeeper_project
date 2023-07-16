<template>
     <div class="sot-ob">
        <div class="wrapper flex w-sto">
            <div class="interactiv auto back">
          <div class="flex w-sto product_div">


<div v-if="news != null" class="card w-sto">
  <div class="card-header VAG small" style="text-align: center;">
    {{ news.title }}
  </div>
  <div v-html="news.context" class="card-body">
    
  </div>
</div>
<loading-comp v-else></loading-comp>
            </div>
            </div>
            </div>
            </div>
</template>
<style src="~/assets/css/news.scss" lang="scss" scoped>

</style>
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
<script>
import newsGet from '~/additional_func/News/newsGet'
import LoadingComp from '../../components/AddtionalComp/LoadingComp.vue'
export default{
  components: { LoadingComp },
    data(){
        return{
            news: null
        }
    },
    async created(){
        let r = await newsGet(this.$route.params.id)
        let data = r.data
        data.context = data.context.replace('src="', `src="${this.$api_root}media/`)
        console.log(data)
        this.news = data
        console.log(this.news)
        let width = window.screen.width
        if (width <= 900){

        data.context = data.context.replace(/width: \d{1,2}%/, `width: 100%`)
        }
        
    },
}

</script>