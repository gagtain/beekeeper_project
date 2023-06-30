<template>
    <div class="container relative" id="search">
      <input class="input" type="text" v-model="search_text" placeholder="Search" />
      <div @click="submin_src(pop)" class="zone_search absolute"></div>
    <div v-if="search_product.length" class="absolute src_comp w-sto">
        <div @click="submin_src(pop)" v-for="pop in search_product" :key="pop.id" class="w-sto src_el">
            <p class="m2 normal-small">{{ pop.name }}</p>
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
    visibility: hidden;
    transition: .5s;
}
.container input:focus ~ .src_comp{
    display: block;
    visibility: visible;
    top: 100%;
    opacity: 1;
    transition: .5s;
    
}
.src_comp:focus{
    display: block;
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
            redirect(this,{ name: 'catalog', query: { filter:`{"name": "${this.search_text}"}` } })
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
