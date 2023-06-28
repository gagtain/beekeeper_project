<template>
  
  <div class="register_zakaz">
    <button v-if="USER_STATE.basket.length" class="w-sto" @click="submin_order()"> <div class="fon_btn"></div>Оформить</button>
      <RouterLink v-else to="/catalog"><button class="w-sto"> <div class="fon_btn"></div> Добавить товар</button></RouterLink>
    <div class="kor_all_info auto w-sto m-2">
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
        <li>*в разработке*</li>
      </ul>
      <p id="is" class="small">
        Итоговая сумма:
        {{
          getSumm()
        }}
      </p>
      
    </div>
  </div>
</template>

<style lang="css" src="../../../assets/css/account.css" scoped></style>
<style scoped>
.fon_btn{
  background: url(http://localhost:8080/img/sot.0b9dac38.png) center no-repeat;
opacity: 0.1;
position: absolute;
height: 100%;
width: 100%;
top: 0;
left: 0;
}
</style>
<script>
import addOrder from '~/additional_func/addOrder';
export default {
  el: "#reg_zakaz",
  name: "BasketInfo",
  data(){
    return {
      summ: 0,
      USER_STATE: this.$store.getUser
    }
  },
  created() {},
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
    async submin_order(){
      let response_order = await addOrder()
      if (response_order.status == 200){
        this.$router.push('/orders')
      }
      
    }
  },
};
</script>
