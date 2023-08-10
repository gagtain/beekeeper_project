<template>
  <div id="catalog">
    <div class="absolute flex w-sto h_sto" style="pointer-events: none;">
      <dialog id="dialog" class="absolute auto" style="pointer-events: auto;">
        <FilterCatalog :category_list="category_list" :catalog_list="catalog_list" @UpdateClassFiler="filterClassReg"></FilterCatalog>
        <button class="btn w-sto btn-green"  onclick="window.dialog.close();">Показать</button>
        <button onclick="window.dialog.close();" aria-label="close" class="x">
          ❌
        </button>
      </dialog>
    </div>
    <div class="sot-ob">
      <div class="wrapper-product w-sto flex">
        <div class="interactiv auto back">
        <p style="margin-left: 5%;" class="small" v-if="filters">{{JSON.parse(this.$route.query.filter).name}}</p>
          <div class="flex w-sto product_div">
            <div class="block filter_div">
              <div class="filter-product" id="filter_desk">
        <FilterCatalog :category_list="category_list" :catalog_list="catalog_list"></FilterCatalog>
              </div>
            </div>
            <div class="product_osnov relative">
              <div class="sorted_div flex jus-sp">
                  
        <SortedCatalog :catalog_list="catalog_list"></SortedCatalog>
                <div class="mob_filter flex">
                  <img onclick="window.dialog.showModal();" class="open_filter_mob auto" src="~assets/images/filter.png" alt="">
                </div>
              </div>
              
              <div
                  v-if="catalog_list.length" class="w-sto product-list flex">
                <CatalogProduct v-for="pr in catalog_list" :key="pr.id" :pr="pr" ></CatalogProduct>
              </div>
              <LoadingComp v-else-if="!catalog_loads"></LoadingComp>
              <div v-else style="width: 50%;margin: auto;margin-top: 10%;">
                    <div style="text-align: center;" class="flex w-sto">

                      <p style="font-size: 28px;" class="VAG auto">Товаров с выбранными параметрами нету :(</p>
                    </div>
                    <div class="select_size" >
                      <NuxtLink to="/catalog">
                            <button @click="clear_filter()" style="background: rgb(255, 188, 65); cursor: pointer; width: 100%; border: medium none; border-radius: 6px;font-size: 26px;padding: 2%;margin-top: 1%;" >
                              Сбросить настройки
                            </button>
                          </NuxtLink>
                          </div>
                  </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="~/assets/css/katalog/katalog.scss" scoped></style>
<style lang="scss" src="~/assets/css/interactive/checkbox.scss" scoped></style>
<style lang="css" src="~/assets/css/main/hex-tovar.css"></style>
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
import getProductList from "~/additional_func/getProductlist";
import FilterCatalog from "~/components/Catalog/FilterCatalog.vue";
import SortedCatalog from '~/components/Catalog/SortedCatalog.vue';
import CatalogProduct from '~/components/Catalog/CatalogProduct.vue';
import getCategorylist from "~/additional_func/getCategoryList";
import getSearchProduct from "~/additional_func/getSearchProduct";
import LoadingComp from '../components/AddtionalComp/LoadingComp.vue';
export default {
  el: "#catalog",
  name: "CatalogItem",
  components:{
    FilterCatalog,
    SortedCatalog,
    CatalogProduct,
    LoadingComp
  },
  data() {
    return {
      catalog_list: [],
      filter_teleport: false,
      category_list: [],
      type_packaging: [],
      CATALOG_LIST_STATE: this.$store.getCatalog_list,
      filters: false,
      catalog_loads: false,
      data: this.$store.getCatalog_params
    };
  },
  async mounted() {
    this.getCatalog()
  },

  methods:{
    async clear_filter(){
      await this.$router.replace({'query': null});
      
      setInterval(()=>{if (!this.$route.query?.filter){
        this.$router.go()
      }},100)
      
    },
    async restartCatalog(){
      this.catalog_loads = false
      let catalog_response = null
    if (this.$route.query?.filter){
      
      catalog_response = await getSearchProduct(`name=${JSON.parse(this.$route.query.filter).name}`)
      this.filters = true
    }else{
      catalog_response = await getProductList(50);
    }
    console.log(catalog_response, 342)
    this.catalog_list = catalog_response.data;
    this.catalog_list_sorted = this.catalog_list.slice();
    this.$store.REFACTOR_CATALOG_LIST(this.catalog_list)
    this.catalog_loads = true
    },
  async filterReg(){
    
    let category_response = await getCategorylist();
    this.category_list = category_response.data
  },
   async getCatalog(){
      this.catalog_loads = false
      if (this.$route.query?.filter){
        this.$store.ADD_CATALOG_PARAMS(`name=${JSON.parse(this.$route.query.filter).name}`)
      }
    let r = await getSearchProduct(this.$store.getCatalog_params.join("&"))
    this.catalog_list = r.data
      this.catalog_loads = true
  }
  },
  setup() {},
  watch:{
    '$route.query': async function () {
      this.restartCatalog()
    },
  }
};
</script>
