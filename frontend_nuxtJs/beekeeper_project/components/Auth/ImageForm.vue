<template>
    <div id="imageForm" @click="login_img_active = !login_img_active"
          :style="login_img_active ? 'width: 400px' : ''"
          v-if="width>700" class="form login-f log-img"></div>
</template>

<script>
export default {
  el: "#imageForm",
  data() {
    return {
      width: 1000,
      login_img_active: false
    };
  },
  mounted() {
    this.updateWidth();
    window.addEventListener("resize", this.updateWidth);
    
  }, 
  methods: {
    
    updateWidth() {
      this.width = window.innerWidth;
    },
  },
}
</script>