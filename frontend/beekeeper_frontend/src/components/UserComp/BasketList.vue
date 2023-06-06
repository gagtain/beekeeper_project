<template>
    <div class="list_tovar_kor w-sto">
    <div v-for="b, index in USER_STATE.basket" :key="index"  class="tovar w-sto flex">
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
          <button class="flex btn_add_favorite jus-sp">
            <img
              class="add_favorite"
              src="images/favorite/favorite_add.png"
              alt=""
            />
            <p v-if="b.favorite" class="b_text" @click="remove_favorite(b.id)">Избранное</p>
            <p v-else class="b_text" @click="add_favorite(b.id)">Добавить в избранное</p>
          </button>
          <button class="flex btn_add_favorite remove_kor jus-sp">
            <img
              class="add_favorite"
              src="images/x_tovar.png"
              alt=""
            />
            <p class="b_text" @click="remove_basket(b.id)" >Убрать из корзины</p>
          </button>
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
</template>

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
.btn_add_favorite{
    margin-top: 2%;
}
</style>

<script>
import {mapGetters} from 'vuex'
export default {
    data(){
    },
    created(){
        console.log(this.USER_STATE.basket)
    },
  computed:{
    ...mapGetters([
        'USER_STATE'
    ])
  }
}
</script>