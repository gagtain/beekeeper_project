<template>
    
    <div class="sot-ob">
        <div class="wrapper flex">
            <div class="user_card flex auto">
                <div class="interactiv user_card_div auto" id="basket_main">

                    <UserBasket></UserBasket>
                    
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css" src="../assets/css/account.css"></style>

<script>
import UserBasket from './UserComp/UserBasket.vue'
export default {
    el:"basket_main",
    name: "BasketBase",
    components:{
        UserBasket
    }
}
</script>