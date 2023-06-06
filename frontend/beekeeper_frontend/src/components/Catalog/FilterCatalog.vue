<template>
  <div id="filter">
    <p class="filter-p small">Категория</p>
    <ul class="filter-ul">
      <li v-for="(cat, index) in category_list" :key="index" class="filter-li">
        <p @click="addClassFilter($event)" class="normal-small">
          {{ cat.name }}
        </p>
      </li>
    </ul>
    <p class="filter-p small">Тип упаковки</p>
    <ul class="filter-ul">
      <li v-for="pack, index in type_packaging" :key="index" class="filter-li">
        <p @click="addPackagingFilter($event)" class="normal-small">{{ pack.name }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import getCategorylist from "../../additional_func/getCategoryList";
import getType_packaging_list from "../../additional_func/getType_packaging_list";
import store from '../../store'
export default {
    el: '#filter',
    name: 'FilterCatalog',
  data() {
    return {
      filter_catalog: [],
      category_list: [],
      type_packaging: [],
      filter_class_name: [],
      filter_packaging_name: [],
      cat_list:[]
    };
  },
  props: ['catalog_list'],
  async created(){
    let category_response = await getCategorylist();
    this.category_list = category_response.data;
    let type_packaging_response = await getType_packaging_list();
    this.type_packaging = type_packaging_response.data;
  },
  methods:{
    addClassFilter(event) {
        console.log(this.filter_class_name)
      let index = this.filter_class_name.indexOf(event.target.innerHTML);
      if (index >= 0) {

        this.filter_class_name.splice(index, 1);
        console.log(this.filter_class_name)
        this.a()
      } else {
        this.filter_class_name.push(event.target.innerHTML);
        this.a()
      }
    },
    a(){
      let sortered = this.catalog_list.slice();
      this.filter_class_name.forEach((element) => {
        sortered = sortered.filter((x) =>
          x.category.find((x) => x.name == element)
        );
      });
      store.dispatch('REFACTOR_CATALOG_LIST', sortered)
    },
    addPackagingFilter(event) {
      let index = this.filter_packaging_name.indexOf(event.target.innerHTML);
      if (index >= 0) {

        this.filter_packaging_name.splice(index, 1);
        this.b()
      } else {
        this.filter_packaging_name.push(event.target.innerHTML);
        this.b()
      }
    },
    b(){
      let sortered = this.catalog_list.slice();
      this.filter_packaging_name.forEach((element) => {
        sortered = sortered.filter((x) =>
          x.type_packaging.find((x) => x.name == element)
        );
      });
      store.dispatch('REFACTOR_CATALOG_LIST', sortered)
    },
  },
  
  setup() {},
};
</script>
