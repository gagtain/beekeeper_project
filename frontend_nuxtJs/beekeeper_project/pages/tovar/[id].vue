<template>
    <div class="sot-ob">
        <div class="wrapper flex w-sto">

            <div class="tovar_in flex interactiv jus-sp auto" id="tovar">
                <div v-if="tovar" class="ob flex jus-sp w-sto">
                    <TovarImage :image="tovar.image" :ImageProductList="tovar.ImageProductList"></TovarImage>
                    
                    <div class="tovar_infa">
                        <div class="tovar_name">
                            <p class="black bolshoi auto">{{tovar.name}}</p>
                        </div>
                        <div class="tovar_two">
                            <p class="black nebolsh">Категории: {{getCategoryList().join(', ')}}</p>
                        </div>
                        
                    <rating-comp :rating="tovar.rating"></rating-comp>
                    <div class="price flex">
                      <span style="line-height: 1;" class="tovar_price VAG small-big"
                        >{{ tovar.price }}
                        <span style="line-height: 1;" class="tovar_price VAG small">{{
                          tovar.price_currency
                        }}</span></span
                      >
                    </div>
                        <div class="variant tovar_two">
                      <h3>Размер</h3>
                      <div class="flex">
                        <ul class="variant-ul">
                          <li  @click="select_type_weigth(ls_w.id)" :class="type_weigth_id == ls_w.id ? 'active' : ''" v-for="ls_w, index in tovar.list_weight" :key="index" class="photo-album-li">
                            <div class="h_sto">
                              <p>{{ ls_w.weight }} гр</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <h3>Тип упаковки</h3>
                      <div class="flex">
                        <ul class="variant-ul">
                          <li  @click="select_type_pack(ty_pck.id)" :class="type_pack_id == ty_pck.id ? 'active' : ''" v-for="ty_pck, index in tovar.type_packaging" :key="index" class="photo-album-li">
                            <div class="h_sto">
                              <p>{{ ty_pck.name }}</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                        <div class="flex tovar_two jus-sp but but-b">
                            <AddBasket :id="tovar.id" :wei_id="type_weigth_id" :pack_id="type_pack_id"></AddBasket>
                            <FavoriteComp :id="tovar.id" :wei_id="type_weigth_id" :pack_id="type_pack_id"></FavoriteComp>
                        </div>
                        <div class="tovar_two">
                            <p class="black malenkii">Подробности</p>
                        </div>
                        <div class="tovar_two vib">
                            <div class="flex jus-sp op_contex" @click="open_descrip()">
                                <p class="black malenkii vib_">Описание</p>
                                <div class="contex material-symbols-outlined"> expand_more </div>

                            </div>
                            <div v-if="isDescription" class="context_text">
                                <p class="malenkii black">{{ tovar.description }}</p>

                            </div>
                        </div>
                        <div class="tovar_two vib">
                            <div class="flex jus-sp op_contex" @click="open_sostav()">
                                <p class="black malenkii vib_">Состав</p>
                                <div class="contex material-symbols-outlined"><span  class="material-symbols-outlined"> expand_more </span></div>

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
<style>
.material-symbols-outlined{
    font-family: 'Material Symbols Outlined';
}</style>
<script>
import getTovar from "../../additional_func/getTovar"
import AddBasket from '~/components/AddtionalComp/AddBasket.vue'
import FavoriteComp from '~/components/AddtionalComp/FavoriteComp.vue'
import TovarImage from '~/components/Tovar/TovarImage.vue'
import RatingComp from "~/components/Tovar/RatingComp.vue"
export default {
    el: '#tovar',
    name: 'TovarBase',
    components:{
        AddBasket,
        FavoriteComp,
        TovarImage,
        RatingComp
    },
    data(){
        return {
            tovar: null,
            isDescription: false,
            isSostav: false,
      type_weigth_id: null,
      type_pack_id: null
        }
    },
    async created(){
        let response_tovar = await getTovar(this.$route.params.id)
        console.log(response_tovar)
        if (response_tovar.status == 200){
            this.tovar = response_tovar.data
        }
    this.type_weigth_id = this.tovar.list_weight[0].id
    this.type_pack_id = this.tovar.type_packaging[0].id
    },
    methods: {
        getCategoryList(){
            let cat_list = this.tovar.category.slice()
            let l = []
            cat_list.forEach(element => {
                l.push(element.name)
            });
            return l
        },
        open_descrip(){
            this.isDescription = !this.isDescription
        },
        open_sostav(){
            this.isSostav = !this.isSostav
        },
    select_type_weigth(pk){
      console.log(pk)
      this.type_weigth_id = pk
    },
    select_type_pack(pk){
      console.log(pk)
      this.type_pack_id = pk
    }
    }
}
</script>