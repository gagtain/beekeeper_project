<template>
  <div id="filter">
    <p class="filter-p small">Категория</p>
    <ul class="filter-ul">
      <li
        @click.stop="add($event, `category__name=${cat.name}`)"
        v-for="(cat, index) in category_list"
        :key="index"
        class="filter-li normal-small"
      >
          {{ cat.name }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" src="../../assets/css/katalog/filter.scss" scoped></style>
<script>
import getCategoryList from '~/additional_func/getCategoryList';

export default {
  el: "#filter",
  name: "FilterCatalog",
  data() {
    return {
      filter_catalog: [],
      filter_class_name: [],
      filter_packaging_name: [],
      cat_list: [],
      category_list: []
    };
  },
  async mounted(){
    let r = await getCategoryList()
    this.category_list = r.data
  },
  methods: {
    add(event, params){
      if (this.addClassActive(event.srcElement)){

        this.$store.ADD_CATALOG_PARAMS(params)
      }else{
        
      this.$store.REMOVE_CATALOG_PARAMS(params)
      }

    },
    addClassActive(event) {
      console.log(event)
      if (event.classList.contains("active")) {
        event.classList.remove("active");
        return false
      } else {
        event.classList.add("active");
        return true
      }
    },
  },

  setup() {},
};
</script>
