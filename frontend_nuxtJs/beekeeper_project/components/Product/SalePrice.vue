<template>
    <div class="price_sale">

        <span style="color: gray;" class="product__price small-big cena">{{ price }}</span>
    </div>
</template>

<script>
export default {
    props:['price'],
}
</script>

<style lang="scss" src="../../assets/css/katalog/katalog.scss" scoped></style>
<style>
.price_sale{
    display: initial;
  position: absolute;
}
.cena {
position: relative;
color: gray;
font-size: 16px;
}

.cena:before {
border-bottom: 3px solid red;
top: 0;
position: absolute;
content: "";
width: 100%;
height: 50%;
transform: rotate(-7deg);
}

</style>