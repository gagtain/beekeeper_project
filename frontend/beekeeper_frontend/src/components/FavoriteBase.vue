<template>
  <div class="sot-ob">
    <div class="wrapper flex">
      <div class="user_card flex auto">
        <div class="interactiv user_card_div auto" id="favorite_main">
          <div class="w-sto kor">
            <p class="small-big VAG">Избранное</p>
            <div class="w-sto flex">
              <div class="w-sto">
                <div
                
                  v-for="b in USER_STATE.favorite_product"
                  :key="b.id"
                  class="tovar w-sto flex"
                >
                  <div class="tovar_kor_img_div">
                    <img
                      class="tovar_kor_img"
                      :src="$api_root + b.productItem.product.image"
                      alt=""
                    />
                  </div>
                  <div class="info_tovar_kor flex jus-sp">
                    <div class="info_tovar_kor_osnov">
                      <p class="normal-small tovar_kor_name">{{ b.productItem.product.name }} [{{ b.productItem.weight.weight }} гр, {{ b.productItem.type_packaging.name }}]</p>

                      <p class="normal-small info_in_tovar_kor description">
                        {{ b.productItem.product.price }} {{ b.productItem.product.price_currency }}
                      </p>
                      <div class="btn_tovar_kor flex">
                        <FavoriteComp
                        :id="b.id" :ProductItem="b.productItem"
                        ></FavoriteComp>
                        
                        <AddBasket
                          :id="b.id" :ProductItem="b.productItem"
                        ></AddBasket>
                      </div>
                    </div>
                    <div class="size_tovar_div">
                      <div class="size_tovar_kor">
                        <div class="select_size">
                          <button style="background: rgb(76, 175, 80); cursor: pointer;width: 100%;height: 32px;border: none;border-radius: 6px;" onclick="alert('в разработке')">Изменить</button>
            
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="!USER_STATE.favorite_product.length"  style="width: 50%;margin: auto;margin-top: 10%;">
                    
                  <p style="font-size: 28px;" class="VAG">Список избранного пуст :(</p>
                  <div class="select_size" >
                    <router-link to="/catalog">
                          <button style="background: rgb(76, 175, 80); cursor: pointer; width: 100%; border: medium none; border-radius: 6px;font-size: 26px;padding: 2%;margin-top: 1%;" >
                            Перейти в каталог
                          </button>
                        </router-link>
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

<style lang="css" src="../assets/css/account.css" scoped></style>

<style scoped>
.tovar_kor_img_div img {
  width: 100%;
  height: 100%;
}
.description {
  max-width: 90%;
  text-overflow: ellipsis;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.kor{
  min-height: 80vh;
}
</style>
<script>
import AddBasket from "./UserComp/BasketComp/AddBasket.vue";
import FavoriteComp from "./UserComp/BasketComp/FavoriteComp.vue";
import { mapGetters } from "vuex";
export default {
  el: "#favorite_main",
  name: "FavoriteBase",
  components: {
    AddBasket,
    FavoriteComp,
  },
  created() {},
  computed: {
    ...mapGetters(["USER_STATE"]),
  },
};
</script>
