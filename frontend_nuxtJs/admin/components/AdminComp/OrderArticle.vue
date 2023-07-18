<template>
    <article>
        <div class="order_article">
            <div class="flex">
                <img class="auto" src="https://cdekpromo.ru/chto-daet-dogovor-cdek.jpg" alt="">
                <div class="order_all_info auto">
                    <p>Всего заказов</p>
                    <p class="videl">100</p>
                </div>
            </div>
            <div class="flex">

                <img class="auto" src="https://cdekpromo.ru/chto-daet-dogovor-cdek.jpg" alt="">
                <div class="order_all_info auto">
                    <p>Общая сумма заказов</p>
                    <p class="videl">2000 руб</p>
                </div>
            </div>
        </div>
    </article>
</template>

<style>

.order_article{
    display: flex;
    width: 100%;
    height: 100%;
}
.order_article div{
    width: 50%;
    padding: 2%;
}
.order_article div img{
    width: 30%;
    aspect-ratio: 1/1;

}
@media (max-width: 1100px) {
    
.order_article div img{
    height: 50%;

}
}
.order_all_info{
    padding: 3%;
}
.order_all_info p{
    font-size: 24px;
}
.order_all_info .videl{
    font-size: 34px;
    color:blue;
}
</style>

<script>
export default {
    setup() {
        
    },
}
</script>