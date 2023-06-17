<template>
    <div class="list_tovar_kor w-sto">
    <div v-for="b in USER_STATE.basket" :key="b.id"  class="tovar w-sto flex">
    <div class="tovar_kor_img_div">
      <img
        class="tovar_kor_img"
        :src="$api_root + b.productItem.product.image"
        alt=""
      />
    </div>
    <div class="info_tovar_kor flex jus-sp">
      <div class="info_tovar_kor_osnov">
        <p class="normal-small tovar_kor_name">{{ b.productItem.product.name }}</p>

        <p class="normal-small info_in_tovar_kor description">
          {{ b.productItem.product.price }} {{ b.productItem.product.price_currency }}
        </p>
        <div class="btn_tovar_kor flex">
          <FavoriteComp :id="b.productItem.product.id" ></FavoriteComp>
          <AddBasket :ProductItem="b.productItem" ></AddBasket>
        </div>
      </div>
      <div class="size_tovar_div">
        <div class="size_tovar_kor">
          <div class="select_size">
            <p class="normal-small raz">размер</p>
            <select name="select" class="size auto">
              <option :selected="ls_w.id == b.productItem.weight.id" v-for="ls_w in b.productItem.product.list_weight" :key="ls_w.id" value="value1">{{ ls_w.weight }} гр</option>
            </select>
            <p class="normal-small raz">тип упаковки</p>
            <select name="select" class="size auto">
              <option :selected="ls_p.id == b.productItem.type_packaging.id" v-for="ls_p in b.productItem.product.type_packaging" :key="ls_p.id" value="value1">{{ ls_p.name }}</option>
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
    font-size: 30px;
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