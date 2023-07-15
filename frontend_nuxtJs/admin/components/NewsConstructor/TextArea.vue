<template>
    <div class="mt-2">
    <div v-if="el.submit == 'none'" class="mt-2">

            <textarea v-model="el.text" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
        
        <div style="display: flex;" class="mt-2 w-100">
        <button style="margin: auto;" @click="text_area_sub(index)" class="btn btn-primary">Подтвердить</button>
        </div>
    </div>
    <div v-else>
        <p v-bind:style="{width: el.width + '%',
         margin: el.margin,
         marginBottom: el.margin_bottom + '%',
         fontSize: el.font_size+'px',
         color: el.color
         }"
         :align="el.align">{{ el.text }}</p>
        <div style="display: flex; flex-wrap: wrap; padding: 1%; padding-left: 0;">

            <text-edit style="margin-left: 3px;" :el="el">Изменить текст</text-edit>
        <general-edit style="margin-left: 3px; margin-top: 2px;" :el="el"></general-edit>
        </div>
    </div>
    </div>
</template>

<script>
import GeneralEdit from './Edit/GeneralEdit.vue'
import TextEdit from './Edit/TextEdit.vue'
export default {
  components: { TextEdit, GeneralEdit },
    props: ['el', 'index'],
    setup() {
        
    },
    methods:{
        text_area_sub(index){
            console.log(213)
            this.$emit('text_area_sub', index)
        },
    }
        
}
</script>
 
