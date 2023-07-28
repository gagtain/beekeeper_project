<template>
    <div class="sot-ob">
        <div class="wrapper flex w-sto">

            <div class="tovar_in flex interactiv jus-sp auto" id="tovar">
                <tovar v-if="tovar" :pr="tovar"></tovar>
            </div>
        </div>
    </div>
</template>

<style lang="css" src="../../assets/css/tovar.css" scoped></style>
<script>
import getTovar from "../../additional_func/getTovar"
import Tovar from '../../components/Tovar/Tovar.vue'
export default {
    el: '#tovar',
    name: 'TovarBase',
    components:{
        Tovar
    },
        
    data(){
        return {
            tovar: null,
        }
    },
    async created(){
        let response_tovar = await getTovar(this.$route.params.id)
        console.log(response_tovar)
        if (response_tovar.status == 200){
            this.tovar = response_tovar.data
        }
    },
}
</script>