<template>
  <div id="catalog">
    <div class="absolute flex w-sto h_sto" style="pointer-events: none;">
      <dialog id="dialog" class="absolute auto" style="pointer-events: auto;">
        <FilterCatalog :category_list="category_list" :type_packaging="type_packaging" :catalog_list="catalog_list" @UpdateClassFiler="filterClassReg"></FilterCatalog>
        <button class="btn w-sto btn-green"  onclick="window.dialog.close();">Показать</button>
        <button onclick="window.dialog.close();" aria-label="close" class="x">
          ❌
        </button>
      </dialog>
    </div>
    <div class="sot-ob">
      <div class="wrapper-product w-sto flex">
        <div class="interactiv auto back">
          <div class="flex w-sto product_div">
            <div class="block filter_div">
              <div class="filter-product" id="filter_desk">
        <FilterCatalog :category_list="category_list" :type_packaging="type_packaging" :catalog_list="catalog_list"></FilterCatalog>
              </div>
            </div>
            <div class="product_osnov">
              <div class="sorted_div flex jus-sp">
                  
        <SortedCatalog :catalog_list="catalog_list"></SortedCatalog>
                <div class="mob_filter relative">
                  <p
                    onclick="window.dialog.showModal();"
                    class="open_filter_mob"
                  >
                    Фильтрация
                  </p>
                </div>
              </div>
              <div
                  v-if="CATALOG_LIST_STATE" class="w-sto product-list flex">
                <CatalogProduct v-for="pr in CATALOG_LIST_STATE" :key="pr.id" :pr="pr" ></CatalogProduct>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
import getProductList from "../../additional_func/getProductlist";
import FilterCatalog from '../Catalog/FilterCatalog.vue';
import SortedCatalog from '../Catalog/SortedCatalog.vue';
import CatalogProduct from './CatalogProduct.vue';
import getCategorylist from "../../additional_func/getCategoryList";
import getType_packaging_list from "../../additional_func/getType_packaging_list";
import {mapGetters} from 'vuex'
import store from '../../store'
export default {
  el: "#catalog",
  name: "CatalogItem",
  components:{
    FilterCatalog,
    SortedCatalog,
    CatalogProduct
  },
  data() {
    return {
      catalog_list: [
        {
          id: 0,
          name: "",
          image: "",
          price: "",
          price_currency: "",
          description: "",
          category: [
            {
              name: "",
            },
          ],
          type_packaging: {
            name: "",
          },
        },
      ],
      filter_teleport: false,
      category_list: [],
      type_packaging: [],
    };
  },
  async created() {
    let catalog_response = await getProductList(50);
    this.filterReg()
    this.catalog_list = catalog_response.data;
    this.catalog_list_sorted = this.catalog_list.slice();
    store.dispatch('REFACTOR_CATALOG_LIST', this.catalog_list)
  },
  methods:{

  async filterReg(){
    
    let category_response = await getCategorylist();
    this.category_list = category_response.data;
    let type_packaging_response = await getType_packaging_list();
    this.type_packaging = type_packaging_response.data;
  }
  },
  setup() {},
    
  computed:{
    ...mapGetters([
        'CATALOG_LIST_STATE',
        'USER_STATE'
    ])
  }
};
</script>
