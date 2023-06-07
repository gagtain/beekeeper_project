<template>
    <div class="sot-ob">
        <div class="wrapper flex w-sto">

            <div class="tovar_in flex interactiv jus-sp auto" id="tovar">
                <div v-if="tovar" class="ob flex jus-sp w-sto">

                    <div class="images_tovar flex">
                        <div class="min">
                            <ul>
                                <li>
                                    <img width="100%" class="tovar_img_the_min" src="images/2.png" alt="">
                                </li>
                                <li>
                                    <img width="100%" class="tovar_img_the_min" src="images/2.png" alt="">
                                </li>
                                <li>
                                    <img width="100%" class="tovar_img_the_min" src="images/2.png" alt="">
                                </li>
                            </ul>
                        </div>
                        <div class="max">
                            <img v-if="tovar" class="tovar_img_the_max" :src="$api_root + tovar.image" alt="">
                        </div>
                    </div>
                    <div class="tovar_infa">
                        <div class="tovar_name">
                            <p class="black bolshoi auto">{{tovar.name}}</p>
                        </div>
                        <div class="tovar_two">
                            <p class="black nebolsh">Категории: {{getCategoryList().join(', ')}}</p>
                        </div>
                        <div class="tovar_two">
                            <p class="normal-small kolvo">количество</p>
                                                    <input type="number" value="1" max="22" class="size_tovar" name=""
                                                        id="">
                        </div>
                        <div class="tovar_two">
                            <p class="black malenkii">Цвет: класс</p>
                        </div>
                        <div class="tovar_two but">
                            <select class="select_raz black" id="">
                                <option value="" selected>100 г</option>
                            </select>
                        </div>
                        <div class="flex tovar_two jus-sp but but-b">
                            <AddBasket :id="tovar.id"></AddBasket>
                            <FavoriteComp :id="tovar.id"></FavoriteComp>
                        </div>
                        <div class="tovar_two">
                            <p class="black malenkii">Подробности</p>
                        </div>
                        <div class="tovar_two vib">
                            <div class="flex jus-sp op_contex" @click="open_descrip()">
                                <p class="black malenkii vib_">Описание</p>
                                <div class="contex" style="background-image: url('img/Vector (6).png');"></div>

                            </div>
                            <div v-if="isDescription" class="context_text">
                                <p class="malenkii black">Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                                    Aspernatur,
                                    consectetur eius! Optio quas accusantium quis excepturi aut dicta totam cum atque
                                    dolor
                                    culpa aliquid vitae, ratione veritatis consequuntur maiores beatae.</p>

                            </div>
                        </div>
                        <div class="tovar_two vib">
                            <div class="flex jus-sp op_contex" @click="open_sostav()">
                                <p class="black malenkii vib_">Состав</p>
                                <div class="contex" style="background-image: url('img/Vector (6).png');"></div>

                            </div>
                            <div v-if="isSostav" class="context_text">
                                <p class="malenkii black">Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                    Tempora
                                    natus
                                    rem temporibus deserunt repudiandae iure officia cumque eum omnis sapiente illum
                                    voluptates,
                                    amet ex optio consectetur sed dolore sit eaque.</p>

                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="css" src="../../assets/css/tovar.css"></style>
<script>
import getTovar from "../../additional_func/getTovar"
import AddBasket from '../AddtionalComp/AddBasket.vue'
import FavoriteComp from '../AddtionalComp/FavoriteComp.vue'
export default {
    el: '#tovar',
    name: 'TovarBase',
    components:{
        AddBasket,
        FavoriteComp
    },
    data(){
        return {
            tovar: null,
            isDescription: false,
            isSostav: false
        }
    },
    async created(){
        let response_tovar = await getTovar(this.$route.params.id)
        console.log(response_tovar)
        if (response_tovar.status == 200){
            this.tovar = response_tovar.data
        }
    },
    methods: {
        getCategoryList(){
            let cat_list = this.tovar.category.slice()
            let l = []
            cat_list.forEach(element => {
                l.push(element.name)
            });
            return l
        },
        open_descrip(){
            this.isDescription = !this.isDescription
        },
        open_sostav(){
            this.isSostav = !this.isSostav
        }
    }
}
</script>