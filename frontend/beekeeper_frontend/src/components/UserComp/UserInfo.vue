<template>
<div class="user_info_menu">
  <div class="user_info auto h_sto" id="user_info">
    <div class="user_img_profile">
      <img  :src="$api_root + USER_STATE.image" alt="" />
    </div>
    <p class="small user_name_profile">{{ USER_STATE.username }}</p>
    <p class="small user_name_profile">{{ USER_STATE.FIO }}</p>
    <div class="menu_user flex jus-sp auto">
      <div class="favorite">
        <img
          class="user_menu_img"
          height="100%"
          :src="$api_root +  'static/online_store/images/favorite/favorite_add.png'"
          alt=""
        />
        <p class="very-small">Избранное</p>
      </div>
      
    </div>
  </div>
  </div>
</template>
<style lang="css" src="../../assets/css/account.css" scoped></style>
<style>
.user_img_profile img{
    width:100%;
     height:100%
}
</style>
<script>
import {mapGetters} from 'vuex'
export default {
    el: '#user_info',
    name: 'UserInfo',
  setup() {},
    watch:{
      'USER_STATE.basket'(){
        console.log('корзина изменен')
      }
    },
  computed:{
    ...mapGetters([
        'USER_STATE'
    ])
  }
};
</script>
