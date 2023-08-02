<template>
<form class="email_sending auto m2">
<p class="normal-small">Подпишитесь на рассылку, чтобы получать актуальные новости первыми</p>
<input placeholder="email" type="email" name="" id="">
<button type="submit">Подтвердить</button>
</form>  
</template>

<script>
export default {

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
		text-transform: uppercase;
		outline: 0;
		background: rgb(160,166,62);
		width: 100%;
		border: 0;
		border-radius: 5px;
		padding: 15px;
		color: #000;
		font-size: 14px;
		-webkit-transition: all 0.3 ease;
		transition: all 0.3 ease;
		cursor: pointer;
	}
</style>