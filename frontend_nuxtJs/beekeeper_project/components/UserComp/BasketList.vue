<template>
    <div class="list_tovar_kor w-sto">
    <div v-for="b in USER_STATE.basket" :key="b.id"  class="tovar w-sto flex">
    <div class="tovar_kor_img_div">
      <img
        class="tovar_kor_img"
        :src="$api_root + b.productItem.product.image.slice(1)"
        alt=""
      />
    </div>
    <div class="info_tovar_kor flex jus-sp">
      <div class="info_tovar_kor_osnov">
        <p class="normal-small tovar_kor_name">{{ b.productItem.product.name }} {{ b.productItem.weight ? '[' + b.productItem.weight.weight + 'гр]' : '' }}</p>
        <div class="relative"
        style="height: 50px; width: 50%;"
        v-if="getBasketRefactorPrice(b.productItem.id)">
        <loading-comp></loading-comp>
        </div>
        <p v-else class="normal-small info_in_tovar_kor">
          {{ b.productItem.price }} {{ b.productItem.price_currency }}
        </p>
        <div class="btn_tovar_kor flex">
          <FavoriteComp :id="b.productItem.id" ></FavoriteComp>
          <AddBasket :id="b.productItem.id" ></AddBasket>
        </div>
      </div>
      <div class="size_tovar_div">
        <div class="size_tovar_kor">
          <div class="select_size">
            
<p class="normal-small kolvo">количество</p>
<CountProduct :item="b"></CountProduct>
        </div>
      </div>
    </div>
  </div>
  </div>
  
  <div v-if="!USER_STATE.basket.length"  style="width: 50%;margin: auto;margin-top: 10%;">
                    
                    <p style="font-size: 28px;" class="VAG">Список корзины пуст :(</p>
                    <div class="select_size" >
                      <router-link to="/catalog">
                            <button style="background: rgb(76, 175, 80); cursor: pointer; width: 100%; border: medium none; border-radius: 6px;font-size: 26px;padding: 2%;margin-top: 1%;" >
                              Перейти в каталог
                            </button>
                          </router-link>
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
import LoadingComp from '../AddtionalComp/LoadingComp.vue'
import AddBasket from './BasketComp/AddBasket.vue'
import CountProduct from './BasketComp/CountProduct.vue'
import FavoriteComp from './BasketComp/FavoriteComp.vue'
export default {
    data(){
      return{

        USER_STATE: this.$store.getUser
      }
    },
    components:{
      AddBasket,
      FavoriteComp,
      CountProduct,
        LoadingComp
    },
    created(){
    },
  methods:{
   getBasketRefactorPrice(productItem_id){
    let obj = this.$store.getBasket_refactor_websocket.filter(e => e.id == productItem_id)
    if (obj.length == 0){
      return false
    }else if(obj[0].type == 'price'){
      return true
    }else{
      return false
    }
   }
  },
}
</script>