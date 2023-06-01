$('.mob_men').on('click', function(){
    $(this).toggleClass('menu_active')
    $('.menu_pop_mob').toggleClass('menu_pop_mob_active')
    $('.menu_pop_mob_zatem').toggleClass('menu_pop_mob_zatem_active')
})
$('.menu_pop_mob_zatem').on('click', function(){
    $('.mob_men').toggleClass('menu_active')
    $('.menu_pop_mob').toggleClass('menu_pop_mob_active')
    $('.menu_pop_mob_zatem').toggleClass('menu_pop_mob_zatem_active')
})