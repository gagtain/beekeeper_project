<template>
    <div id="imageForm" @click="login_img_active = !login_img_active"
          :style="login_img_active ? 'width: 400px' : ''"
          v-if="$device.isDesktop" class="form login-f log-img"></div>
</template>

<script>
export default {
  el: "#imageForm",
  data() {
    return {
      login_img_active: false
    };
  },
    
  methods: {
    
  },
}
</script>