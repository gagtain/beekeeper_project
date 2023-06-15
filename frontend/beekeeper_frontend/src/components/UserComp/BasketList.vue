<template>
    <div class="list_tovar_kor w-sto">
    <div v-for="b in USER_STATE.basket" :key="b.id"  class="tovar w-sto flex">
    <div class="tovar_kor_img_div">
      <img
        class="tovar_kor_img"
        :src="$api_root + b.product.image"
        alt=""
      />
    </div>
    <div class="info_tovar_kor flex jus-sp">
      <div class="info_tovar_kor_osnov">
        <p class="normal-small tovar_kor_name">{{ b.product.name }}</p>

        <p class="normal-small info_in_tovar_kor description">
          {{ b.product.description }}
        </p>
        <div class="btn_tovar_kor flex">
          <FavoriteComp :id="b.product.id" ></FavoriteComp>
          <AddBasket :id="b.product.id" ></AddBasket>
        </div>
      </div>
      <div class="size_tovar_div">
        <div class="size_tovar_kor">
          <div class="select_size">
            <p class="normal-small raz">размер</p>
            <select name="select" class="size auto">
              <option :selected="ls_w.id == b.weight.id" v-for="ls_w in b.product.list_weight" :key="ls_w.id" value="value1">{{ ls_w.weight }} гр</option>
            </select>
            
<p class="normal-small kolvo">количество</p>
<CountProduct :id="b.id"></CountProduct>
        </div>
      </div>
    </div>
  </div>
  </div>
  </div>
</template>

<style lang="css" src="../../assets/css/account.css" scoped></style>

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
import {mapGetters} from 'vuex'
import AddBasket from './BasketComp/AddBasket.vue'
import CountProduct from './BasketComp/CountProduct.vue'
import FavoriteComp from './BasketComp/FavoriteComp.vue'
export default {
    data(){
    },
    components:{
      AddBasket,
      FavoriteComp,
      CountProduct
    },
    created(){
    },
  computed:{
    ...mapGetters([
        'USER_STATE'
    ])
  },
  methods:{
   
  }
}
</script>