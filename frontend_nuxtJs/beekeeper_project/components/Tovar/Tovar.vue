<template>
  <div v-if="pr" class="ob flex jus-sp w-sto">
                    <TovarImage :image="pr.image" :ImageProductList="pr.ImageProductList"></TovarImage>
                    
                    <div class="tovar_infa">
                        <div class="tovar_name">
                            <p class="black bolshoi auto">{{pr.name}}</p>
                        </div>
                        <div class="tovar_two">
                            <p class="black nebolsh">Категории: {{getCategoryList().join(', ')}}</p>
                        </div>
                        
                    <rating-comp :rating="pr.rating"></rating-comp>
                    <div class="price flex">
                      <span style="line-height: 1;" class="tovar_price VAG small-big"
                        >{{ select_productItem.price }}
                        <span style="line-height: 1;" class="tovar_price VAG small">{{
                          select_productItem.price_currency
                        }}</span></span
                      >
                    </div>
                        
                    <select-variant-menu :select_productItem="select_productItem"
                     :pr="pr"
                     v-on:select_product="select_product"
                     ></select-variant-menu>
                        <div class="flex tovar_two jus-sp but but-b product_menu">
                      <AddBasket style="  width: 40%;" :id="select_productItem.id" ></AddBasket>
                      <FavoriteComp :id="select_productItem.id" ></FavoriteComp>
                        </div>
                        <div class="tovar_two">
                            <p class="black malenkii">Подробности</p>
                        </div>
                        <div class="tovar_two vib">
                            <div class="flex jus-sp op_contex" @click="isDescription = !isDescription">
                                <p class="black malenkii vib_">Описание</p>
                                <div class="contex material-symbols-outlined"> - </div>

                            </div>
                            <div v-if="isDescription" class="context_text">
                                <p class="malenkii black">{{ pr.description }}</p>

                            </div>
                        </div>
                        <div class="tovar_two vib">
                            <div class="flex jus-sp op_contex" @click="isSostav = !isSostav">
                                <p class="black malenkii vib_">Состав</p>
                                <div class="contex material-symbols-outlined"><span  class="material-symbols-outlined"> - </span></div>

                            </div>
                            <div v-if="isSostav" class="context_text">
                                <p class="malenkii black">Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                    Tempora
                                    natus
                                    rem temporibus deserunt repudiandae iure officia cumque eum omnis sapiente illum
                                    voluptates,
                                    amet ex optio consectetur sed dolore sit eaque.</p>

                            </div>
                        </div>


                    </div>
                </div>
</template>

<style lang="css" src="../../assets/css/tovar.css" scoped></style>
<style>

.variant-ul {
  list-style: none;
  padding: 0;
  width: 100%;
}
.photo-album-li:not(:first-child) {
  margin-left: 1%;
}
.photo-album-li {
  text-align: center;
  float: left;
  padding: 3px;
  width: 90px;
  border-radius: 3px;
  cursor: pointer;
}
.photo-album-li:hover {
  box-shadow: 0px 0px 2px 1px black;
}
.photo-album-li.active {
    box-shadow: 0px 0px 2px 1px black;

}
</style>
<script>
import AddBasket from '~/components/AddtionalComp/AddBasket.vue'
import FavoriteComp from '~/components/AddtionalComp/FavoriteComp.vue'
import TovarImage from '~/components/Tovar/TovarImage.vue'
import RatingComp from "~/components/Tovar/RatingComp.vue"
import SelectVariantMenu from '../Product/SelectVariantMenu.vue'
import CatalogProduct from '../Catalog/CatalogProduct.vue'
export default {

    props: ['pr'],
    data(){
        return {
            isDescription: false,
            isSostav: false,
      type_weigth_id: null,
        }
    },
    components:{
        AddBasket,
        FavoriteComp,
        TovarImage,
        RatingComp,
        SelectVariantMenu
    },
    extends: CatalogProduct,
    
    methods: {
        getCategoryList(){
            let cat_list = this.pr.category.slice()
            let l = []
            cat_list.forEach(element => {
                l.push(element.name)
            });
            return l
        },
    }
}
</script>

<style>

</style>