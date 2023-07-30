<template>
  <div class="sorted-product flex jus-sp" id="sorted">
    <p
      @click="sorteredAlfFunc()"
      :class="sorteredAlf ? 'act_sorted-p' : ''"
      class="sorted-p small"
    >
      По имени
    </p>

    <p
      @click="sorteredMoneyFUnc()"
      :class="sorteredMonet ? 'act_sorted-p' : ''"
      class="sorted-p small"
    >
      По цене
    </p>
    <p
      @click="sorteredNewFUnc()"
      :class="sorteredNew ? 'act_sorted-p' : ''"
      class="sorted-p small"
    >
      Новое
    </p>
  </div>
</template>
<style scoped>
.act_sorted-p{
    color: red;
    cursor: default;
    pointer-events: none;
}
.sorted-p{
  cursor: pointer;
}
.sorted-product{
  width: 100%;
}
</style>
<script>
import getSearchProduct from '~/additional_func/getSearchProduct';
export default {
  el: "#sorted",
  name: "SortedCatalog",
  data() {
    return {
      sorted_list: [],
      sorteredAlf: false,
      sorteredMonet: false,
      sorteredNew: false,
    };
  },
    props: ["catalog_list"],
  methods: {
      async sorteredAlfFunc() {
          this.$store.ADD_ORDER_BY_CATALOG_PARAMS("order_by=name", ["order_by=price_min", "order_by=pk"])
          this.sorteredAlf = !this.sorteredAlf
          this.sorteredMonet = false
          this.sorteredNew = false
        },
      async sorteredMoneyFUnc() {
          this.$store.ADD_ORDER_BY_CATALOG_PARAMS("order_by=price_min", ["order_by=name", "order_by=pk"])
          this.sorteredMonet = !this.sorteredMonet
          this.sorteredAlf = false
          this.sorteredNew = false
      },
      async sorteredNewFUnc() {

          this.$store.ADD_ORDER_BY_CATALOG_PARAMS("order_by=pk", ["order_by=name", "order_by=price_min"])
          this.sorteredNew = !this.sorteredNew
          this.sorteredMonet = false
          this.sorteredAlf = false
      },
      },
  setup() {},
};
</script>
