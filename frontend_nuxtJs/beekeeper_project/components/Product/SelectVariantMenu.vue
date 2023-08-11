<template>
  <div v-if="select_productItem.weight" class="variant">
    <h3>Размер</h3>
    <div class="flex">
      <ul class="variant-ul" :style="weight_all ? 'display: block' : 'display: flex'">
        <li
          @click="select_type_weigth(ls_w.id)"
          :class="select_productItem.weight.id == ls_w.id ? 'active' : ''"
          v-for="(ls_w, index) in get_weight_type_list()"
          :key="index"
          class="photo-album-li"
        >
          <div class="h_sto">
            <p>{{ ls_w.weight }} гр</p>
          </div>
        </li>
        <li @click="weight_all = !weight_all" v-if="get_weight_type_list().length > 2 && !weight_all">
          раскрыть
        </li>
        <li @click="weight_all = !weight_all" v-if="weight_all">
          скрыть
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="css" src="~/assets/css/main/hex-tovar.css" scoped></style>
<script>
export default {
  props: ["select_productItem", "pr"],
  data(){
    return{
      weight_all: false
    }
  },
  methods: {
    select_type_weigth(pk) {
      let a = this.pr.productItemList.slice();
      let select_product = a.filter((ob) => ob.weight.id == pk)[0];
      this.$emit("select_product", select_product);
      console.log(this.select_productItem);
    },
    get_weight_type_list() {
      let list = [];
      this.pr.productItemList.forEach((element) => {
        list.push(element.weight);
      });
      return list;
    },
  },
};
</script>

<style></style>
