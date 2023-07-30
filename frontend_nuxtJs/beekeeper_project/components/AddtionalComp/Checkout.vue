<template>
  <div id="check_form">
    <p class="VAG" align="left">Доставка</p>
            <div class=" h_sto">
              
                <div v-if="delivery_info">
                  <div class="relative">

                    <input type="text" disabled  v-model="delivery_info.price" />
  <span class="floating-label active">Цена</span>
                  </div>
                  <div class="relative">

                    <input type="text" disabled  v-model="delivery_info.id" />
  <span class="floating-label active">Номер постмата</span>
                  </div>
                  <div class="relative">

                    <input type="text" disabled  v-model="delivery_info.PVZ.Address" />
  <span class="floating-label active">Адрес</span>
                  </div>
                  <div class="relative">

                    <input type="text"  disabled v-model="delivery_info.term" />
  <span class="floating-label active">Примерное время доставки</span>
                  </div>
                </div>
            </div>
           <SDEKcart :products="this.$store.getUser.basket" v-on:onChoise="onChoise($event)"></SDEKcart>
  </div>
</template>


<style src="~/assets/css/interactive/checkbox.scss" lang="scss" scoped></style>
<style scoped>
.error_list{
	min-height: 19px;
	text-align: left;
}
.error_list div:not(:first-child){
	margin-left: 2%;
}
.error_list div{
	color: brown;
  text-align: left;
}
</style>
<style scoped>
.floating-label {
	position: absolute;
	pointer-events: none;
	top: 20%;
	left: 10px;
	transition: 0.2s ease all;
}
input:focus ~ .floating-label, .floating-label.active{
	top: -4px;
	left: 10px;
	font-size: 13px;
	opacity: 1;
}
input {
		font-family: "Roboto", sans-serif;
		outline: 0;
		background: #f2f2f2;
		width: 100%;
		border: 0;
		border-radius: 5px;
		margin: 0 0 15px;
		padding: 15px;
		box-sizing: border-box;
		font-size: 14px;
	}
    .submit_order_btn {

display: inline-block;
margin: auto;
margin-top: 6%;
padding: 20px 0px;
border: none;

border-radius: 12px;
font-size: 20px;
font-weight: 700;
color: #000;
position: relative;
background: linear-gradient(45deg, yellow, orange);
box-shadow: 2px 2px 25px -7px black;
cursor: pointer;

}
 </style>
<script>
import { helpers, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import SDEKcart from './SDEKcart.vue';
export default {
  components: { SDEKcart },
    el: '#check_form',

    data(){
    return {
      USER_STATE: this.$store.getUser,
      delivery_info: null
    }
  },
  methods:{

    order_info_select(){
      
      if (this.delivery_info == null){
        return {
          status: false,
        }
      }else{
        return {
          status: true,
        }
      }
    },
    async onChoise(info){
      this.delivery_info = await info
      this.$emit('delivery', this.delivery_info)
    }
  },
setup(){
    const state = reactive({
      adress: {
        value: "",
      },
      index: {
        value: "",
      },
    })
    const rules = {
      adress: {
        value: {
            required: helpers.withMessage('Требуется', required)
        },
      },
      index: {
        value: {
            required: helpers.withMessage('Требуется', required)
        },
      },
    }
    const v$ = useVuelidate(rules, state)

    return { state, v$ }
  },
}
</script>
