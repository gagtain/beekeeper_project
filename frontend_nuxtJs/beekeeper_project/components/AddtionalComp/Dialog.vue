<template>
    <dialog :id="ids" class="absolute auto" style="pointer-events: auto;">
        <slot></slot>
        <button @click="closed" aria-label="close" class="x">
          ❌
        </button>
      </dialog>
</template>
<style lang="scss" src="~/assets/css/interactive/checkbox.scss" scoped></style>

<script>

export default{
  props:['id'],
  data(){
    return {ids: null}
  },
  mounted(){
    if (!this.id){
      this.ids = 'dialog'
    }else{
      this.ids = this.id
    }
  },
  methods:{
    closed(){
      let a = document.getElementById(this.ids)
      a.close()
    }
  }
}
</script>