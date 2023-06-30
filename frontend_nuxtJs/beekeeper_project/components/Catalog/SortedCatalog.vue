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
      sorteredAlfFunc() {
          let a = this.$store.getCatalog_list.sort((x, y) => x.name.localeCompare(y.name));
          this.sorteredAlf = !this.sorteredAlf
          this.sorteredMonet = false
          this.sorteredNew = false
          this.$store.REFACTOR_CATALOG_LIST(a);
        },
      sorteredMoneyFUnc() {
          let a = this.$store.getCatalog_list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          this.sorteredMonet = !this.sorteredMonet
          this.sorteredAlf = false
          this.sorteredNew = false
          this.$store.REFACTOR_CATALOG_LIST(a);
      },
      sorteredNewFUnc() {

          let a = this.$store.getCatalog_list.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
          this.sorteredNew = !this.sorteredNew
          this.sorteredMonet = false
          this.sorteredAlf = false
          this.$store.REFACTOR_CATALOG_LIST(a);
      },
      },
  setup() {},
};
</script>
