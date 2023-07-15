<template>
    <div id="text_prel" class="mt-2">
        <p v-bind:style="{width: el.width + '%',
         margin: el.margin,
         marginBottom: el.margin_bottom + '%',
         fontSize: el.font_size+'px',
         color: el.color
         }"
         :align="el.align">{{ el.text }}</p>
    </div>
</template>
<script>
export default {
    el: '#text_prel',
    props: ['el', 'index'],
        
}
</script>
 
