<template>
    <div id="footer">
<footer class="flex" id="deks">
        <div class="interactiv flex jus-sp auto">
            <div class="foo">
                <p class="foo_p">Компания</p>
                <p class="foo_p_li foo_p_li_perv">О нас</p>
                <p class="foo_p_li">Контакты</p>
            </div>
            <div class="foo">
                <p class="foo_p">ПОЛЕЗНОЕ</p>
                <p class="foo_p_li foo_p_li_perv">Оплата и доставка</p>
                <p class="foo_p_li">Условия возврата</p>
                <p class="foo_p_li">Бонусная система</p>
            </div>
            <div class="foo">
                <p class="foo_p">ПОКУПАТЕЛЮ</p>
                <p class="foo_p_li foo_p_li_perv">Избранное</p>
                <p class="foo_p_li">Публичная оферта</p>
                <p class="foo_p_li">Политика конфиденциальности</p>
            </div>
            <div class="foo">
                <p class="foo_p">КОНТАКТЫ</p>
                <div class="foo_img">
                    <span class="material-symbols-outlined">
                        expand_more
                    </span>

                    <span class="material-symbols-outlined">
                        expand_more
                    </span>
                </div>
                <p class="foo_p_li">О нас</p>
                <p class="foo_p_li">Контакты</p>
            </div>
        </div>
    </footer>
    <footer id="mobs">
        <div class="interactiv auto">
            <div class="">

                <div class="foo_mobile flex jus-sp" id="mobs">
                    <p class="foo_p">Компания</p>
                    <div class="foo_mobile_butt" onclick="active_footer_mob($(this))">
                        <span class="material-symbols-outlined">expand_more</span>
                    </div>
                </div>
                <div class="auto foo_mobile_contect" id="mob">
                    <p class="foo_mobile_p">О нас</p>
                    <p class="foo_mobile_p">Контакты</p>
                </div>
            </div>
            <div class="">

                <div class="foo_mobile flex jus-sp" id="mobs">
                    <p class="foo_p">Компания</p>
                    <div class="foo_mobile_butt" onclick="active_footer_mob($(this))">

                        <span class="material-symbols-outlined">expand_more</span>
                    </div>
                </div>
                <div class="auto foo_mobile_contect" id="mob">
                    <p class="foo_mobile_p">О нас</p>
                    <p class="foo_mobile_p">Контакты</p>
                </div>
            </div>
            <div class="">

                <div class="foo_mobile flex jus-sp" id="mobs">
                    <p class="foo_p">Компания</p>
                    <div class="foo_mobile_butt" onclick="active_footer_mob($(this))">

                        <span class="material-symbols-outlined">expand_more</span>
                    </div>
                </div>
                <div class="auto foo_mobile_contect" id="mob">
                    <p class="foo_mobile_p">О нас</p>
                    <p class="foo_mobile_p">Контакты</p>
                </div>
            </div>
            <div class="">

                <div class="foo_mobile flex jus-sp" id="mobs">
                    <p class="foo_p">Компания</p>
                    <div class="foo_mobile_butt" onclick="active_footer_mob($(this))">

                        <span class="material-symbols-outlined">expand_more</span>
                    </div>
                </div>
                <div class="auto foo_mobile_contect" id="mob">
                    <p class="foo_mobile_p">О нас</p>
                    <p class="foo_mobile_p">Контакты</p>
                </div>
            </div>

        </div>
    </footer>
    </div>
</template>
<style lang="css" src="../assets/css/interactive/footer.css"></style>

<script>

export default({
    el: '#footer',
    name: 'FooterBase',
    setup() {
        
    },
})
</script>
