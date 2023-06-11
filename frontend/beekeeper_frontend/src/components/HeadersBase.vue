<template>
  <div id="header">
    <div
      class="menu"
      style="background: linear-gradient(45deg, yellow, orange)"
    >
      <div class="absolute w-sto h_sto g"></div>
      <div class="interactiv h_sto">
        <div class="w-sto name_org flex" id="mob_mob_block">
          <p class="auto">Уварово пасечник</p>
        </div>

        <div class="menu_ ">
          <div class="logo relative">
            <div class="logo-page flex absolute">
              <img src="/favicon.ico" class="logo_img auto" alt="" />
            </div>
          </div>
          <div class="context_menu context_menu_info">
            <div class="menu_items mob_men relative" id="mob_hed">
              <span></span>
            </div>
            <div class="menu_items" id="deks_hed">
              <RouterLink to="/"
                ><p class="menu_items_text">Главная</p></RouterLink
              >
            </div>
            <div class="menu_items flex relative" id="deks_hed">
              <RouterLink to="/catalog"
                ><p class="menu_items_text">Товары</p></RouterLink
              >
              <span class="material-symbols-outlined"> expand_more </span>
            </div>
            <div class="menu_items no_b_border">
              <div class="container relative">
                <input class="input" type="text" placeholder="Search" />
                <div class="zone_search absolute"></div>
              </div>
            </div>
          </div>
          <div class="context_menu user_context">
            <div
              v-if="USER_STATE.username != ''"
              class="flex jus-sp user_in relative"
            >
              <img
                class="user_img"
                :src="$api_root + USER_STATE.image"
                alt=""
              />
              <div class="flex w-sto h-sto from_name">
                <p class="menu_items_text user_name auto">
                  {{ USER_STATE.username }}
                </p>
              </div>
              <div class="context_menu_ absolute">
                <ul>
                  <li class="flex">
                    <RouterLink to="/profile" class="normal-small auto"
                      >Аккаунт</RouterLink
                    >
                  </li>
                  <li class="flex">
                    <RouterLink to="/basket" class="normal-small auto"
                      >Корзина</RouterLink
                    >
                  </li>
                  <li class="flex">
                    <RouterLink to="/favorite" class="normal-small auto"
                      >Избранное</RouterLink
                    >
                  </li>
                </ul>
              </div>
              <span class="material-symbols-outlined auto"> expand_more </span>
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
            <img
              :src="$api_root + 'static/online_store/images/logo.png'"
              class="logo_img auto"
              alt=""
            />
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
    <div class="absolute menu_pop_mob_zatem"></div>
  </div>
</template>
<style scoped>
@import "../assets/css/interactive/search.css";
@import "../assets/css/interactive/headers.css";
@import "../assets/css/interactive/search.css";
</style>

<script>
import { mapGetters } from "vuex";
export default {
  name: "HeadersBase",
  el: "#header",
  created() {
    window.addEventListener("scroll", this.scrollToHeaderLogo);
  },
  data() {
    return {
      user: {
        username: "",
        FIO: "",
        image: "",
        active: false,
        scroll_top: 0
      },
    };
  },
  methods: {
    scrollToHeaderLogo() {
      if (window.width >= 701) {
        this.menu_scroll_ev(50);
      } else {
        this.menu_scroll_ev(10);
      }
    },
    menu_scroll_ev(px){

	if (window.scrollY > this.scroll_top){
        this.scroll_top = window.scrollY
        document.getElementsByClassName('logo-page')[0].style.top = `-${px}px`;
        document.getElementsByClassName('logo-page')[0].style.opacity = 0.5;
    }else{
        this.scroll_top = window.scrollY
        document.getElementsByClassName('logo-page')[0].style.top = `0px`;
        document.getElementsByClassName('logo-page')[0].style.opacity = 1;
    }
    }
  },
  computed: {
    ...mapGetters(["USER_STATE"]),
  },
};
</script>
