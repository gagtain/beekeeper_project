<template>
  <form id="DeliveryInfoSubmitFrom" action="" method="get">

    <input type="text" name="track_number" value="" placeholder="Трек номер">
    <button @click.prevent="submit()" style="margin-top: 2%;" class="btn">Добавить данные доставки</button>
  </form>
</template>
<style src="~/assets/styles/new.css"  scoped>
</style>
<style scoped>
input {
		outline: 0;
		background: #f2f2f2;
		width: 100%;
		border: 0;
		border-radius: 5px;
		margin: 0 0 15px;
		padding: 15px;
		box-sizing: border-box;
		font-size: 18px;
	}
button {
    text-transform: uppercase;
    outline: 0;
    background: #4CAF50;
    width: 100%;
    border: 0;
    
    border-radius: 5px;
    padding: 15px;
    color: #FFFFFF;
    -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
    cursor: pointer;
    font-size: 24px;
}
</style>
<script>
import deliveryAddTrackNumber from '~/http/delivery/deliveryAddTrackNumber';
export default {
    props:['delivery'],
    methods:{
        async submit(){
            let data = new FormData(document.getElementById('DeliveryInfoSubmitFrom'))

            let r = await deliveryAddTrackNumber(this.delivery.id, data)
            console.log(this.delivery)
            
            this.$emit('delivery_info_submit', r.data)
        }
    }
}
</script>

<style>

</style>