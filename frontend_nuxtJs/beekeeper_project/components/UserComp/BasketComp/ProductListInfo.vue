<template>
    <div id="pr_list_info" class="kor_all_info auto w-sto m-2">
      <p class="m2">Товаров: {{ getCountBasket() }}</p>
      <p class="m2">Вес: {{getWeight()}}</p>
      <p class="m2">
        Цена:
        {{
          items.reduce(function (sum, elem) {
            return sum + parseFloat(elem.productItem.product.price);
          }, 0)
        }}
      </p>
      <p v-if="ordered" class="m2">Цена доставки {{ delivery_price }}</p>
      <p class="m2">скидки:</p>
      <ul>
        <li>*в разработке*</li>
      </ul>
      <p id="is" class="small">
        Итоговая сумма:
        {{
          getSumm()
        }}
      </p>
      
    </div>
</template>

<style src="~/assets/css/account.css" scoped></style>
<script>
export default {
    el: '#pr_list_info',
  props: ['items', 'delivery_price', 'ordered'],
  data(){
    return {
      summ: 0,
    }
  },
    methods: {
    getCountBasket() {
      let count = 0;
      this.items.forEach((element) => {
        count += parseInt(element.count);
      });
      return count;
    },
    getWeight(){
      let weight = this.items.reduce(function (weight_s, elem) {
        return weight_s + parseFloat(elem.productItem.weight.weight * elem.count);
      }, 0);
      let str_weight = ``
      if (weight >= 1000){
        weight = weight / 1000
      str_weight = `${weight} кг`
      }else{

        str_weight = `${weight} гр`
      }
      return str_weight
    },
    getSumm() {
      let summ = this.items.reduce(function (sum, elem) {
        return sum + parseFloat(elem.productItem.product.price * elem.count);
      }, 0);
      if (this.ordered){
        summ += parseFloat(this.delivery_price)
      }
      return summ
    },
  },
}
</script>