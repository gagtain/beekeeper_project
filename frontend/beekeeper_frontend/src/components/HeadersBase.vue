<template>
<div id="header">
    <div class="menu" style="background: linear-gradient(45deg, yellow, orange);">
        <div class="absolute w-sto h_sto g">

        </div>
        <div class="interactiv h_sto">
            <div class="w-sto name_org flex" id="mob_mob_block">
                <p class="auto">Уварово пасечник</p>
            </div>

            <div class="menu_ h_sto">
                <div class="logo relative">
                    <div class="logo-page flex absolute">
                        <img src="http://localhost:8000/static/online_store/images/logo.png" class="logo_img auto" alt="">
                    </div>


                </div>
                <div class="context_menu context_menu_info">
                    <div class="menu_items mob_men relative" id="mob_hed">
                        <span></span>
                    </div>
                    <div class="menu_items" id="deks_hed">
                        <p class="menu_items_text">Главная</p>
                    </div>
                    <div class="menu_items flex relative" id="deks_hed">
                        <p class="menu_items_text">Товары</p>
                        <span class="material-symbols-outlined">
                            expand_more
                        </span>

                    </div>
                    <div class="menu_items no_b_border">
                        <div class="container relative">
                            <input class="input" type="text" placeholder="Search">
                            <div class="zone_search absolute">

                            </div>
                        </div>
                    </div>
                </div>
                <div class="context_menu user_context">
                    <div v-if="user.active" class="flex jus-sp user_in relative">
                            
                        <img class="user_img" :src="$api_root + user.image" alt="">
                        <div class="flex w-sto h-sto from_name">
                            <p class="menu_items_text user_name auto">{{ user.username }}</p>
                        </div>
                        <div class="context_menu_ absolute">
                            <ul>
                                <li class="flex">
                                    <p class="normal-small auto">Аккаунт</p>
                                </li>
                                <li class="flex">
                                    <p class="normal-small auto">Корзина</p>
                                </li>
                                <li class="flex">
                                    <p class="normal-small auto">Избранное</p>
                                </li>
                            </ul>
                        </div>
                        <span class="material-symbols-outlined auto">
                            expand_more
                        </span>
                    </div>
                    <div v-else class="flex jus-sp user_in relative"> 
                        <a href="/registry">Регистрация</a>
                        <a href="/login">Вход</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
<div class="absolute menu_pop_mob">
    <div class="h_sto w-sto sote">
        <div class="logo-sote auto">
                    <div class="logo-page flex auto">
                        <img src="http://localhost:8000/static/online_store/images/logo.png" class="logo_img auto" alt="">
                    </div>


                </div>
                <p class="VAG menu_mob_p_org_name small">Уварово пасечник</p>
                <ul>
                        <li>Главная</li>
                        <li>О нас</li>
                        <li>Заказы</li>
                        <li>Политика соглашения</li>
                        <li>Пополнить счет</li>
                    </ul>
    </div>
</div>
<div class="absolute menu_pop_mob_zatem">

</div>
</div>
</template>
<style scoped>
@import '../assets/css/interactive/search.css';
@import '../assets/css/interactive/headers.css';
@import '../assets/css/interactive/search.css';
</style>

<script>
import axios from "axios";
import getCookie from "../additional_func/getCookie"

export default ({
    name: 'HeadersBase',
    el: '#header',
    created(){
let self = this
    axios({
        url: `${this.$api_root}/api/v0.1/beekeeper_web_api/token/verif`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getCookie('assess')}`
        },
      })
        .then(function (response) {
          self.user = response.data
          self.user.active = true
        })
        .catch(function (error) {
          console.log(error);
          
        });
    },
    
  data(){
    return {
      user: {
        'username': '',
        'FIO': '',
        'image': '',
        'active': false
      }
    }
  },
    
    
})
</script>
