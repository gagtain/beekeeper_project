<template>
  <div class="sot-ob">
    <DialogWindow id="dialog-data">
        
    </DialogWindow>
      <div class="wrapper-product w-sto flex">
        <div class="interactiv auto back">
            <div class="about_us">
<div class="flex w-sto">

    <p class="small-big VAG auto">О нас</p>
</div>
    <div class="flex w-sto inf">
        <div class="to_info">
            <div class="img flex">
                <img style="width: 200px; height: 200px; margin: auto;" src="/favicon.ico" alt="">
            </div>
            <div class="desk m2">
                <p class="small">Пчелиная артель</p>
                <p class="small">Основатель: {{ get_obj_text("5", "director") }}</p>
                </div>
        </div>
        <div class="big_info">

        <p class="small VAG auto">Реквизиты компании</p>

        <p class="normal-small">Название юр. лица: ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ТАМБОВСКАЯ ПАСЕКА "ПЧЕЛИНАЯ АРТЕЛЬ"</p>
        <p class="normal-small">ОГРН:  1196820006888</p>
        <p class="normal-small">ИНН: 6830007878</p>

        <p class="small VAG auto">Контакты</p>

        <p class="normal-small">Почтовый адрес: Тамбовская обл, г. Уварово, пер. Большой Садовый, д. 28А</p>
        <p class="normal-small">Номер телефона: {{ get_obj_text("5", "number") }}</p>
        <p class="normal-small">Контактная почта: {{ get_obj_text("5", "email") }}</p>
        
           </div>
    </div>
<!--
<div class="flex w-sto">

<p class="small-big VAG auto">Достижения</p>
</div>

<div class="flex w-sto">

<p class="small-big VAG auto">Сертификаты</p>
</div> -->
            </div>
        </div>
        </div>
        </div>

</template>

<script>
import DialogWindow from '~/components/AddtionalComp/Dialog.vue'
  import getTextList from "~/additional_func/getTexts";
export default {
    components:{
        DialogWindow
    },
    data(){
        return {
            data_text_list: []
        }
    },
    async mounted(){

        let r_ = await getTextList()
      this.data_text_list = r_.data
    },
    methods:{
      get_obj_text(type, field){
        let obj = this.data_text_list.filter(f => f.type == type)
        console.log(obj[field], obj)
        try{

          return obj[0][field]
        }
        catch {
          return ""
        }
      },
        showData(){
        console.log('asdasd')
        let a = document.getElementById('dialog-data')
        a.showModal();
        }
    }
}
</script>

<style>
.inf .to_info{
    width: 25%;
}
.inf .big_info{
    width: 70%;
    margin-left: 5%;
}
.wrapper-product {
    padding-top: 200px;
    min-height: 102vh;
    background: url('~/assets/images/sot.png') repeat;

    padding-bottom: 3%;
}

.filter_div {
    position: relative;
    width: 15%;
    padding-top: 3%;
}

.sot-ob {
    background: rgb(241, 195, 96);
}

.back {
  background: antiquewhite;
  padding: 2%;
  border-radius: 5px;  
  min-height: 833px;
}
.about_us{
    background-color: rgb(160, 166, 62);
padding: 2%;
border-radius: 5px;
height: 100%;
}
@media (max-width: 768px){
    .inf{
        display: block;
    }
    .inf .to_info{
        width: 100%;
    }
    .inf .big_info{
        margin: 0;
        width: 100%;
    }
    
}
</style>