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
                      <RouterLink :to="`/tovar/${pr.id}`"><p class="small-big product__name">{{ pr.name }}</p></RouterLink>
                      <span class="very-small product__code"
                        >COD: {{ pr.id }}</span
                      >
                    </div>
                    <div class="price">
                      <span class="product__price small-big"
                        >{{ pr.price }}
                        <span class="product__price small">{{
                          pr.price_currency
                        }}</span></span
                      >
                    </div>
                    <div class="variant">
                      <h3>Размер</h3>
                      <div class="flex">
                        <ul class="variant-ul">
                          <li  @click="select_type_weigth(ls_w.id)" :class="type_weigth_id == ls_w.id ? 'active' : ''" v-for="ls_w, index in pr.list_weight" :key="index" class="photo-album-li">
                            <div class="h_sto">
                              <p>{{ ls_w.weight }} гр</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <h3>Тип упаковки</h3>
                      <div class="flex">
                        <ul class="variant-ul">
                          <li  @click="select_type_pack(ty_pck.id)" :class="type_pack_id == ty_pck.id ? 'active' : ''" v-for="ty_pck, index in pr.type_packaging" :key="index" class="photo-album-li">
                            <div class="h_sto">
                              <p>{{ ty_pck.name }}</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="product__text">
                      <p class="small">{{ pr.description }}</p>
                    </div>
                    <div class="flex">
                      <AddBasket :id="pr.id" :wei_id="type_weigth_id" :pack_id="type_pack_id"></AddBasket>
                      <FavoriteComp :id="pr.id" :wei_id="type_weigth_id" :pack_id="type_pack_id"></FavoriteComp>
                    </div>
                  </div>
                </section>
</template>


<style lang="scss" src="../../assets/css/katalog/katalog.scss" scoped></style>
<style lang="scss" src="../../assets/css/interactive/checkbox.scss" scoped></style>
<style lang="css" src="../../assets/css/main/hex-tovar.css"></style>
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
</style>

<script>
import AddBasket from '../AddtionalComp/AddBasket.vue';
import TovarMinImageList from "../AddtionalComp/TovarMinImageList.vue";
import FavoriteComp from '../AddtionalComp/FavoriteComp.vue';
export default({
    el:'#product_catalog',
    name:'CatalogProduct',
    props: ['pr'],
  components:{
    TovarMinImageList,
    AddBasket,
    FavoriteComp,
  },
  data(){
    return {
      type_weigth_id: null,
      type_pack_id: null
    }
  },
  created(){
    this.type_weigth_id = this.pr.list_weight[0].id
    this.type_pack_id = this.pr.type_packaging[0].id
  },
  methods:{
    select_type_weigth(pk){
      console.log(pk)
      this.type_weigth_id = pk
    },
    select_type_pack(pk){
      console.log(pk)
      this.type_pack_id = pk
    }
  }
})

</script>