<template>
  <div :id="id" :style="isVisible ? '' :'height: 150px;'">
        <slot v-if="isVisible"></slot>
  </div>
</template>

<script>
export default {
    props: ['id'],
    data(){
        return{
            isVisible: false,
            c: 0,
            init: false
        }
    },
mounted(){
const options = {
  threshold: 1.0 // 1 – полная видимость элемента, 0.5 – половина и т.д.
}
const observer = new IntersectionObserver(() => {

    console.log('Я видим')
    this.init = !this.init
}, options);
const target = document.querySelector(`#${this.id}`)
observer.observe(target)
},
watch: {
    'init'(){
        if (this.c == 0){
            this.c = 1
            
        }else{
            this.isVisible = true
        }
    }
}
}
</script>

<style>

</style>