<template>
<div class="rating-mini" id="rating">

<span v-for="i in Math.round(rating)" :key="i" class="active"></span>	
<span v-for="i in ( 5 - Math.round(rating))" :key="i"></span>    
<p class="normal-small" style="display: inline;">/{{ Math.round(rating * 100) / 100
}}</p>

</div>
</template>
<style src="~/assets/css/rating.css"></style>
<script>

export default {
    el:'#rating',
    name:'RatingComp',
    props:['rating']

}
</script>
