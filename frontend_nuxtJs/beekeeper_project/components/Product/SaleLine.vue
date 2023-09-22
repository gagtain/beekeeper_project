<template>
  <div class="ribbon ribbon-top-right"><span>скидка {{ sale_ }}%</span></div>
</template>

<script>
export default {

    props:['old_price', 'price'],
    data(){
        return{
            sale_: 0
        }
    },
    created(){
        this.sale_ = this.price / this.old_price * 100
    }
}
</script>

<style>

/* common */
.ribbon {
  width: 100px;
  height: 100px;
  overflow: hidden;
  position: absolute;
}
.ribbon::before,
.ribbon::after {
  position: absolute;
  z-index: -1;
  content: '';
  display: block;
  border: 3px solid rgba(255, 196, 86, 0.795);
}
.ribbon span {
  position: absolute;
  display: block;
  width: 165px;
  padding: 5px 0;
  background-color: rgba(255, 196, 86, 0.795);
  box-shadow: 0 5px 10px rgba(0,0,0,.1);
}

/* top right*/
.ribbon-top-right {
  top: -3px;
  right: -3px;
}
.ribbon-top-right::before,
.ribbon-top-right::after {
  border-top-color: transparent;
  border-right-color: transparent;
}
.ribbon-top-right::before {
  top: 0;
  left: 0;
}
.ribbon-top-right::after {
  bottom: 0;
  right: 0;
}
.ribbon-top-right span {
  left: -22px;
  top: 30px;
  transform: rotate(45deg);
}

</style>