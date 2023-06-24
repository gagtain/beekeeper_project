<template>
  <div class="sot-ob">
    <div class="wrapper flex">
      <div class="user_card flex auto" id="user_wrap">
        <div class="interactiv user_card_div auto">
          <div class="flex jus-sp card">
            <UserInfoVue></UserInfoVue>
            <UserInfoRen></UserInfoRen>
        </div>
            <UserBasket></UserBasket>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" src="../assets/css/account.css" scoped></style>
<script setup>
definePageMeta({
  middleware: ["is-auth"]
  // or middleware: 'auth'
})
</script>
<script>
import UserInfoRen from '~/components/UserComp/UserInfoRen.vue';
import UserInfoVue from '~/components/UserComp/UserInfo.vue';
import UserBasket from '~/components/UserComp/UserBasket.vue';
export default {
    components:{
        UserInfoVue,
        UserInfoRen,
        UserBasket
    },
  el: "#user_wrap",
  name: "WrapperUser",
  setup() {},
};
</script>
