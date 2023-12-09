<template>
    <div class="m2">
        <p align="left" class="VAG">Выберете город</p>
        <input @input="onChoise()" v-model="select_text" list="colors-list">

<datalist id="colors-list">
    <p v-if="is_error">{{ error_message }}</p>
  <option class="option" v-for="el in list_state_region.data" :key="el.id" :value="el.state + ' - ' + el.region"></option>
</datalist>
    </div>
</template>

<script>
import getStateRegion from '~/additional_func/Delivery/getStateRegion'
export default {

    data(){
        return{
            list_state_region: {
                data: []
            },
            select_text: '',
            delivery_info: null,
            is_error: false,
            error_message: ''
        }
    },
    async created(){
        this.list_state_region = await getStateRegion()
    },
    methods:{
      onChoise(){
        console.log(1324)
        let r = this.order_info_select()
        if (r.status){
            let info = {
            id: this.select_text,
            price: 0,
            delivery_type: "Заказ через собственную доставку"
            
        }
        this.delivery_info = info
        this.$emit('onChoise', this.delivery_info)
        }
        
      },
      order_info_select(){
        if (!this.select_text){
            this.is_error = true
            this.error_message = "не выбран адрес"
            return {
                status: false,
                message: "не выбран адрес"
            }
        }
        let res = false
        this.list_state_region.data.forEach((el) => {
            if (el.state + ' - ' + el.region == this.select_text){
                res = true
            }
        
      })
      if (!res){
            this.is_error = true
            this.error_message = "неверный адрес"
            return {
                status: false,
                message: "неверный адрес"
            }
        }
        return {
            status: true
        }
      
    
      }
    }

}
</script>

<style>
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
.option{
    background-color: #fff;
    color: #000;
}
</style>

