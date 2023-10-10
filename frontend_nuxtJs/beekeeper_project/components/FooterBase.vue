<template>
  <div id="footer">
    <footer class="flex" id="deks">
      <div class="interactiv flex jus-sp auto">
        <div class="foo">
          <p class="foo_p">КОМПАНИЯ</p>
          <nuxt-link to="/about_us" no-prefetch>
            <p class="foo_p_li">О нас</p></nuxt-link
          >
        </div>
        <div class="foo">
          <p class="foo_p">ПОЛЕЗНОЕ</p>
          <p class="foo_p_li foo_p_li_perv"><a href="/public/docs/delivery.docx" class="foo_p_li foo_p_li_perv">Доставка</a></p>
        </div>
        <div class="foo">
          <p class="foo_p">ПОКУПАТЕЛЮ</p>
          <p class="foo_p_li foo_p_li_perv">Избранное</p>
          <p class="foo_p_li"><a href="/public/docs/polzovsogl.docx" class="foo_p_li">Пользовательское соглашение</a></p>
        </div>
      </div>
    </footer>
    <footer id="mobs">
      <div class="interactiv auto">
        <div class="">
          <div class="foo_mobile flex jus-sp" id="mobs">
            <p class="foo_p">Компания</p>
            <div class="foo_mobile_butt" @click="active_footer_mob(0)">
              <img src="~/assets/images/892498.png" alt="" />
            </div>
          </div>
          <div class="auto foo_mobile_contect" id="mob">
          <nuxt-link to="/about_us" no-prefetch>
            <p class="foo_p_li">О нас</p></nuxt-link
          >
          </div>
        </div>
        <div class="">
          <div class="foo_mobile flex jus-sp" id="mobs">
            <p class="foo_p">ПОЛЕЗНОЕ</p>
            <div class="foo_mobile_butt" @click="active_footer_mob(1)">
              <img src="~/assets/images/892498.png" alt="" />
            </div>
          </div>
          <div class="auto foo_mobile_contect" id="mob">
          <p class="foo_mobile_p"><a href="/public/docs/delivery.docx" class="foo_mobile_p">Доставка</a></p>
          </div>
        </div>
        <div class="">
          <div class="foo_mobile flex jus-sp" id="mobs">
            <p class="foo_p">ПОКУПАТЕЛЮ</p>
            <div class="foo_mobile_butt" @click="active_footer_mob(2)">
              <img src="~/assets/images/892498.png" alt="" />
            </div>
          </div>
          <div class="auto foo_mobile_contect" id="mob">
          <p class="foo_mobile_p">Избранное</p>
          <p class="foo_mobile_p"><a href="/public/docs/polzovsogl.docx" class="foo_p_li">Пользовательское соглашение</a></p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
<style lang="css" src="../assets/css/interactive/footer.css"></style>

<script>
export default defineNuxtComponent({
  el: "#footer",
  name: "FooterBase",
  setup() {},
  methods: {
    active_footer_mob(id) {
      let list_footer_mobail_menu_item =
        document.getElementsByClassName("foo_mobile_contect");
      let item = list_footer_mobail_menu_item[id];
      item.classList.toggle("active");
    },
  },
});
</script>
