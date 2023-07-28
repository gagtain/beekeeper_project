<template>
    <section class="product" id="product_catalog">
                  <div class="product__photo">
                    <div class="photo-container">
                      <div class="photo-main">
                        <div class="controls"></div>
                        <img
                          :src="$api_root + pr.image"
                          alt="green apple slice"
                        />
                      </div>
                      <TovarMinImageList :image="pr.image" :ImageProductList="pr.ImageProductList"></TovarMinImageList>
                      
                    </div>
                  </div>
                  <div class="product__info">
                    <div class="title">
                      <NuxtLink no-prefetch :to="`/tovar/${pr.id}`"><p class="small-big product__name">{{ pr.name }}</p></NuxtLink>
                      <span class="very-small product__code"
                        >COD: {{ pr.id }}</span
                      >
                    </div>
                    <rating-comp :rating="pr.rating"></rating-comp>
                    <div class="price">
                      <span class="product__price small-big"
                        >{{ select_productItem.price }}
                        <span class="product__price small">{{
                          pr.price_currency
                        }}</span></span
                      >
                    </div>
                    <div class="variant">
                      <h3>Размер</h3>
                      <div class="flex">
                        <ul class="variant-ul">
                          <li  @click="select_type_weigth(ls_w.id)" :class="select_productItem.weight.id == ls_w.id ? 'active' : ''"
                           v-for="ls_w, index in get_weight_type_list()" :key="index" class="photo-album-li">
                           
                            <div class="h_sto">
                              <p>{{ ls_w.weight }} гр</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="product__text">
                      <p class="small">{{ pr.description }}</p>
                    </div>
                    <div class="flex">
                      <AddBasket style="width: 30%;" :id="select_productItem.id" ></AddBasket>
                      <FavoriteComp :id="select_productItem.id" ></FavoriteComp>
                    </div>
                  </div>
                </section>
</template>


<style lang="css" src="../../assets/css/main/main.css" scoped></style>
<style lang="css" src="../../assets/css/main/hex-tovar.css" scoped></style>
<style>
.photo-main img{
  width: 100%;
height: 100%;
}
</style>
<script>
import AddBasket from '../AddtionalComp/AddBasket.vue';
import TovarMinImageList from "../AddtionalComp/TovarMinImageList.vue";
import FavoriteComp from '../AddtionalComp/FavoriteComp.vue';
import CatalogProduct from '../Catalog/CatalogProduct.vue';
import RatingComp from '../Tovar/RatingComp.vue';
export default {
    el:'#product_catalog',
    name:'CatalogProduct',
    props: ['pr'],
    extends: CatalogProduct,
  components:{
    TovarMinImageList,
    AddBasket,
    FavoriteComp,
    RatingComp
  },
  created(){
  }
}

</script>