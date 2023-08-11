<template>
<form class="email_sending auto m2">
<p class="normal-small">Подпишитесь на рассылку, чтобы получать актуальные новости первыми</p>
<input v-model="email" placeholder="email" type="email" name="" id="">
<button @click.prevent="add_sending()" type="submit"><div class="w-sto h_sto flex"><p class="auto small-big">Подтвердить</p></div></button>
</form>  
</template>

<script>
import addSending from '~/additional_func/Sending/addSending'
export default {
	data(){
		return{
			email: ''
		}
	},
	methods:{
		async add_sending(){
			let r = await addSending(this.email)
			if (r.status == 200){

				this.$store.REFACTOR_TOOLTIP({
			status: true,
			title: 'Успешно'
		})  
		this.$store.REFACTOR_USER_SENDING(true)
			}
		else if(r.status == 401){
                this.$router.push('/login?message=Для данного действия необходимо авторизоваться')
            }  
		}
	}
}
</script>
<style scoped>
.email_sending{
    width: 600px;
    max-width: 100%;
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
	button {
		background: rgb(160,166,62);; cursor: pointer;width: 100%;border: none;border-radius: 6px; padding: 2% 3%;
	}
</style>