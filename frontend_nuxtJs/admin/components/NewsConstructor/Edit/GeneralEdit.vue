<template>
    <div style="display: flex;">
        <div class="dropdown" @click.stop>
            <button id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle">Изменить ширину</button>
            
          <ul class="dropdown-menu" @click.stop aria-labelledby="navbarDropdown">
            <div class="mt-2 dropdown">
                <li><p class="dropdown-item"  @click.stop="width_refactor(index)">Ширина <input @click.stop v-model="width" type="text" name="" id=""></p></li>

        </div>
                
          </ul>
        </div>
        <div style="margin-left: 3px;" class="dropdown" @click.stop>
            <button id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle">Отступ</button>
   
          <ul class="dropdown-menu" @click.stop aria-labelledby="navbarDropdown">
            <div class="mt-2 dropdown">
                <p class="dropdown-item" @click.stop="margin_refactor('auto auto auto 0')">слева</p>
                <p class="dropdown-item" @click.stop="margin_refactor('auto 0 auto auto')">справо</p>
                <p class="dropdown-item" @click.stop="margin_refactor('auto')">центр</p>
        </div>
                
          </ul>
        </div>
        <div style="margin-left: 3px;" class="dropdown" @click.stop>
            <button id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle">Отступ от объекта снизу</button>
   
          <ul class="dropdown-menu" @click.stop aria-labelledby="navbarDropdown">
            <div class="mt-2 dropdown">
                <li><p class="dropdown-item"  @click.stop="margin_bottom_refactor(index)">Отступ <input @click.stop v-model="margin_bottom" type="text" name="" id=""></p></li>

        </div>
                
          </ul>
        </div>
    </div>
</template>

<script>
export default {
    props:['el'],
    data(){
        return{
            width: '100',
            margin_bottom: '0'
        }
    },
    setup() {
        
    },
    methods:{

        margin_refactor(sett){
            this.el.margin = sett
        },
        width_refactor(index){
            this.el.width = this.width
        },
        margin_bottom_refactor(){
            this.el.margin_bottom = this.margin_bottom
        }
    }
}
</script>