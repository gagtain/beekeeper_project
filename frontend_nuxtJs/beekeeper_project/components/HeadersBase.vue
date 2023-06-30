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
              <img @click="alert(123)" src="/favicon.ico" class="logo_img auto" alt="" />
            </div>
          </div>
          <div class="context_menu context_menu_info">
            <div  @click="mob_menu_click()" :class="is_menu_mobile ? 'menu_active' : ''" class="menu_items mob_men relative" id="mob_hed">
              <span  :class="is_menu_mobile ? 'menu_pop_mob_active' : ''"></span>
            </div>
            <div class="menu_items" id="deks_hed">
              <NuxtLink to="/"
                ><p class="menu_items_text">Главная</p></NuxtLink
              >
            </div>
            <div class="menu_items flex relative" id="deks_hed">
              <NuxtLink to="/catalog"
                ><p class="menu_items_text">Товары</p></NuxtLink
              >
              <span class="material-symbols-outlined"> expand_more </span>
            </div>
            <div class="menu_items no_b_border">
                <SeacrhComp></SeacrhComp>
            </div>
          </div>
          <div class="context_menu user_context">
            <div
              v-if="($store.getUser.username != null && typeof $store.getUser.username !== 'undefined')"
              class="flex jus-sp user_in relative"
            >
              <img
                class="user_img"
                :src="$api_root + $store.getUser.image"
                alt=""
              />
              <div class="flex w-sto h-sto from_name">
                <p class="menu_items_text user_name auto">
                  {{ $store.getUser.username }}
                </p>
              </div>
              <div class="context_menu_ absolute">
                <ul>
                  <NuxtLink to="/profile">
                  <li class="flex">
                      <p class="normal-small auto">Аккаунт</p>
                  </li>
                </NuxtLink>
                    <NuxtLink to="/basket">
                  <li class="flex">
                      <p class="normal-small auto">Корзина</p>
                  </li>
                </NuxtLink>
                    <NuxtLink to="/orders">
                  <li class="flex">
                      <p class="normal-small auto">Заказы</p>
                  </li>
                </NuxtLink>
                  <NuxtLink to="/favorite">
                  <li class="flex">
                    <NuxtLink to="/favorite" class="normal-small auto"
                      >Избранное</NuxtLink
                    >
                  </li></NuxtLink>
                </ul>
              </div>
              <span class="material-symbols-outlined auto"> expand_more </span>
            </div>
            <div v-else class="flex jus-sp user_in relative" style="min-width: 50%;">
                    <NuxtLink no-prefetch to="/register" class=" auto"
                      >Регистрация</NuxtLink>
                    <NuxtLink no-prefetch to="/login" class=" auto"
                      >Вход</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="is_menu_mobile ? 'menu_pop_mob_active' : ''" class="absolute menu_pop_mob">
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
          <NuxtLink to="/"
                      ><li>Главная</li></NuxtLink>
          <NuxtLink to="/additional"><li>О нас</li></NuxtLink>
          <NuxtLink to="/zakaz_list"><li>Заказы</li></NuxtLink>
          <NuxtLink to="/polit"><li>Политика соглашения</li></NuxtLink>
          <NuxtLink to="/add_money"><li>Пополнить счет</li></NuxtLink>
        </ul>
      </div>
    </div>
    <div @click="mob_menu_click()" :class="is_menu_mobile ? 'menu_pop_mob_zatem_active' : ''" class="absolute menu_pop_mob_zatem"></div>
  </div>
</template>
<style src="../assets/css/interactive/headers.css" scoped></style>
<style>
a{
  text-decoration: none;
}
</style>
<script>
export default defineNuxtComponent({
  name: "HeadersBase",
  el: "#header",
  
  async asyncData() {
  },
  mounted() {
    window.addEventListener("scroll", this.scrollToHeaderLogo);
  },
  data() {
    return {
      USER_STATE: {
        username: "",
        FIO: "",
        image: "",
        active: false,
        scroll_top: 0
      },
        is_menu_mobile: false
    };
  },
  methods: {
    scrollToHeaderLogo() {
      if (window.innerWidth >= 701) {
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
    },
    mob_menu_click(){
      console.log(this.is_menu_mobile)
      this.is_menu_mobile = !this.is_menu_mobile
    }
  },
});
</script>
