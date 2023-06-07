<template>

    <div class="sot-ob">
        <div class="wrapper flex">
            <div class="user_card flex auto">
                <div class="interactiv user_card_div auto" id="favorite_main">

                    <div class="w-sto kor">
                        <p class="small-big VAG">Избранное</p>
                        <div class="w-sto flex">
    <div class="w-sto">
    <div v-for="b, index in USER_STATE.favorite_product" :key="index"  class="tovar w-sto flex">
    <div class="tovar_kor_img_div">
      <img
        class="tovar_kor_img"
        :src="$api_root + b.image"
        alt=""
      />
    </div>
    <div class="info_tovar_kor flex jus-sp">
      <div class="info_tovar_kor_osnov">
        <p class="normal-small tovar_kor_name">{{ b.name }}</p>

        <p class="normal-small info_in_tovar_kor description">
          {{ b.description }}
        </p>
        <div class="btn_tovar_kor flex">
          <FavoriteComp :id="b.id"></FavoriteComp>
          <AddBasket :id="b.id"></AddBasket>
        </div>
      </div>
      <div class="size_tovar_div">
        <div class="size_tovar_kor">
          <div class="select_size">
            <p class="normal-small raz">размер</p>
            <select name="select" class="size auto">
              <option value="value1">100 гр</option>
              <option value="value2" selected>200 гр</option>
              <option value="value3">250 гр</option>
            </select>
            <p class="normal-small kolvo">количество</p>
            <input
              type="number"
              value="1"
              max="22"
              class="size auto"
              name=""
              id=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>

                </div>
            </div>
        </div>
    </div>
    </div>
    </div>
</template>


<style lang="css" src="../assets/css/account.css"></style>

<style>
.tovar_kor_img_div img{
    width: 100%;
    height: 100%;
}
.description{
    max-width: 90%;
    text-overflow: ellipsis;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
<script>
import AddBasket from './UserComp/BasketComp/AddBasket.vue'
import FavoriteComp from './UserComp/BasketComp/FavoriteComp.vue'
import {mapGetters} from 'vuex'
export default {
    el: '#favorite_main',
    name: "FavoriteBase",
    components:{
        AddBasket,
        FavoriteComp
    },
    created(){
        console.log(this.USER_STATE)
    },
  computed:{
    ...mapGetters([
        'USER_STATE'
    ])
  }
}
</script>