<template>
    <div @click="search_container()" class="container relative" id="search">
      <input style="z-index: 11;" class="input relative" type="text" v-model="search_text" placeholder="Search" />
      <div style="z-index: 11;" @click="submin_src(pop)" class="relative zone_search absolute"></div>
      <div @click.stop="zone()" class="zone">

      </div>
      <div class="absolute src_comp w-sto"  style="z-index: 11;">
        
    <div v-if="search_product.length" class="w-sto h_sto">
        <div @click.stop="submit_src_but(pop)" v-for="pop in search_product" :key="pop.id" class="w-sto src_el">
            <p class="m2 normal-small">{{ pop.name }}</p>
        </div>
    </div>
      </div>
    </div>
</template>
<style>
.src_comp{
    background-color: azure;
     top: 100%;
      left: 0%;
      padding: 2% 3%;
      border-radius: 4px;
}
.src_el{

    padding: 2% 3%;
    border-radius: 4px;
}
.src_el:hover{
    background: rgb(104, 166, 62);
}
.src_comp{
    display: none;
}
.zone{
    background-color: rgba(3,8,13,.32);
height: 100vh;
left: 0;
position: fixed;
top: 0;
width: 100vw;
z-index: 10;
display: none;
}
</style>

<style src="../assets/css/interactive/search.css" scoped></style>
<script>
import getSearchNameProduct from '~/additional_func/getSearchNameProduct'
import redirect from '~/additional_func/redirect';

export default defineNuxtComponent({
    el: 'search',
    name: 'SearchComp',
    data(){
        return{
            search_product: [],
            search_text: '',
        }
    },
    async mounted(){
    },
    methods:{
        submin_src(){
            this.zone()
            redirect(this,{ name: 'catalog', query: { filter:JSON.stringify({"name": `${this.search_text}`}) } })
        },
        submit_src_but(product){
            redirect(this,{ name: 'catalog', query: { filter:JSON.stringify({"name": `${product.name}`}) } })
            this.zone()
        },
        zone(){
            document.getElementsByClassName('src_comp')[0].style.display="none";
            document.getElementsByClassName('zone')[0].style.display="none";
        },
        search_container(){
            document.getElementsByClassName('src_comp')[0].style.display= "block";
            document.getElementsByClassName('zone')[0].style.display="block";
        }
    },
    watch: {
        search_text:  function (val) {
        setTimeout(async () => {
                if (val == ''){
                    this.search_product = []
                }
                else if (val == this.search_text){
                    let res = await getSearchNameProduct(`name=${this.search_text}&fields=["id","name"]`)
                    this.search_product = res.data
                    console.log(res.data)
                }
             }, 500);
        }
  },

})
</script>
