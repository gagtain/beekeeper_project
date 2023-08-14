<template>
  <div class="photo-album flex" id="photo-album">
                        <nuxt-img
                        loading="lazy" format="webp"
      @click="a($event)"
      class="add-img-tovar"
      :src="$api_root + image.slice(1)"
    />
                        <nuxt-img
                        loading="lazy" format="webp"
      @click="a($event)"
      v-for="(img, index) in ImageProductList"
      :key="index"
      class="add-img-tovar"
      :src="$api_root + img.photo.slice(1)"
    />
  </div>
</template>
<style lang="css" src="../../assets/css/main/hex-tovar.css" scoped></style>
<script>
export default {
  el: "#photo-album",
  name: "TovarMinImageList",

  props: ["image", "ImageProductList"],
  created() {
    console.log(this.ImageProductList);
  },
  methods: {
    a(img) {
      img.srcElement.parentElement.parentElement.firstChild.getElementsByTagName(
        "img"
      )[0].src = img.srcElement.src;
    },
  },
};
</script>
