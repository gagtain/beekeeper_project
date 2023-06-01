
import $ from 'jquery'
$('.wrapper').on('mousemove', (par) => {
    const x = par.pageX / $(window).width();
    const y = par.pageY / $(window).height();
    $('.phel').css(
        'transform',
        'translate(-' + x * 10 + 'vh, -' + y * 10 + 'vh)'
    );
}
);

const swiper = new Swiper('.slider-product', {
    // Optional parameters
    slidesPerView: 1,
    spaceBetween: 30,
    navigation:{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    },
    autoplay: {
        delay: 3000,
        disableOnInteraction: true
      },
    speed: 1000,
    loop: true
  });

  const swipper_main = new Swiper('.slider-main', {
    // Optional parameters
    slidesPerView: 1,
    spaceBetween: 30,
    autoplay: {
        delay: 3000,
        disableOnInteraction: true
      },
      speed: 5000,
      loop: true
  });


  $( document ).ready(function() {
    setTimeout(function() {
        $('.main-nak').toggleClass('active')
    }, (300));
    
});

counter = 0;
