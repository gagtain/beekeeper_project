<template>
    <div id="pr_list_info" class="kor_all_info auto w-sto m-2">
      <p class="m2">Товаров: {{ getCountBasket() }}</p>
      <p class="m2">Вес: {{getWeight()}}</p>
      <p class="m2">
        Цена:
        {{
          ordered ? order_amount : items.reduce(function (sum, elem) {
            return sum + parseFloat(elem.productItem.price);
          }, 0)
        }}
      </p>
      <p v-if="ordered" class="m2">Цена доставки: {{ delivery_price != null ? delivery_price : 'Не выбранно' }}</p>
      <p class="m2">скидки:</p>
      <ul>
        <li>{{ getSale() }}</li>
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
  props: ['items', 'delivery_price', 'ordered', 'order_amount'],
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
        return weight_s + parseFloat(elem.productItem.dimensions.weight * elem.count);
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
      let summ = 0
      if (this.ordered){
        summ += parseFloat(this.order_amount)
        summ += parseFloat(this.delivery_price ? this.delivery_price : 0)
      }else{

      summ = this.items.reduce(function (sum, elem) {
        return sum + parseFloat(elem.productItem.price * elem.count);
      }, 0);
      }
      return summ
    },
    getSale(){
      let summ = this.items.reduce(function (sum, elem) {
        if (elem.productItem.is_sale){
          console.log(elem)
          console.log(elem.productItem.old_price, parseFloat(elem.productItem.price), elem.productItem.price)
          return sum + (parseFloat(elem.productItem.old_price) - parseFloat(elem.productItem.price))
        }
        else{
          return sum
        }
      }, 0);
      return summ
    }
  },
}
</script>