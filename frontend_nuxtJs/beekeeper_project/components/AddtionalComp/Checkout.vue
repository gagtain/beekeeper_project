<template>
  <div id="check_form">
    
            <div class=" h_sto">
                <input type="text" placeholder="Адрес" v-model="username" />
                <input
                  type="text"
                  placeholder="Индекс"
                  v-model="password"
                />
            </div>
           
  </div>
</template>


<style src="~/assets/css/interactive/checkbox.scss" lang="scss" scoped></style>
<style scoped>
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
import addOrder from '~/additional_func/addOrder'
export default {
    el: '#check_form',

    data(){
    return {
      USER_STATE: this.$store.getUser
    }
  },
  methods:{

    async submin_order(){
      let response_order = await addOrder()
      if (response_order.status == 200){
        this.$router.push('/orders')
      }
      
    }
  }
}
</script>
