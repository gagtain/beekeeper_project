<template>
    <div class="images_tovar flex" id="galery_product">
                        <div class="min">
                            <ul class="jus-sp-ar">
                                <li class="li_min_img">
                                    <img @click="a($event)" class="tovar_img_the_min" :src="$api_root + image.slice(1)" alt="">
                                </li>
                                <li class="li_min_img" v-for="im, index in ImageProductList" :key="index">
                                    <img @click="a($event)" class="tovar_img_the_min" :src="$api_root + im.photo.slice(1)" alt="">
                                </li>
                            </ul>
                        </div>
                        <div class="max">
                            <img id="main_tovar_img" class="tovar_img_the_max" :src="$api_root + image.slice(1)" alt="">
                        </div>
                    </div>
</template>

<style lang="css" src="../../assets/css/tovar.css" scoped></style>
<style >
.tovar_img_the_min{
    width: 100%;
    cursor: pointer;
}
</style>


<script>
export default {
    el: 'galery_product',
    name: 'TovarImage',
    props:['image', 'ImageProductList'],
    created(){
        console.log(this.image)
    },
    methods:{
        a(img){
            document.getElementById('main_tovar_img').src = img.srcElement.src
        }
    }
}
</script>