<template>
    <div style="padding-top: 50px;">
      <div class="wrapper">
        <nuxt-img format="webp" 
        rel="preconnect"
  sizes="sm:100vw md:100vw lg:100vw"
        
        class="absolute w-sto h_sto" src="/images/main.jpg" alt=""/>
        <div
          class="absolute main-nak"
          :class="wrapper_active ? 'actives' : ''"
        ></div>
        <div class="main relative">
          <div class="interactiv flex">
            <div class="main_center auto">
              <div class="main_text_div auto">
                <p class="main_text">{{ get_obj_text("1", "text") }}</p>
                <div class="bt flex m2">
                  <button @click="$router.push('/catalog')" :style="$device.isDesktop ? 'width: 45%; margin: 0;' : ''" class="main_bt">
                    <div class="flex sto">
                      <p class="main_bt_p">Попробовать!</p>
                    </div>
                  </button>
                  <a href="#advantages" v-if="$device.isDesktop" style="margin: 0;margin-left: 8px; width: 45%;" class="main_bt">
                    <div class="flex sto">
                      <p class="main_bt_p">Посмотреть!</p>
                    </div>
                  </a>
                </div>
              </div>
              <div v-if="!$device.isMobileOrTablet" class="main_img_div">
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
                      :src="`${$api_root.slice(0, -1)}${get_obj_text('1', 'image')}`"
                        class="main_img"
                        width="100%"
                        height="100%"
                        alt=""
                    /></swiper-slide>
                    <swiper-slide
                      ><img
                      :src="`${$api_root.slice(0, -1)}${get_obj_text('1', 'image')}`"
                        class="main_img"
                        width="100%"
                        height="100%"
                        alt=""
                    /></swiper-slide>
                    <swiper-slide
                      ><img
                      :src="`${$api_root.slice(0, -1)}${get_obj_text('1', 'image')}`"
                        class="main_img"
                        width="100%"
                        height="100%"
                        alt=""
                    /></swiper-slide>
                  </swiper>
                  <!-- <img src="images/honey.png" class="main_img" width="100%" height="100%" alt=""> -->
                </div>
              </div>
              <div v-else>

                <div style="display: block;" class="">
            <div class="flex w-sto jus-sp info_kart_div">
              <div class=" w-sto flex">
                <div class="w-sto auto auto">
                  <Advantages_slider></Advantages_slider>
                </div>
              
            </div>
            
            </div>
            
            
            
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
          <div  v-if="$device.isDesktop"  class="flex w-sto text_in_sot relative">
            <div id="advantages" class="absolute" style="top: -80%;">

            </div>
            <p class="big auto main-text">Наши преимущества</p>
          </div>
          <div  v-if="$device.isDesktop" style="display: block;" class="block_info">
            <div class="flex w-sto jus-sp info_kart_div">
              <div class=" w-sto flex">
                <div class="w-sto auto auto">
                  <Advantages_slider :add_item_list="get_obj_text('2', 'add_item_list')"></Advantages_slider>
                </div>
              
            </div>
            
            </div>
            
            
            
          </div>
          <to-scroll :id="'eco'">
          <div style="display: block;" class="block_info">
            <div class="flex w-sto jus-sp info_kart_div">
              <div class="kart">
              <div class="w-sto h_sto">
                <nuxt-img
                        loading="lazy" format="webp" style="border-radius: 40px;" class="w-sto h_sto" :src="`${$api_root.slice(0, -1)}${get_obj_text('3', 'image')}`" alt=""/>
              </div>
            </div>
              <div class="dostav_info flex">
                <div class="w-sto auto">
                  <p class="small-big VAG" style="line-height: 1;">{{ get_obj_text('3', 'title') }}</p>
              <p class="small m2">
                {{ get_obj_text('3', 'text') }}
              </p>
                </div>
              
            </div>
            
            </div>
          </div>
            </to-scroll>
            
            
          <to-scroll :id="'news'">
          <div class="interactiv auto">

            <div class="flex w-sto text_in_sot">
            <p class="big auto main-text">Новости</p>
          </div>
            <section style="padding: 5%;" class="auto grid">
    <article v-for="new_obj in news" :key="new_obj.id" class="grid-item">
        <div class="image">
            <img :src="this.$api_root + new_obj.main_image.slice(1)" />
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
      </to-scroll>
          <to-scroll :id="'sending'">
          <div v-if="!$store.getUser.is_sending" class="interactiv auto">
            <div class="flex w-sto text_in_sot">
            <p class="big auto main-text">Рассылка</p>
          </div>
            <Sending></Sending>
        </div>
        </to-scroll>
        </div>
          <to-scroll :id="'ref'">
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
                    :src="$api_root.slice(0, -1) + get_obj_text('4', 'image')"
                    alt=""
                  />
                </div>
                <p class="small-big predp-name">{{ get_obj_text('4', 'director') }}</p>
                <p class="small">Директор компании </p>
              </div>
              <div class="predp-text flex">
                <p class="small-big">
                  {{ get_obj_text('4', 'text') }}
                </p>
              </div>
            </div>
          </div>
          <div class="interactiv">

          </div>
        </div>
        </to-scroll>
      </div>
    </div>
  </template>
  <style >

@import "https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.1.0/css/swiper.min.css";
</style>
  <style lang="css" src="../assets/css/main/main.css" scoped></style>
  <style lang="css" src="../assets/css/news_min.css" scoped></style>
  <style lang="css" src="../assets/css/main/hex-tovar.css" scoped></style>
  <style >
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
  import getTextList from "~/additional_func/getTexts";
  import axios from "axios";
  import newsList from "~/additional_func/News/newsList";
import Advantages_slider from '../components/AddtionalComp/advantages_slider.vue';
import ToScroll from '../components/AddtionalComp/ToScroll.vue';
import { api_root } from "~/main";
  export default {
    name: "IndexItem",
    components: {
    Swiper,
    SwiperSlide,
    LoadingComp,
        Advantages_slider,
        ToScroll
},

    data() {
      return {
        popular_product: null,
        wrapper_active: false,
        type_weigth_id: null,
        type_pack_id: null,
        news: [],
        data_text_list: []
      };
    },
    async created() {

    },
    async mounted() {
      self = this
      let r_ = await getTextList()
      this.data_text_list = r_.data
    axios({
      url: `${this.$api_root}api/v0.1/beekeeper_web_api/product/search/?size=5&order_by=count_purchase`,
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

      get_obj_text(type, field){
        let obj = this.data_text_list.filter(f => f.type == type)
        console.log(obj[field], obj)
        try{

          return obj[0][field]
        }
        catch {
          return ""
        }
      },

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