<template>
    <div style="padding-top: 50px;">
      <div class="wrapper">
        <nuxt-img preload format="webp" class="absolute w-sto h_sto" src="/images/main.webp" alt=""/>
        <div
          class="absolute main-nak"
          :class="wrapper_active ? 'actives' : ''"
        ></div>
        <div class="main relative">
          <div class="interactiv flex">
            <div class="main_center auto">
              <div class="main_text_div auto">
                <p class="main_text">Наш мед имеет ряд преимуществ!</p>
                <div class="bt">
                  <button @click="$router.push('/catalog')" class="main_bt">
                    <div class="flex sto">
                      <p class="main_bt_p">Попробовать!</p>
                    </div>
                  </button>
                </div>
              </div>
              <div v-if="!$device.isMobile" class="main_img_div">
                <img
                  :src="`${$api_root}static/online_store/images/phel.png`"
                  class="phel"
                  alt=""
                />
                <div  class="slider-produtos-wrap h_sto">
                  <swiper
                    :slidesPerView="1"
                    :spaceBetween="500"
                    :autoplay="{
                      delay: 3000,
                      disableOnInteraction: true,
                    }"
                    speed=5000
                    :modules="modules"
                    class="h_sto"
                  >
                    <swiper-slide
                      ><img
                      :src="$api_root + 'static/online_store/images/honey.png'"
                        class="main_img"
                        width="100%"
                        height="100%"
                        alt=""
                    /></swiper-slide>
                    <swiper-slide
                      ><img
                      :src="$api_root + 'static/online_store/images/honey.png'"
                        class="main_img"
                        width="100%"
                        height="100%"
                        alt=""
                    /></swiper-slide>
                    <swiper-slide
                      ><img
                      :src="$api_root + 'static/online_store/images/honey.png'"
                        class="main_img"
                        width="100%"
                        height="100%"
                        alt=""
                    /></swiper-slide>
                  </swiper>
                  <!-- <img src="images/honey.png" class="main_img" width="100%" height="100%" alt=""> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sot">
  
        <div class="interactiv auto">
          <div class="flex w-sto text_in_sot">
            <p class="big auto main-text">Популярные товары</p>
          </div>
          <div class="block_info sliders big-block">
            <div class="slider-produtos-wrap">
              
              <swiper
                :slidesPerView="1"
                :spaceBetween="30"
                :navigation="true"
                speed=1500
                :modules="modules"
                v-if="popular_product != null"
              >
                <swiper-slide
                  v-for="pop_product in popular_product"
                  :key="pop_product.id"
                >
                  <div class="hex slide auto">
                    <AddtionalCompPopularProduct :pr="pop_product"></AddtionalCompPopularProduct>
  
                  </div>
                </swiper-slide>

              </swiper>
              <div v-else class="w-sto h_sto">

                <LoadingComp></LoadingComp>
              </div>
            </div>
          </div>
          <div style="display: block;" class="block_info">
            <div class="flex w-sto jus-sp info_kart_div">
              <div class="kart">
              <div class="w-sto h_sto">
                <img style="border-radius: 40px;" class="w-sto h_sto" src="../assets/images/eco-friend.jpg" alt="">
              </div>
            </div>
              <div class="dostav_info flex">
                <div class="w-sto auto">
                  <p class="small-big VAG" style="line-height: 1;">Чистый как золото, на вкус как солнечный свет</p>
              <p class="small m2">
              Наш мед является исключительно натуральным продуктом. Без примесей, без химии.
              </p>
                </div>
              
            </div>
            
            </div>
            
            
            
          </div>

          <div class="interactiv auto">

            <div class="flex w-sto text_in_sot">
            <p class="big auto main-text">Новости</p>
          </div>
            <section style="padding: 5%;" class="auto grid">
    <article v-for="new_obj in news" :key="new_obj.id" class="grid-item">
        <div class="image">
            <img :src="this.$api_root + new_obj.main_image" />
        </div>
        <div class="info">
            <NuxtLink no-prefetch :to="`/news/${new_obj.id}`"><h2 class="VAG">{{ new_obj.title }}</h2></NuxtLink>
            <div class="info-text">
                <p>{{ new_obj.main_text.slice(40) }}...</p>
            </div>
            <div class="button-wrap">
              <NuxtLink no-prefetch class="atuin-btn" :to="`/news/${new_obj.id}`">Подробнее</NuxtLink>
            </div>
        </div>
    </article>
    
</section>
<NuxtLink no-prefetch :to="`/news`"><button style="background: rgb(160,166,62);; cursor: pointer;width: 100%;border: none;border-radius: 6px; padding: 2% 3%;"><div class="w-sto h_sto flex"><p class="auto small-big">Все новости</p></div></button>
</NuxtLink>
        </div>
          <div v-if="!$store.getUser.is_sending" class="interactiv auto">
            <div class="flex w-sto text_in_sot">
            <p class="big auto main-text">Рассылка</p>
          </div>
            <Sending></Sending>
        </div>
        </div>
        <div class="ref-block w-sto">
        <div class="flex w-sto text_in_sot">
          <p class="big auto main-text" style="color: rgb(241, 195, 96);text-shadow: 10px 10px 10px black;padding: 1%;">О нашем товаре</p>
        </div>
          <div class="interactiv auto h-sto flex">
            <div class="block_info o_product auto">
              <div class="predp">
                <div class="predp-img auto">
                  <img
                    width="100%"
                    height="100%"
                    :src="$api_root + 'static/online_store/images/3.jpg'"
                    alt=""
                  />
                </div>
                <p class="small-big predp-name">Иваненко И.П.</p>
                <p class="small">Директор компании ...</p>
              </div>
              <div class="predp-text flex">
                <p class="small-big">
                  Наша доставка распространяется на города: Lorem ipsum dolor sit
                  amet consectetur adipisicing elit. Enim, architecto veritatis?
                  Aut iure labore qui ut molestiae minima repudiandae obcaecati
                  beatae illo. Aliquam debitis minus consequuntur illum et natus.
                  Incidunt.
                </p>
              </div>
            </div>
          </div>
          <div class="interactiv">

          </div>
        </div>
      </div>
    </div>
  </template>
  <style >

@import "https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.1.0/css/swiper.min.css";
</style>
  <style lang="css" src="../assets/css/main/main.css" scoped></style>
  <style lang="css" src="../assets/css/news_min.css" scoped></style>
  <style lang="css" src="../assets/css/main/hex-tovar.css" scoped></style>
  <style scoped>
  .main_img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  
    object-fit: contain;
  }
  .slider-produtos-wrap {
    width: 100%;
  }
  .product__text p{
    height: 58px;
  }
  .predp-img img{
    width: 100%;
    height: 100%;
  }
  </style>
  <script>
  import { useHead } from "nuxt/app";
  import { Swiper, SwiperSlide } from "swiper/vue";
  import "swiper/css";
  import { Autoplay, Navigation } from "swiper";
  import LoadingComp from "~/components/AddtionalComp/LoadingComp.vue";
  import axios from "axios";
  import newsList from "~/additional_func/News/newsList";
  export default {
    name: "IndexItem",
    components: {
    Swiper,
    SwiperSlide,
    LoadingComp
},
head: {
    title: 'my website title'
},
    data() {
      return {
        popular_product: null,
        wrapper_active: false,
        type_weigth_id: null,
        type_pack_id: null,
        news: []
      };
    },
    async created() {

    },
    async mounted() {
      self = this
    axios({
      url: `${this.$api_root}/api/v0.1/beekeeper_web_api/get_popular_product?size=5`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.$store.assess_token != '' ? `Bearer ${this.$store.assess_token}` : undefined,
      },
    })
      .then(response => (this.popular_product = response.data))
      .catch(function (error) {
        console.log(error);
      });
      console.log(this.popular_product)
      this.wrapper_active = true;
      let recaptchaScript = document.createElement("script");
      recaptchaScript.setAttribute(
        "src",
        `${this.$api_root}static/online_store/js/main.js`
      );
      document.head.appendChild(recaptchaScript);
      let r = await newsList(0, 3)
      this.news = r.data
    },
    methods: {
      select_type_weigth(pk){
        this.type_weigth_id = pk
      },
      select_type_pack(pk){
        this.type_pack_id = pk
      }},
  
    setup() {
      useHead({
    title: 'Пчелиная артель - Главная',
    meta: [
      { name: 'description', content: 'My amazing site.' }
    ],
      })
      return {
        modules: [Autoplay, Navigation],
      };
    },
  
  };
  </script>