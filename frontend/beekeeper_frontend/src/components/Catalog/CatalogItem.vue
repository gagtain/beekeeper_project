<template>
  <div id="catalog">
    <div class="absolute flex w-sto h_sto" style="pointer-events: none;">
      <dialog id="dialog" class="absolute auto" style="
    pointer-events: auto;">
        <FilterCatalog :catalog_list="catalog_list" @UpdateClassFiler="filterClassReg"></FilterCatalog>
        <button class="btn w-sto btn-green">Показать</button>
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
              <div class="filter-product">
                
        <FilterCatalog :catalog_list="catalog_list"></FilterCatalog>
              </div>
            </div>
            <div class="product_osnov">
              <div class="sorted_div flex jus-sp">
                <div class="sorted-product flex jus-sp">
                  
        <SortedCatalog :catalog_list="catalog_list"></SortedCatalog>
                </div>
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
                  v-if="CATALOG_LIST_STATE.length" class="w-sto product-list flex jus-sp">
                <section
                  v-for="(pr, index) in CATALOG_LIST_STATE"
                  :key="index"
                  class="product"
                >
                  <div class="product__photo">
                    <div class="photo-container">
                      <div class="photo-main">
                        <div class="controls"></div>
                        <img
                          :src="$api_root + pr.image"
                          alt="green apple slice"
                        />
                      </div>
                      <div class="photo-album flex jus-sp">
                        <img
                          class="add-img-tovar"
                          src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/d7516b44740087.581c4d069eaf8.jpg"
                        />
                        <img
                          class="add-img-tovar"
                          src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/d7516b44740087.581c4d069eaf8.jpg"
                        />
                        <img
                          class="add-img-tovar"
                          src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/d7516b44740087.581c4d069eaf8.jpg"
                        />

                        <img
                          class="add-img-tovar"
                          src="https://res.cloudinary.com/john-mantas/image/upload/v1537303708/codepen/delicious-apples/apple-top.png"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="product__info">
                    <div class="title">
                      <p class="small-big product__name">{{ pr.name }}</p>
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
                          <li class="photo-album-li">
                            <div class="h_sto">
                              <p>100 гр</p>
                            </div>
                          </li>
                          <li class="photo-album-li">
                            <div class="h_sto">
                              <p class="normal-small">250 гр</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="product__text">
                      <p class="small">{{ pr.description }}</p>
                    </div>
                    <div class="flex">
                      <AddBasket :sm="true" :id="pr.id"></AddBasket>
                      <FavoriteComp :id="pr.id"></FavoriteComp>
                    </div>
                  </div>
                </section>
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
}
</style>
<script>
import getProductList from "../../additional_func/getProductlist";
import getCategorylist from "../../additional_func/getCategoryList";
import FilterCatalog from '../Catalog/FilterCatalog.vue';
import AddBasket from '../AddtionalComp/AddBasket.vue';
import FavoriteComp from '../AddtionalComp/FavoriteComp.vue';
import SortedCatalog from '../Catalog/SortedCatalog.vue';
import {mapGetters} from 'vuex'
import store from '../../store'
export default {
  el: "#catalog",
  name: "CatalogItem",
  components:{
    FilterCatalog,
    SortedCatalog,
    AddBasket,
    FavoriteComp
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
      category_list: [],
      page: 1,
      filter_menu_act: false,
      filter_class_name: [],
      filter_type_packaging: [],
      one: true
    };
  },
  async created() {
    let catalog_response = await getProductList(50);
    this.catalog_list = catalog_response.data;
    this.catalog_list_sorted = this.catalog_list.slice();
    let category_response = await getCategorylist();
    this.category_list = category_response.data;
    console.log(this.category_list);
    store.dispatch('REFACTOR_CATALOG_LIST', this.catalog_list)
  },
  setup() {},
  methods: {
    filteredProduct() {
      const start = (this.page - 1) * 6;
      const end = this.page * 6;
      let sortered = this.catalog_list.slice();

      if (this.sorteredAlf) {
        sortered = this.sorteredAlfFunc(sortered);
        console.log(sortered);
      }
      if (this.sorteredMonet) {
        sortered = this.sorteredMoneyFUnc(sortered);
        console.log(sortered);
      }
      if (this.sorteredNew) {
        console.log(sortered);
        sortered = this.sorteredNewFUnc(sortered);
        console.log(sortered);
      }
      if (
        this.sorteredAlf ||
        this.sorteredMonet ||
        this.sorteredNew ||
        this.filter_class_name.length
      ) {
        console.log(1, sortered);
        return sortered;
      } else {
        return this.catalog_list.slice(start, end);
      }
    },
    sorteredAlfFunc(noSortered) {
      if (this.sorteredAlf) {
        return noSortered.sort((x, y) => x.name.localeCompare(y.name));
      }
    },
    sorteredMoneyFUnc(noSortered) {
      if (this.sorteredMonet) {
        return noSortered.sort(
          (a, b) => parseFloat(b.price) - parseFloat(a.price)
        );
      }
    },
    sorteredNewFUnc(noSortered) {
      if (this.sorteredNew) {
        return noSortered.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
      }
    },
    
  },
  computed:{
    ...mapGetters([
        'CATALOG_LIST_STATE'
    ])
  }
};
</script>
