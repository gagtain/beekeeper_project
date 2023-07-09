<template>
  <div>
    <div class="wrapper">
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
                <button class="main_bt">
                  <div class="flex sto">
                    <p class="main_bt_p">Попробовать!</p>
                  </div>
                </button>
              </div>
            </div>
            <div class="main_img_div">
              <img
                :src="`${$api_root}static/online_store/images/phel.png`"
                class="phel"
                alt=""
              />
              <div class="slider-produtos-wrap h_sto">
                <swiper
                  :slidesPerView="1"
                  :spaceBetween="500"
                  :autoplay="{
                    delay: 3000,
                    disableOnInteraction: true,
                  }"
                  speed="5000"
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
              speed="1500"
              :modules="modules"
            >
              <swiper-slide
                v-for="(pop_product, index) in popular_product"
                :key="index"
              >
                <div class="hex slide auto">
                  <PopularProduct :pr="pop_product"></PopularProduct>

                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
        <div class="block_info">
          <div class="dostav_info">
            <p class="big p-block">Доставка</p>
            <p class="small-big">
              Наша доставка распространяется на города: Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Enim, architecto veritatis? Aut
              iure labore qui ut molestiae minima repudiandae obcaecati beatae
              illo. Aliquam debitis minus consequuntur illum et natus. Incidunt.
            </p>
          </div>
          <div class="kart">
            <iframe
              src="https://yandex.ru/map-widget/v1/?um=constructor%3Acb54edd63e0d97f14a269aa9794fd46e0f207bd9929fbc582dc52579023e60d0&amp;source=constructor"
              width="100%"
              height="100%"
              frameborder="0"
            ></iframe>
          </div>
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
      </div>
    </div>
  </div>
</template>
<style lang="css" src="../assets/css/main/main.css" scoped></style>
<style lang="css" src="../assets/css/main/hex-tovar.css" scoped></style>
<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.1.0/css/swiper.min.css";
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
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { Autoplay, Navigation } from "swiper";
import getCookie from "../additional_func/getCookie";
import axios from "axios";
import PopularProduct from "./AddtionalComp/PopularProduct.vue"
export default {
  name: "IndexItem",
  components: {
    Swiper,
    SwiperSlide,
    PopularProduct
  },
  async created() {
    console.log(this.$api_root);
    let self = this;
    axios({
      url: `${this.$api_root}/api/v0.1/beekeeper_web_api/get_popular_product?size=3`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("assess")}`,
      },
    })
      .then(function (response) {
        self.popular_product = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  mounted() {
    this.wrapper_active = true;
    let recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute(
      "src",
      `${this.$api_root}static/online_store/js/main.js`
    );
    document.head.appendChild(recaptchaScript);
  },
  methods: {
    select_type_weigth(pk){
      console.log(pk)
      this.type_weigth_id = pk
    },
    select_type_pack(pk){
      console.log(pk)
      this.type_pack_id = pk
    }},

  setup() {
    return {
      modules: [Autoplay, Navigation],
    };
  },

  data() {
    return {
      popular_product: null,
      wrapper_active: false,
      type_weigth_id: null,
      type_pack_id: null
    };
  },
};
</script>
