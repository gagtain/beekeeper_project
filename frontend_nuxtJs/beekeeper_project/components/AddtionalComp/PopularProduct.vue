<template>
    <section class="product" id="product_catalog">
                  <div class="product__photo">
                    <div class="photo-container">
                      <div class="photo-main">
                        <div class="controls"></div>
                        <nuxt-img
                        loading="lazy" format="webp"
                          :src="$api_root + pr.image.slice(1)"
                          alt="green apple slice"
                        />
                        <sale-line v-if="select_productItem.is_sale" :old_price="select_productItem.old_price"
                      :price="select_productItem.price"></sale-line>
                      </div>
                      <TovarMinImageList v-if="!$device.isMobile" :image="pr.image" :ImageProductList="pr.ImageProductList"></TovarMinImageList>
                      
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
                      <sale-price v-if="select_productItem.is_sale"
                      :price="select_productItem.price"
                      ></sale-price>
                    </div>
                    
                    <select-variant-menu :select_productItem="select_productItem"
                     :pr="pr"
                     v-on:select_product="select_product"
                     ></select-variant-menu>
                    <div class="product__text">
                      <p class="small">{{ pr.description.slice(15) }}...</p>
                    </div>
                    <div :style="select_productItem.weight ? 'margin-top: 8px' : 'margin-top: 56px'"  class="flex">
                      <AddBasket :id="select_productItem.id" ></AddBasket>
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
.product__name{
  overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
transition: .5s;

}
.product__name:hover{
  overflow: auto;
  white-space:normal;
transition: .5s;
}
</style>
<script>
import AddBasket from '../AddtionalComp/AddBasket.vue';
import TovarMinImageList from "../AddtionalComp/TovarMinImageList.vue";
import FavoriteComp from '../AddtionalComp/FavoriteComp.vue';
import CatalogProduct from '../Catalog/CatalogProduct.vue';
import RatingComp from '../Tovar/RatingComp.vue';
import SelectVariantMenu from '../Product/SelectVariantMenu.vue';
import SaleLine from '../Product/SaleLine.vue';
import SalePrice from '../Product/SalePrice.vue';
export default {
    el:'#product_catalog',
    name:'CatalogProduct',
    props: ['pr'],
    extends: CatalogProduct,
  components:{
    TovarMinImageList,
    AddBasket,
    FavoriteComp,
    RatingComp,
    SelectVariantMenu,
    SaleLine,
    SalePrice
  },
  created(){
  }
}

</script>