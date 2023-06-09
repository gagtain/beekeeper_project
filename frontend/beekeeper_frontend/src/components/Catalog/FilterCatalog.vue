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
      <li
        v-for="(pack, index) in type_packaging"
        :key="index"
        class="filter-li"
      >
        <p @click="addPackagingFilter($event)" class="normal-small">
          {{ pack.name }}
        </p>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" src="../../assets/css/katalog/filter.scss" scoped></style>
<script>
import store from "../../store";
export default {
  el: "#filter",
  name: "FilterCatalog",
  data() {
    return {
      filter_catalog: [],
      filter_class_name: [],
      filter_packaging_name: [],
      cat_list: [],
    };
  },
  props: ["catalog_list", 'category_list', 'type_packaging'],
  methods: {
    addClassFilter(event) {
      this.addClassActive(event)

      let index = this.filter_class_name.indexOf(event.target.innerHTML);
      if (index >= 0) {
        this.filter_class_name.splice(index, 1);
        console.log(this.filter_class_name);
        this.c();
      } else {
        this.filter_class_name.push(event.target.innerHTML);
        this.c();
      }
    },
    c(){
      let list = this.b(this.a())

      store.dispatch("REFACTOR_CATALOG_LIST", list);
    },
    a() {
      let sortered = this.catalog_list.slice();
      this.filter_class_name.forEach((element) => {
        sortered = sortered.filter((x) =>
          x.category.find((x) => x.name == element)
        );
      });
      return sortered
    },
    addPackagingFilter(event) {
      this.addClassActive(event)
      let index = this.filter_packaging_name.indexOf(event.target.innerHTML);
      if (index >= 0) {
        this.filter_packaging_name.splice(index, 1);
        this.c();
      } else {
        this.filter_packaging_name.push(event.target.innerHTML);
        this.c();
      }
    },
    b(sortered) {
      this.filter_packaging_name.forEach((element) => {
        sortered = sortered.filter((x) =>
          x.type_packaging.find((x) => x.name == element)
        );
      });
      return sortered
    },
     addClassActive(event){
    
      if (event.srcElement.parentNode.classList.contains("active")) {
        event.srcElement.parentNode.classList.remove("active");
      } else {
        event.srcElement.parentNode.classList.add("active");
      }
  }
  },
 

  setup() {},
};
</script>
