<template>
    <button v-if="isFavorite" @click="removeFavoriteBtn()" id="favorite" class="fav-btn flex auto">
      <img
        class="auto"
        :src="`${$api_root}static/online_store/images/favorite/favorite_add.png`"
        alt=""
      />
      из
    </button>
    <button v-else id="favorite" @click="addFavoriteBtn()" class="fav-btn flex auto">
      <img
        class="auto"
        :src="`${$api_root}static/online_store/images/favorite/favorite_add.png`"
        alt=""
      />
    </button>
</template>
<style scoped>
.fav-btn{
    box-shadow: 2px 2px 25px -7px black;
    height: 53px;
    cursor: pointer;
    width: 53px;
    border-radius: 50%;
    background-color: rgb(245, 173, 40);
    border: none;
}
.fav-btn:active {
    background-color: rgb(245, 173, 40);
    scale: 0.96;
    color: #000;
}
.fav-btn img{
    height: 25px;
    width: 25px;
}
</style>
<script>
import addFavorite from '../../additional_func/addFavorite'
import removeFavorite from '../../additional_func/removeFavorite'
import {mapGetters} from 'vuex'
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
    created() {
        let self = this
            let a = this.USER_STATE.favorite_product.find(function(item){
                console.log(item)
            if (item.id == self.id){
                return true
            }else{
                return false
            }
            })
            if (a){
                this.isFavorite = true
            }else{
                
                this.isFavorite = false
            }
    },
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
  },
  computed:{
    ...mapGetters([
        'USER_STATE'
    ])
}
}
</script>
