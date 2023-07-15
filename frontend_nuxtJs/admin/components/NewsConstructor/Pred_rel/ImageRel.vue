<template>
    
    <div class="mt-2">
            <div :style="{width: 100+'%', height: el.height+'px', marginBottom: el.margin_bottom + '%'}" style="display: flex;">
                
            <img class="img_news" v-bind:style="{width: el.width + '%', margin: el.margin}" style="height: 100%;" :id="el.id" :src="el.img_src" alt="">
        
        </div>
    </div>
</template>


<script>
export default {
    props:['el', 'select_id_media'],
    
}
</script>