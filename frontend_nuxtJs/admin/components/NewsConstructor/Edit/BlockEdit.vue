<template>
    <div style="margin-left: 3px;" class="dropdown" @click.stop>
            <button id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle">Высота блока</button>
   
          <ul class="dropdown-menu" @click.stop aria-labelledby="navbarDropdown">
            <div class="mt-2 dropdown">
                <li><p class="dropdown-item"  @click.stop="height_refactor()">Высота <input @click.stop v-model="height" type="text" name="" id=""></p></li>

        </div>
                
          </ul>
        </div>
</template>

<script>
export default {
    props:['el'],
    data(){
        return{
            height: '0'
        }
    },
    setup() {
        
    },
    methods:{
        height_refactor(){
            this.el.height = this.height
        }
    }
}
</script>