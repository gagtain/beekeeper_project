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
                    
                      ><div class="h_sto flex" style="min-height: 400px;">
                        <p :style="$device.isDesktop ? 'width: 50%' : ''" style="line-height: 1;" :class="!$device.isDesktop ? 'small': 'small-big'" class="small-big VAG auto">Пасека распологается на территории заповедника с лесным массивом около 6 тыс. га., вдали от всевозможных промышленных и производственных предприятий. Соответственно мёд собран в экологически чистом месте и имеет натуральный состав.</p>
                   
                      </div>
                    </swiper-slide><swiper-slide

                      ><div class="h_sto flex" style="min-height: 400px;">
                        <p :style="$device.isDesktop ? 'width: 50%' : ''" style="line-height: 1;" :class="!$device.isDesktop ? 'small': 'small-big'" class="small-big VAG auto">Большое разнообразие растений,  цветущих на близлежащих лугах и в лесу даёт неповторимый аромат и вкус меду.</p>
                   
                      </div>
                    </swiper-slide> <swiper-slide

                      ><div class="h_sto flex" style="min-height: 400px;">
                        <p :style="$device.isDesktop ? 'width: 50%' : ''" style="line-height: 1;" :class="!$device.isDesktop ? 'small': 'small-big'" class="small-big VAG auto">Реализация меда производится в нескольких видах: сотовый мёд - в сотах;  забрусовый мёд и разливной мёд- в емкостях разного объёма.</p>
                   
                      </div>
                    </swiper-slide>
                      <swiper-slide

                      ><div class="h_sto flex" style="min-height: 400px;">
                        <p :style="$device.isDesktop ? 'width: 50%' : ''" style="line-height: 1;" :class="!$device.isDesktop ? 'small': 'small-big'" class="small-big VAG auto">Чернозем, имеющий в своём составе огромное количество микроэлементов,  насыщает ими нектар цветущих растений.</p>
                   
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