<template>
  <div class="register_zakaz">
    <div class="kor_all_info auto w-sto">
      <p class="VAG small zakaz_info_of">Информация о корзине</p>
      <p class="m2">Товаров: {{ getCountBasket() }}</p>
      <p class="m2">Вес: {{getWeight()}}</p>
      <p class="m2">
        Цена:
        {{
          USER_STATE.basket.reduce(function (sum, elem) {
            return sum + parseFloat(elem.productItem.product.price);
          }, 0)
        }}
      </p>
      <p class="m2">скидки:</p>
      <ul>
        <li>Скидки на товары: 1000р</li>
      </ul>
      <p id="is" class="small">
        Итоговая сумма:
        {{
          getSumm()
        }}
      </p>
      <button class="w-sto">Оформить</button>
    </div>
  </div>
</template>

<style lang="css" src="../../../assets/css/account.css" scoped></style>

<script>
import { mapGetters } from "vuex";
export default {
  el: "#reg_zakaz",
  name: "BasketInfo",
  data(){
    return {
      summ: 0
    }
  },
  created() {},
  computed: {
    ...mapGetters(["USER_STATE"]),
  },
  methods: {
    getCountBasket() {
      let count = 0;
      this.USER_STATE.basket.forEach((element) => {
        count += parseInt(element.count);
      });
      return count;
    },
    getWeight(){
      let weight = this.USER_STATE.basket.reduce(function (weight_s, elem) {
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
      let summ = this.USER_STATE.basket.reduce(function (sum, elem) {
        return sum + parseFloat(elem.productItem.product.price * elem.count);
      }, 0);
      return summ
    },
  },
};
</script>
