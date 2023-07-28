<template>
  
  <div class="user_img_profile relative">
      <img  :src="$api_root + $store.getUser.image" alt="" />
      <div class="absolute w-sto h_sto flex">
        <input @change="image_change()" style="display: none;" type="file" src="" id="user_image_input" accept="image/*" alt="">
        <button
        class="auto" style="
        background: rgb(76, 175, 80);
         cursor: pointer;
          width: 100%;
          border: medium none;
           border-radius: 6px;
           font-size: 26px;
           padding: 2%;
           height: auto;" 
           @click="re_image()"
           >
                              Изменить
                            </button>
      </div>
    </div>
</template>
<style>
.user_img_profile img{

    transition: .5s;
}
.user_img_profile:hover img{
    opacity: .5;
    transition: .5s;
}
.user_img_profile:hover .absolute{
    opacity: 1;
    transition: .5s;
}
.user_img_profile .absolute{
    left: 0;
    top: 0;
    opacity: 0;
    transition: .5s;
}

</style>
<style lang="css" src="~/assets/css/account.css" scoped></style>
<script>
import image_edit from '~/additional_func/User/image_edit'
export default {
    methods:{
        re_image(){
            document.getElementById('user_image_input').click()
        },
        async image_change(){
            let image = document.getElementById('user_image_input').files[0]
            let data = new FormData()
            data.append('image', image)
            let r = await image_edit(data)
            this.$store.REFACTOR_USER_IMAGE(r.data.image)
        }
    }
}
</script>

<style>

</style>