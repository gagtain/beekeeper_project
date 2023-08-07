<template>
  <div v-if="select_productItem.weight"  class="variant">
                      <h3>Размер</h3>
                      <div class="flex">
                        <ul class="variant-ul">
                          <li  @click="select_type_weigth(ls_w.id)" :class="select_productItem.weight.id == ls_w.id ? 'active' : ''"
                          
                          v-for="ls_w, index in get_weight_type_list()" :key="index" class="photo-album-li">
                           
                            <div class="h_sto">
                              <p>{{ ls_w.weight }} гр</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
</template>

<script>
export default {
    props:['select_productItem', 'pr'],
  methods:{
    select_type_weigth(pk){
      let a = this.pr.productItemList.slice()
      let select_product = a.filter(ob => ob.weight.id == pk)[0]
      this.$emit('select_product', select_product)
      console.log(this.select_productItem)
    },
    get_weight_type_list(){
      let list = []
      this.pr.productItemList.forEach(element => {
        list.push(element.weight)
      });
      return list
    }
  }
}
</script>

<style>

</style>