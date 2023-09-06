<template>
  <div v-if="$store.getTooltip.status" class="fixed tooltip w-sto h_sto flex">
    <div class="interactiv relative h_sto">

    <div class="tooltip_div absolute">

        <p class="auto">{{ $store.getTooltip.title }}</p>
    </div>
    </div>
  </div>
</template>

<script>
export default {
    mounted(){
        console.log('tooltip')
    },
    watch:{
        '$store.getTooltip.status'(n, p){
            if (n){
                setTimeout(() => {
                    this.$store.REFACTOR_TOOLTIP({
                        status: false,
                        title: ''
                    })
                }, 2000)
                
            }                
            }        
        }
    }
</script>

<style>
.tooltip{
    z-index: 100;
    pointer-events: none;
}
.tooltip_div{
    right: 2%;
    top: 20%;
    background: rgba(255, 255, 255, .9);
    padding: 5px 10px;
    border-radius: 5px;
}
</style>