<template>
                <div  class="slider-produtos-wrap auto h_sto" style="min-height: 400px;">
                  <swiper
                    :slidesPerView="1"
                    :spaceBetween="500"
                :navigation="true"
                    :autoplay="{
                      delay: 3000,
                      disableOnInteraction: true,
                    }"
                speed=1500
                    :modules="modules"
                    class="h_sto"
                  >
                    <swiper-slide
                      v-for="obj in add_item_list" :key="obj.id"
                      ><div class="h_sto flex" style="min-height: 400px;">
                        <p :style="$device.isDesktop ? 'width: 50%' : ''" style="line-height: 1;" :class="!$device.isDesktop ? 'small': 'small-big'" class="small-big VAG auto">{{ obj.text }}</p>
                   
                      </div>
                    </swiper-slide>
                  </swiper>
                </div>
</template>
<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { Autoplay, Navigation } from "swiper";
export default {
    props: ["add_item_list"],
    components : {
        Swiper, SwiperSlide
    },
    setup() {
      return {
        modules: [Autoplay, Navigation],
      };
    },
}
</script>

<style>

@import "https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.1.0/css/swiper.min.css";
</style>