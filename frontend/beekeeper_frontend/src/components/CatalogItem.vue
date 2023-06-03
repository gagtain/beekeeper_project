<template>
  <div id="catalog">
    <div class="absolute flex w-sto h_sto">
      <dialog id="dialog" class="absolute auto">
        <p class="filter-p small">Категория</p>
        <ul class="filter-ul">
          <li
            v-for="(cat, index) in category_list"
            :key="index"
            class="filter-li"
          >
            <p @click="addClassFilter($event)" class="normal-small">
              {{ cat.name }}
            </p>
          </li>
        </ul>
        <p class="filter-p small">Тип упаковки</p>
        <ul class="filter-ul">
          <li class="filter-li">
            <p class="normal-small">Стекло</p>
          </li>
          <li class="filter-li">
            <p class="normal-small">Пакет</p>
          </li>
        </ul>
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
                <p class="filter-p small">Категория</p>
                <ul class="filter-ul">
                  <li class="filter-li">
                    <p class="normal-small">Лечебный</p>
                  </li>
                  <li class="filter-li">
                    <p class="normal-small">отварной</p>
                  </li>
                </ul>
                <p class="filter-p small">Тип упаковки</p>
                <ul class="filter-ul">
                  <li class="filter-li">
                    <p class="normal-small">Стекло</p>
                  </li>
                  <li class="filter-li">
                    <p class="normal-small">Пакет</p>
                  </li>
                </ul>
              </div>
            </div>
            <div class="product_osnov">
              <div class="sorted_div flex jus-sp">
                <div class="sorted-product flex jus-sp">
                  <p
                    @click="sorteredAlf = !sorteredAlf"
                    :class="sorteredAlf ? 'act_sorted-p' : ''"
                    class="sorted-p small"
                  >
                    По имени
                  </p>

                  <p
                    @click="sorteredMonet = !sorteredMonet"
                    :class="sorteredMonet ? 'act_sorted-p' : ''"
                    class="sorted-p small"
                  >
                    По цене
                  </p>
                  <p
                    @click="sorteredNew = !sorteredNew"
                    :class="sorteredNew ? 'act_sorted-p' : ''"
                    class="sorted-p small"
                  >
                    Новое
                  </p>
                  <p class="sorted-p small">По имени</p>
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
              <div class="w-sto product-list flex jus-sp">
                <!--
                            <div class="product_card">
                                <div class="product-card-img">
                                    <img class="product-card-img-in_div" src="images/2.png" alt="">
                                </div>
                                <p>Размеры</p>
                                <div class="flex">
                                    <ul class="variant-ul">

                                        <li class="photo-album-li">
                                            <div class="h_sto">
                                                <img width="100%" height="80%"
                                                    src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/d7516b44740087.581c4d069eaf8.jpg" />
                                                <p>100 гр</p>
                                            </div>

                                        </li>
                                        <li class="photo-album-li">
                                            <div class="h_sto">
                                                <img width="100%" height="80%"
                                                    src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd0f2628180365.56370e61afb8e.jpg" />
                                                <p class="normal-small">250 гр</p>
                                            </div>
                                        </li>

                                    </ul>
                                </div>
                                <div class="flex w-sto">
                                    <button class="btn">Добавить в корзину</button>

                                </div>
                            </div>
                            <div class="product_card">

                            </div>
                            <div class="product_card">

                            </div>
                            <div class="product_card">

                            </div>
                        -->

                <section
                  v-for="(pr, index) in filteredProduct()"
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
                      <button class="btn">Добавить в корзину</button>
                      <button class="btn fav-btn flex">
                        <img
                          class="auto"
                          :src="`${$api_root}static/online_store/images/favorite/favorite_add.png`"
                          alt=""
                        />
                      </button>
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

<style lang="scss" src="../assets/css/katalog/katalog.scss" scoped></style>
<style lang="scss" src="../assets/css/interactive/checkbox.scss" scoped></style>
<style lang="css" src="../assets/css/main/hex-tovar.css"></style>
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
import getProductList from "../additional_func/getProductlist";
import getCategorylist from "../additional_func/getCategoryList";
export default {
  el: "#catalog",
  name: "CatalogItem",
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
      sorteredAlf: false,
      sorteredMonet: false,
      sorteredNew: false,
      filter_menu_act: false,
      filter_class_name: [],
    };
  },
  async created() {
    let catalog_response = await getProductList(50);
    this.catalog_list = catalog_response.data;
    this.catalog_list_sorted = this.catalog_list.slice();
    let category_response = await getCategorylist();
    this.category_list = category_response.data;
    console.log(this.category_list);
  },
  setup() {},
  methods: {
    filteredProduct() {
      const start = (this.page - 1) * 6;
      const end = this.page * 6;
      let sortered = this.catalog_list.slice();
      this.filter_class_name.forEach((element) => {
        sortered = sortered.filter((x) =>
          x.category.find((x) => x.name == element)
        );
      });

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
    addClassFilter(event) {
      let index = this.filter_class_name.indexOf(event.target.innerHTML);
      if (index >= 0) {

        this.filter_class_name.splice(index, 1);
        console.log(this.filter_class_name)
        return false;
      } else {
        this.filter_class_name.push(event.target.innerHTML);
        return true;
      }
    },
  },
};
</script>
