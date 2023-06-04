<template>
    <button v-if="isFavorite" @click="removeFavoriteBtn()" id="favorite" class="btn fav-btn flex auto">
      <img
        class="auto"
        :src="`${$api_root}static/online_store/images/favorite/favorite_add.png`"
        alt=""
      />
      из
    </button>
    <button v-else id="favorite" @click="addFavoriteBtn()" class="btn fav-btn flex auto">
      <img
        class="auto"
        :src="`${$api_root}static/online_store/images/favorite/favorite_add.png`"
        alt=""
      />
    </button>
</template>
<style scoped>
.fav-btn{
    padding: 5%;
    border-radius: 50px;
    background-color: rgb(245, 173, 40);
}
.fav-btn img{
    height: 25px;
    width: 25px;
}
</style>
<script>
import addFavorite from '../../additional_func/addFavorite'
import removeFavorite from '../../additional_func/removeFavorite'
export default {
  el: "#favorite",
  name: "FavoriteComp",
props: ['id'],
  data(){
    return {
        isFavorite: false
    }
  },
  setup() {},
  methods:{
    async addFavoriteBtn(){
            let response_add = await addFavorite(this.id)
            if (response_add.status == 200){
                this.isFavorite = true
            }  

    },
    async removeFavoriteBtn(){

            let response_add = await removeFavorite(this.id)
            if (response_add.status == 200){
                this.isFavorite = false
            }  
    }
  }
};
</script>
