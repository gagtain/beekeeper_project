<template>
  <div>
    <div class="wrapper">
      <div class="absolute main-nak"></div>
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
              <img src="images/phel.png" class="phel" alt="" />
              <div class="slider-produtos-wrap">
                <swiper
    :slidesPerView="1"
    :spaceBetween="30"
    :autoplay="{
      delay: 3000,
      disableOnInteraction: true,
    }"
    speed="5000"
    :modules="modules"
  >
    <swiper-slide><img
                        src="http://localhost:8000/static/online_store/images/honey.png"
                        class="main_img"
                        width="100%"
                        height="100%"
                        alt=""
                      /></swiper-slide>
    <swiper-slide><img
                        src="http://localhost:8000/static/online_store/images/honey.png"
                        class="main_img"
                        width="100%"
                        height="100%"
                        alt=""
                      /></swiper-slide>
    <swiper-slide><img
                        src="http://localhost:8000/static/online_store/images/honey.png"
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
        <div class="flex w-sto text_in_sot">
          <p class="big auto main-text">Популярные товары</p>
        </div>
        <div class="block_info sliders big-block">
          <div class="slider-produtos-wrap">

           <swiper
    :slidesPerView="1"
    :spaceBetween="30"
    :navigation="true"
    speed="5000"
    :modules="modules"
  >
    <swiper-slide>
      <div class="hex slide auto">
                    <section class="product">
                      <div class="product__photo">
                        <div class="photo-container">
                          <div class="photo-main">
                            <div class="controls"></div>
                            <img
                              width="100%"
                              height="100%"
                              src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/d7516b44740087.581c4d069eaf8.jpg "
                              alt="green apple slice"
                            />
                          </div>
                          <div class="photo-album flex jus-sp">
                            <img
                              class="add-img-tovar"
                              src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/d7516b44740087.581c4d069eaf8.jpg"
                            />
                            <img
                              class="add-img-tovar"
                              src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/d7516b44740087.581c4d069eaf8.jpg"
                            />
                            <img
                              class="add-img-tovar"
                              src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/d7516b44740087.581c4d069eaf8.jpg"
                            />

                            <img
                              class="add-img-tovar"
                              src="https://res.cloudinary.com/john-mantas/image/upload/v1537303708/codepen/delicious-apples/apple-top.png"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="product__info">
                        <div class="title">
                          <p class="small-big product__name">
                            pop_product.name
                          </p>
                          <span class="very-small product__code"
                            >COD: pop_product.id
                          </span>
                        </div>
                        <div class="price">
                          <span class="product__price big">
                            100
                            <span class="product__price small">
                              руб
                            </span></span
                          >
                        </div>
                        <div class="variant">
                          <h3>Размер</h3>
                          <div class="flex">
                            <ul class="variant-ul">
                              <li class="photo-album-li">
                                <div class="h_sto">
                                  
                                  <p>100 гр</p>
                                </div>
                              </li>
                              <li class="photo-album-li">
                                <div class="h_sto">
                                 
                                  <p class="normal-small">250 гр</p>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div class="product__text">
                          <p class="small">pop_product.description</p>
                        </div>
                        <button class="btn">Добавить в корзину</button>
                      </div>
                    </section>
                  </div>
    </swiper-slide>
</swiper>
          </div>

        </div>
      </div>
      <div class="flex w-sto text_in_sot">
        <p class="big auto main-text">О нашем товаре</p>
      </div>
      <div class="ref-block w-sto flex">
        <div class="interactiv auto h-sto flex">
          <div class="block_info o_product auto">
            <div class="predp">
              <div class="predp-img auto">
                <img
                  width="100%"
                  height="100%"
                  src="http://localhost:8000/static/online_store/images/3.jpg"
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
<style>
@import "../assets/css/main/main.css";
@import "../assets/css/main/hex-tovar.css";
@import "../assets/css/interactive/slider.css";
.main_img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import 'swiper/css';
import { Autoplay, Navigation } from 'swiper';
export default {
  name: "IndexItem",
  components: {
    Swiper,
    SwiperSlide,
  },
  created() {
    console.log(this.$api_root)
  },
  methods: {
    addScript(src) {
      let externalScript = document.createElement("script");
      externalScript.setAttribute("src", src);
      document.body.appendChild(externalScript);
    },
  },
  
  setup() {
      return {
        modules: [Autoplay, Navigation],
      };
    },
};
</script>
