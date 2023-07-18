<template>
                    <div id="rating-area" class="rating-area w-sto">

<span @click="submits(number)" v-for="number in [5,4,3,2,1]" :key="number" for="star-1" :title="'Оценка ' + number"></span>


</div>
</template>
<style scoped>
.rating-area {


margin: 0 auto;

}

.rating-area:not(:checked) > input {

display: none;

}

.rating-area:not(:checked) > span {

float: right;

width: 60px;

padding: 0;

cursor: pointer;

font-size: 54px;

line-height: 54px;

color: lightgrey;

text-shadow: 1px 1px #bbb;

}

.rating-area:not(:checked) > span:before {

content: '★';

}

.rating-area > input:checked ~ span {

color: gold;

text-shadow: 1px 1px #c60;

}

.rating-area:not(:checked) > span:hover,

.rating-area:not(:checked) > span:hover ~ span {

color: gold;

}

.rating-area > input:checked + span:hover,

.rating-area > input:checked + span:hover ~ span,

.rating-area > input:checked ~ span:hover,

.rating-area > input:checked ~ span:hover ~ span,

.rating-area > span:hover ~ input:checked ~ span {

color: gold;

text-shadow: 1px 1px goldenrod;

}

.rate-area > span:active {

position: relative;

}
@media (max-width: 500px) {
    .rating-area:not(:checked) > span::before {
        font-size: 44px;
    }
    .rating-area span{
        width: 44px;
    }
    .rating-area:not(:checked) > span{
        width: 44px;
    }
    .rating-area{
        width: auto;
    }
}
@media (max-width: 320px) {
    .rating-area:not(:checked) > span::before {
        font-size: 28px;
    }
    .rating-area span{
        width: 28px;
    }
    .rating-area:not(:checked) > span{
        width: 28px;
    }
    .rating-area{
        width: auto;
    }
}
</style>
<script>
import addRatingProduct from '~/additional_func/addRatingProduct'
export default{
    el:'#rating-area',
    props:['product_id'],
    methods:{
        async submits(rating){
            let response_rating_create = await addRatingProduct(this.product_id, rating)
            if (response_rating_create.status == 400){
                this.$emit('submit', 400)
            }else{

                this.$emit('submit', 201)
            }
        }
    }
}

</script>