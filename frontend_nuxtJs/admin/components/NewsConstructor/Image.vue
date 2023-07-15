<template>
    
    <div class="mt-2">
            <div :style="{width: 100+'%', height: el.height+'px', marginBottom: el.margin_bottom + '%'}" style="display: flex;">
                
            <img v-bind:style="{width: el.width + '%', margin: el.margin}" style="height: 100%;" :id="el.id" :src="el.img_src" alt="">
        
        </div>
            <input @change="file_load($event)" :id="el.id+'input'" style="display: none;" type="file" name="">
        <div style="display: flex; padding: 1%; padding-left: 0;">

<general-edit :el="el"></general-edit>
<block-edit style="margin-left: 3px;" :el="el"></block-edit>
</div>
    </div>
</template>


<script>
import BlockEdit from './Edit/BlockEdit.vue';
import GeneralEdit from './Edit/GeneralEdit.vue';
export default {
    props:['el', 'select_id_media'],
    components:{GeneralEdit, BlockEdit},
    setup() {
        
    },
    data(){
        return{
            img_src: ''
        }
    },
    mounted(){
        console.log(213)
            setTimeout(() => {
                 let file_input = document.getElementById(this.el.id+'input')
                 console.log(this.el.input_id)
                 file_input.click() 
                }, 1000);
    },
    methods:{
        file_load(event) {
    var target = event.target;

    if (!FileReader) {
        alert('FileReader не поддерживается — облом');
        return;
    }

    if (!target.files.length) {
        alert('Ничего не загружено');
        return;
    }

    var fileReader = new FileReader();
    fileReader.onload = () => {
        this.el.img_src = fileReader.result;
    }
        

    fileReader.readAsDataURL(target.files[0]);
    this.el.submit = 'true'
}
    }
    
}
</script>