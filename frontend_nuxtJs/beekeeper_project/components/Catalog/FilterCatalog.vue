<template>
  <div id="filter">
    <p class="filter-p small">Категория</p>
    <ul class="filter-ul">
      <li
        @click="addClassFilter($event)"
        v-for="(cat, index) in category_list"
        :key="index"
        class="filter-li"
      >
        <p @click.stop="addClassFilter($event)" class="normal-small">
          {{ cat.name }}
        </p>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" src="../../assets/css/katalog/filter.scss" scoped></style>
<script>
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
  props: ["catalog_list", "category_list"],
  methods: {
    addClassFilter(event) {
      event = event?.srcElement?.children[0] ? event.srcElement : event.target.parentNode
      this.addClassActive(event);

      let index = this.filter_class_name.indexOf(
        event.children[0].innerHTML
      );
      if (index >= 0) {
        this.filter_class_name.splice(index, 1);
        console.log(this.filter_class_name);
        this.c();
      } else {
        this.filter_class_name.push(event.children[0].innerHTML);
        this.c();
      }
    },
    c() {
      let list = this.a();
      
      this.$store.REFACTOR_CATALOG_LIST(list);
    },
    a() {
      
      let sortered = this.catalog_list.slice();
      this.filter_class_name.forEach((element) => {
        console.log(element)
        sortered = sortered.filter((x) =>
          x.category.find((x) => x.name == element)
        );
      });
      return sortered;
    },
    addClassActive(event) {
      console.log(event)
      if (event.classList.contains("active")) {
        event.classList.remove("active");
      } else {
        event.classList.add("active");
      }
    },
  },

  setup() {},
};
</script>
