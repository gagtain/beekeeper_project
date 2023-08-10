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
                    <div class="price">
                      <span class="product__price small-big"
                        >{{ select_productItem.price }}
                        <span class="product__price small">{{
                          pr.price_currency
                        }}</span></span
                      >
                    </div>
                    <rating-comp :rating="pr.rating"></rating-comp>
                    <select-variant-menu :select_productItem="select_productItem"
                     :pr="pr"
                     v-on:select_product="select_product"
                     ></select-variant-menu>
                    <div :style="select_productItem.weight ? 'margin-top: 8px' : 'margin-top: 56px'" class="flex jus-sp">
                      <AddBasket style="width: 40%;" :id="select_productItem.id" ></AddBasket>
                      <FavoriteComp :id="select_productItem.id" ></FavoriteComp>
                    </div>
                  </div>
                </section>
</template>


<style lang="scss" src="../../assets/css/katalog/katalog.scss" scoped></style>
<style lang="scss" src="../../assets/css/interactive/checkbox.scss" scoped></style>
<style scoped>
.photo-main img {
  width: 100%;
  height: 100%;
}
.back {
  background: antiquewhite;
  padding: 2%;
  border-radius: 5px;  
  min-height: 833px;
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
import RatingComp from '../Tovar/RatingComp.vue';
import SelectVariantMenu from '../Product/SelectVariantMenu.vue';
import SelectVariantMixin from '../Product/SelectVariantMixin.vue';
export default{
    el:'#product_catalog',
    name:'CatalogProduct',
    props: ['pr'],
  components:{
    TovarMinImageList,
    AddBasket,
    FavoriteComp,
    RatingComp,
    SelectVariantMenu,
  },
  mixins: [ SelectVariantMixin ],
  data(){
    return {
      type_weigth_id: null,
    }
  },
  created(){
    this.select_productItem = this.pr.productItemList[0]
    
  },
}

</script>